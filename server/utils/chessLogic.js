class ChessGame {
  constructor() {
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    this.turn = "white";
    this.gameOver = false;
    this.gameStatus = "";
    this.winner = "";
    this.longCastle = [true, true];
    this.shortCastle = [true, true];
    this.castled = [0, 0];
  }

  isGameOver() {
    return this.gameOver;
  }

  fen() {
    return this.fen;
  }

  gameStatus() {
    return this.gameStatus;
  }

  move(from, to) {
    var x = parseInt(from[0]);
    const y = parseInt(from[1]);
    if (isNaN(x)) x = this.getLetterValue(from[0]);
    var x2 = parseInt(to[0]);
    const y2 = parseInt(to[1]);
    if (isNaN(x2)) x2 = this.getLetterValue(to[0]);
    const newfrom = [x, y];
    const newto = [x2, y2];
    if ((this.getFenValue(newfrom[0], newfrom[1])).charCodeAt(0) > 90 !== (this.turn === "black")) {
      return false
    }
    var verify = this.Verification(newfrom, newto);
    var previousBoard = this.fen;
    if (verify) {
      var Matrix = this.createMatrix();
      Matrix[8 - newto[1]][newto[0] - 1] =
        Matrix[8 - newfrom[1]][newfrom[0] - 1];
      if (
        Matrix[8 - newto[1]][newto[0] - 1] === "P" &&
        this.PromotePawn(false, newto)
      )
        Matrix[8 - newto[1]][newto[0] - 1] = "Q";
      if (
        Matrix[8 - newto[1]][newto[0] - 1] === "p" &&
        this.PromotePawn(true, newto)
      )
        Matrix[8 - newto[1]][newto[0] - 1] = "q";
      Matrix[8 - newfrom[1]][newfrom[0] - 1] = "-";
      if (this.castled[0] === 1) {
        Matrix[7][5] = 'R'
        Matrix[7][7] = "-";
        this.castled[0] = 0;
      }
      if (this.castled[1] === 1) {
        Matrix[0][5] = 'r'
        Matrix[0][7] = "-";
        this.castled[1] = 0;
      }
      if (this.castled[0] === 2) {
        Matrix[7][3] = 'R'
        Matrix[7][0] = "-";
        this.castled[0] = 0;
      }
      if (this.castled[1] === 2) {
        Matrix[0][3] = 'r'
        Matrix[0][0] = "-";
        this.castled[0] = 0;
      }
      this.fen = this.MatToFen(Matrix);
      if (
        this.allcheck(
          Matrix[8 - newto[1]][newto[0] - 1].charCodeAt(0) > 90,
          false
        )[0] !== false
      ) {
        this.fen = previousBoard;
        return false
      }
      else this.ChangeTurn();
    }
    // MOVED THIS SECTION AT THE END TO DISPLAY THE STATUS AFTER THE MOVE, AND NOT HAVING TO WAIT THE ENEMY TURN TO DISPLAY IT

    if (this.allcheck(this.turn === "black", false)[0] !== false) {
      if (
        this.checkmate(
          this.turn === "black",
          this.allcheck(this.turn === "black", false)
        )
      ) {
        this.gameOver = true;
        this.gameStatus = "CHECKMATE";
        this.winner = (this.turn === "black")? "white" : "black"
        return true;
      }
      this.gameStatus = "CHECK";
    } else this.gameStatus = "";
    return verify;
  }

  getTurn() {
    return this.turn;
  }

  ChangeTurn() {
    if (this.turn === "white") 
      this.turn = "black";
    else
      this.turn = "white";
  }

  Verification(ori, next) {
    const piece = this.getFenValue(ori[0], ori[1]);
    const captured = this.getFenValue(next[0], next[1]);
    if (
      ((captured.charCodeAt(0) <= 90 && piece.charCodeAt(0) <= 90) ||
        (captured.charCodeAt(0) > 90 && piece.charCodeAt(0) > 90)) &&
      captured !== "-"
    )
      return false;
    switch (piece) {
      case "r":
        return this.Tower(true, ori, next);
      case "R":
        return this.Tower(false, ori, next);
      case "n":
        return this.Knight(ori, next);
      case "N":
        return this.Knight(ori, next);
      case "b":
        return this.Joker(ori, next);
      case "B":
        return this.Joker(ori, next);
      case "q":
        return this.Queen(true, ori, next);
      case "Q":
        return this.Queen(false, ori, next);
      case "k":
        return this.King(true, ori, next);
      case "K":
        return this.King(false, ori, next);
      case "p":
        return this.Pawn(ori, next, true);
      case "P":
        return this.Pawn(ori, next, false);
      default:
        return false;
    }
  }

  MatToFen(matrix) {
    var newfen = "";
    var bonu = 0;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] !== "-") {
          if (bonu !== 0) {
            newfen += bonu.toString();
            bonu = 0;
          }
          newfen += matrix[i][j];
        } else {
          bonu += 1;
        }
      }
      if (bonu !== 0) {
        newfen += bonu.toString();
        bonu = 0;
      }
      newfen += "/";
    }
    newfen = newfen.slice(0, -1);
    return newfen;
  }

  getFen() {
    return this.fen;
  }

  getLetterValue(x) {
    const str = "pabcdefgh";
    for (let index = 0; index < 9; index++) {
      if (x === str[index]) return index;
    }
    return 0;
  }

  createMatrix() {
    var fenmat = this.fen.split("/");
    var matrix = new Array(8);
    for (var ind = 0; ind < matrix.length; ind++) {
      matrix[ind] = new Array(8);
    }
    var lej;
    for (var i = 0; i < 8; i++) {
      lej = 0;
      for (var j = 0; j < 8; j++) {
        if ("012345678".includes(fenmat[i][lej])) {
          for (let index = parseInt(fenmat[i][lej]); index > 0; index--) {
            matrix[i][j + index - 1] = "-";
          }
          j += parseInt(fenmat[i][lej]) - 1;
        } else {
          matrix[i][j] = fenmat[i][lej];
        }
        lej++;
      }
    }
    return matrix;
  }

  getFenValue(x, y) {
    y = 9 - y;
    if (x > 8 || x <= 0) return false;
    if (y > 8 || y <= 0) return false;
    var matrix = this.createMatrix();
    return matrix[y - 1][x - 1];
  }

  Tower(isBlack, ori, next) {
    var bonus = 1;
    if (ori[0] === next[0]) {
      if (ori[1] > next[1]) bonus = -1;
      for (let i = ori[1] + bonus; i !== next[1]; i += bonus) {
        if (this.getFenValue(ori[0], i) !== "-") return false;
      }
                                                                   
      if (this.getFenValue(ori[0], ori[1]) !== (isBlack? 'q' : 'Q') && ((ori[0] === 8 && ori[1] === 8 && isBlack) || (ori[0] === 8 && ori[1] === 1 && !isBlack)))
        this.shortCastle[isBlack? 1 : 0] = false
      if (this.getFenValue(ori[0], ori[1]) !== (isBlack? 'q' : 'Q') && ((ori[0] === 1 && ori[1] === 8 && isBlack) || (ori[0] === 1 && ori[1] === 1 && !isBlack)))
        this.longCastle[isBlack? 1 : 0] = false
      return true;
    }
    if (ori[1] === next[1]) {
      if (ori[0] > next[0]) bonus = -1;
      for (let i = ori[0] + bonus; i !== next[0]; i += bonus) {
        if (this.getFenValue(i, ori[1]) !== "-") return false;
      }
      if (this.getFenValue(ori[0], ori[1]) !== (isBlack? 'q' : 'Q') && ((ori[0] === 8 && ori[1] === 8 && isBlack) || (ori[0] === 8 && ori[1] === 1 && !isBlack)))
        this.shortCastle[isBlack? 1 : 0] = false
      if (this.getFenValue(ori[0], ori[1]) !== (isBlack? 'q' : 'Q') && ((ori[0] === 1 && ori[1] === 8 && isBlack) || (ori[0] === 1 && ori[1] === 1 && !isBlack)))
        this.longCastle[isBlack? 1 : 0] = false
      return true;
    }
    return false;
  }

  Joker(ori, next) {
    if (Math.abs(ori[0] - next[0]) !== Math.abs(ori[1] - next[1])) return false;
    var bonusx = 1;
    var bonusy = 1;
    if (next[0] < ori[0]) bonusx = -1;
    if (next[1] < ori[1]) bonusy = -1;
    for (let i = 1; i !== Math.abs(ori[0] - next[0]); i += 1) {
      if (this.getFenValue(ori[0] + i * bonusx, ori[1] + i * bonusy) !== "-")
        return false;
    }
    return true;
  }

  Pawn(ori, next, isBlack) {
    const direction = isBlack ? 1 : -1;
    if (ori[0] === next[0]) {
      if (
        ori[1] === next[1] + direction &&
        this.getFenValue(next[0], next[1]) === "-"
      )
        return true;
      if (
        ori[1] === next[1] + direction * 2 &&
        (ori[1] === 2 || ori[1] === 7) &&
        this.getFenValue(next[0], next[1]) === "-"
      )
        return true;
    }
    if (ori[0] === next[0] + 1 || ori[0] === next[0] - 1) {
      if (ori[1] === next[1] + direction) {
        if (this.getFenValue(next[0], next[1]) !== "-") return true;
      }
    }
    return false;
  }

  PromotePawn(isBlack, square) {
    if (square[1] === 8 && isBlack === false) {
      return true;
    }
    if (square[1] === 1 && isBlack === true) {
      return true;
    }
    return false;
  }

  Knight(ori, next) {
    if (ori[0] === next[0] && ori[1] === next[1]) {
      return false;
    }
    const diffX = Math.abs(ori[0] - next[0]);
    const diffY = Math.abs(ori[1] - next[1]);
    if (diffX + diffY === 3) {
      return true;
    }
    return false;
  }

  King(isBlack, ori, next) {
    const diffX = Math.abs(ori[0] - next[0]);
    const diffY = Math.abs(ori[1] - next[1]);

    if (diffX > 1 || diffY > 1) {
      if (next[0] === 7 && next[1] === 1 && ori[0] === 5 && ori[1] === 1 && !isBlack && this.shortCastle[0] && this.allcheck(isBlack, next)[0] === false && this.allcheck(isBlack, ori)[0] === false && this.allcheck(isBlack, [6, 1])[0] === false && this.getFenValue(8, 1) === 'R' && this.getFenValue(6, 1) === '-') {
        this.shortCastle[0] = false
        this.longCastle[0] = false
        this.castled[0] = 1;
        return true
      }
      if (next[0] === 3 && next[1] === 1 && ori[0] === 5 && ori[1] === 1 && !isBlack && this.longCastle[0] && this.allcheck(isBlack, next)[0] === false && this.allcheck(isBlack, ori)[0] === false && this.allcheck(isBlack, [4, 1])[0] === false && this.getFenValue(1, 1) === 'R' && this.getFenValue(2, 1) === '-' && this.getFenValue(4, 1) === '-'){
        this.shortCastle[0] = false
        this.longCastle[0] = false
        this.castled[0] = 2;
        return true
      }
      if (next[0] === 3 && next[1] === 8 && ori[0] === 5 && ori[1] === 8 && isBlack && this.longCastle[1] && this.allcheck(isBlack, next)[0] === false && this.allcheck(isBlack, ori)[0] === false && this.allcheck(isBlack, [4, 8])[0] === false && this.getFenValue(1, 8) === 'r' && this.getFenValue(2, 8) === '-' && this.getFenValue(4, 8) === '-') {
        this.shortCastle[1] = false
        this.longCastle[1] = false
        this.castled[1] = 2;
        return true
      }
      if (next[0] === 7 && next[1] === 8 && ori[0] === 5 && ori[1] === 8 && isBlack && this.shortCastle[1] && this.allcheck(isBlack, next)[0] === false && this.allcheck(isBlack, ori)[0] === false && this.allcheck(isBlack, [6, 8])[0] === false && this.getFenValue(8, 8) === 'r' && this.getFenValue(6, 8) === '-') {
        this.shortCastle[1] = false
        this.longCastle[1] = false
        this.castled[1] = 1;
        return true
      }
      return false;
    }
    this.shortCastle[isBlack? 1 : 0] = false
    this.longCastle[isBlack? 1 : 0] = false
    return true;
  }

  Queen(isBlack, ori, next) {
    return this.Joker(ori, next) || this.Tower(isBlack, ori, next);
  }

  RookCheck(isBlack, KingSquare) {
    const ennemy = isBlack ? "R" : "r";
    const king = isBlack ? "k" : "K";
    for (let i = KingSquare[0] + 1; i <= 8; i++) {
      if (this.getFenValue(i, KingSquare[1]) === ennemy)
        return [i, KingSquare[1]];
      else if (
        this.getFenValue(i, KingSquare[1]) !== "-" &&
        this.getFenValue(i, KingSquare[1]) !== king
      )
        break;
    }
    for (let i = KingSquare[0] - 1; i > 0; i--) {
      if (this.getFenValue(i, KingSquare[1]) === ennemy)
        return [i, KingSquare[1]];
      else if (
        this.getFenValue(i, KingSquare[1]) !== "-" &&
        this.getFenValue(i, KingSquare[1]) !== king
      )
        break;
    }
    for (let i = KingSquare[1] + 1; i <= 8; i++) {
      if (this.getFenValue(KingSquare[0], i) === ennemy)
        return [KingSquare[0], i];
      else if (
        this.getFenValue(KingSquare[0], i) !== "-" &&
        this.getFenValue(KingSquare[0], i) !== king
      )
        break;
    }
    for (let i = KingSquare[1] - 1; i > 0; i--) {
      if (this.getFenValue(KingSquare[0], i) === ennemy)
        return [KingSquare[0], i];
      else if (
        this.getFenValue(KingSquare[0], i) !== "-" &&
        this.getFenValue(KingSquare[0], i) !== king
      )
        break;
    }
    return false;
  }

  BishopCheck(isBlack, KingSquare) {
    const ennemy = isBlack ? "B" : "b";
    const king = isBlack ? "k" : "K";
    for (let i = 1; KingSquare[0] + i <= 8 && KingSquare[1] + i <= 8; i++) {
      if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) === ennemy)
        return [KingSquare[0] + i, KingSquare[1] + i];
      else if (
        this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== "-" &&
        this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== king
      )
        break;
    }
    for (let i = -1; KingSquare[0] + i > 0 && KingSquare[1] + i > 0; i--) {
      if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) === ennemy)
        return [KingSquare[0] + i, KingSquare[1] + i];
      else if (
        this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== "-" &&
        this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== king
      )
        break;
    }
    for (let i = 1; KingSquare[0] + i <= 8 && KingSquare[1] - i > 0; i++) {
      if (this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) === ennemy)
        return [KingSquare[0] + i, KingSquare[1] - i];
      else if (
        this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) !== "-" &&
        this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) !== king
      )
        break;
    }
    for (let i = 1; KingSquare[0] - i > 0 && KingSquare[1] + i <= 8; i++) {
      if (this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) === ennemy)
        return [KingSquare[0] - i, KingSquare[1] + i];
      else if (
        this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) !== "-" &&
        this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) !== king
      )
        break;
    }
    return false;
  }

  PawnCheck(isBlack, KingSquare) {
    const direction = isBlack ? 1 : -1;
    const ennemy = isBlack ? "P" : "p";
    if (
      this.getFenValue(KingSquare[0] + 1, KingSquare[1] - direction) === ennemy
    ) {
      return [KingSquare[0] + 1, KingSquare[1] - direction];
    }
    if (
      this.getFenValue(KingSquare[0] - 1, KingSquare[1] - direction) === ennemy
    ) {
      return [KingSquare[0] - 1, KingSquare[1] - direction];
    }
    return false;
  }

  KnightCheck(isBlack, KingSquare) {
    const ennemy = isBlack ? "N" : "n";
    if (this.getFenValue(KingSquare[0] + 2, KingSquare[1] + 1) === ennemy)
      return [KingSquare[0] + 2, KingSquare[1] + 1];
    if (this.getFenValue(KingSquare[0] + 2, KingSquare[1] - 1) === ennemy)
      return [KingSquare[0] + 2, KingSquare[1] - 1];
    if (this.getFenValue(KingSquare[0] + 1, KingSquare[1] + 2) === ennemy)
      return [KingSquare[0] + 1, KingSquare[1] + 2];
    if (this.getFenValue(KingSquare[0] + 1, KingSquare[1] - 2) === ennemy)
      return [KingSquare[0] + 1, KingSquare[1] - 2];
    if (this.getFenValue(KingSquare[0] - 2, KingSquare[1] + 1) === ennemy)
      return [KingSquare[0] - 2, KingSquare[1] + 1];
    if (this.getFenValue(KingSquare[0] - 2, KingSquare[1] - 1) === ennemy)
      return [KingSquare[0] - 2, KingSquare[1] - 1];
    if (this.getFenValue(KingSquare[0] - 1, KingSquare[1] + 2) === ennemy)
      return [KingSquare[0] - 1, KingSquare[1] + 2];
    if (this.getFenValue(KingSquare[0] - 1, KingSquare[1] - 2) === ennemy)
      return [KingSquare[0] - 1, KingSquare[1] - 2];
    return false;
  }

  QueenCheck(isBlack, KingSquare) {
    const ennemy = isBlack ? "Q" : "q";
    const king = isBlack ? "k" : "K";
    for (let i = 1; KingSquare[0] + i <= 8 && KingSquare[1] + i <= 8; i++) {
      if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) === ennemy)
        return [KingSquare[0] + i, KingSquare[1] + i];
      else if (
        this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== "-" &&
        this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== king
      )
        break;
    }
    for (let i = -1; KingSquare[0] + i > 0 && KingSquare[1] + i > 0; i--) {
      if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) === ennemy)
        return [KingSquare[0] + i, KingSquare[1] + i];
      else if (
        this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== "-" &&
        this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== king
      )
        break;
    }
    for (let i = 1; KingSquare[0] + i <= 8 && KingSquare[1] - i > 0; i++) {
      if (this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) === ennemy)
        return [KingSquare[0] + i, KingSquare[1] - i];
      else if (
        this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) !== "-" &&
        this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) !== king
      )
        break;
    }
    for (let i = 1; KingSquare[0] - i > 0 && KingSquare[1] + i <= 8; i++) {
      if (this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) === ennemy)
        return [KingSquare[0] - i, KingSquare[1] + i];
      else if (
        this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) !== "-" &&
        this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) !== king
      )
        break;
    }
    for (let i = KingSquare[0] + 1; i <= 8; i++) {
      if (this.getFenValue(i, KingSquare[1]) === ennemy)
        return [i, KingSquare[1]];
      else if (
        this.getFenValue(i, KingSquare[1]) !== "-" &&
        this.getFenValue(i, KingSquare[1]) !== king
      )
        break;
    }
    for (let i = KingSquare[0] - 1; i > 0; i--) {
      if (this.getFenValue(i, KingSquare[1]) === ennemy)
        return [i, KingSquare[1]];
      else if (
        this.getFenValue(i, KingSquare[1]) !== "-" &&
        this.getFenValue(i, KingSquare[1]) !== king
      )
        break;
    }
    for (let i = KingSquare[1] + 1; i <= 8; i++) {
      if (this.getFenValue(KingSquare[0], i) === ennemy)
        return [KingSquare[0], i];
      else if (
        this.getFenValue(KingSquare[0], i) !== "-" &&
        this.getFenValue(KingSquare[0], i) !== king
      )
        break;
    }
    for (let i = KingSquare[1] - 1; i > 0; i--) {
      if (this.getFenValue(KingSquare[0], i) === ennemy)
        return [KingSquare[0], i];
      else if (
        this.getFenValue(KingSquare[0], i) !== "-" &&
        this.getFenValue(KingSquare[0], i) !== king
      )
        break;
    }
    return false;
  }

  findKing(isBlack) {
    const king = isBlack ? "k" : "K";
    for (let x = 1; x <= 8; x++) {
      for (let y = 1; y <= 8; y++) {
        if (this.getFenValue(x, y) === king) {
          var KingSquare = [x, y];
          break;
        }
      }
    }
    return KingSquare;
  }

  CaptureCheck(isBlack, CheckingPieces) {
    if (CheckingPieces[1] !== false) return false;
    else if (this.allcheck(isBlack === false, CheckingPieces[0])[0] !== false)
      return true;
    return false;
  }

  CanSacrificeToKing(opponents, IsWhite) {
    var canMove = false;
    if (opponents.length === 0) return true;
    if (opponents.at(-1) !== false) opponents.push(false);
    if (opponents.length === 1) return true;
    if (opponents.length !== 2) return false;
    const matrix = this.createMatrix();
    const oppotype = this.getFenValue(opponents[0][0], opponents[0][1]);
    const kingpos = this.GetKingPosition(matrix, IsWhite);
    this.GetMiddleCases(opponents[0], kingpos, oppotype).forEach((i) => {
      if (this.CanMoveToSpecified(i, IsWhite)) {
        canMove = true;
      }
    });
    return canMove;
  }

  GetKingPosition(matrix, IsWhite) {
    const bonusforkingsearch = IsWhite ? "K" : "k";
    for (let x = 1; x < 9; x++) {
      for (let y = 1; y < 9; y++) {
        if (this.getFenValue(x, y) === bonusforkingsearch) {
          return [x, y];
        }
      }
    }
    return [0, 0];
  }

  GetMiddleCases(ori, next, type) {
    if ("nNpPkK".includes(type)) return [];
    var res = [];
    const difX = next[0] - ori[0] > 0 ? 1 : next[0] - ori[0] < 0 ? -1 : 0;
    const difY = next[1] - ori[1] > 0 ? 1 : next[1] - ori[1] < 0 ? -1 : 0;
    if ("bBrRqQ".includes(type)) {
      for (
        let into = 0;
        into < Math.max(Math.abs(next[0] - ori[0]), Math.abs(next[1] - ori[1]));
        into++
      ) {
        res.push([ori[0] + into * difX, ori[1] + into * difY]);
      }
    }
    return res;
  }

  CanMoveToSpecified(chesscase, IsWhite) {
    const bonusforsacrifice = IsWhite ? "RNBQP" : "rnbqp";
    var IsDoable = false;
    for (let x = 1; x < 9; x++) {
      for (let y = 1; y < 9; y++) {
        const piece = this.getFenValue(x, y);
        switch (piece) {
          case bonusforsacrifice[0]: {
            IsDoable = this.Tower(!IsWhite, [x, y], chesscase);
            break;
          }
          case bonusforsacrifice[1]: {
            IsDoable = this.Knight([x, y], chesscase);
            break;
          }
          case bonusforsacrifice[2]: {
            IsDoable = this.Joker([x, y], chesscase);
            break;
          }
          case bonusforsacrifice[3]: {
            IsDoable = this.Queen(!IsWhite, [x, y], chesscase);
            break;
          }
          case bonusforsacrifice[4]: {
            IsDoable = this.Pawn([x, y], chesscase, !IsWhite);
            break;
          }
          default:
            IsDoable = false;
        }

        if (IsDoable) {
          return true;
        }
      }
    }
    return false;
  }

  moveKing(isBlack, kingSquare) {
    var captured;
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        captured = this.getFenValue(kingSquare[0] + x, kingSquare[1] + y);
        if (captured) {
          if (
            this.allcheck(isBlack, [
              kingSquare[0] + x,
              kingSquare[1] + y,
            ])[0] === false &&
            (captured.charCodeAt(0) <= 90 === isBlack || captured === "-")
          )
            return true;
        }
      }
    }
    return false;
  }

  allcheck(isBlack, KingSquare) {
    if (KingSquare === false) KingSquare = this.findKing(isBlack);
    let i = 0;
    var pieces = [false];
    pieces[i] = this.RookCheck(isBlack, KingSquare);
    if (pieces[i] !== false) i++;
    pieces[i] = this.PawnCheck(isBlack, KingSquare);
    if (pieces[i] !== false) i++;
    pieces[i] = this.KnightCheck(isBlack, KingSquare);
    if (pieces[i] !== false) i++;
    pieces[i] = this.QueenCheck(isBlack, KingSquare);
    if (pieces[i] !== false) i++;
    pieces[i] = this.BishopCheck(isBlack, KingSquare);
    return pieces;
  }

  checkmate(isBlack, CheckingPieces) {
    if (
      this.CaptureCheck(isBlack, CheckingPieces) ||
      this.CanSacrificeToKing(CheckingPieces, !isBlack) ||
      this.moveKing(isBlack, this.findKing(isBlack))
    )
      return false;
    return true;
  }
}

module.exports = ChessGame;
