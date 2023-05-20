export class ChessGame {
  constructor() {
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    this.turn = "white"
    this.gameOver = false;
  }

  findPiece(position) {}

  move(from, to) {
    var x = parseInt(from[0])
    const y = parseInt(from[1])
    if (isNaN(x))
      x = this.getLetterValue(from[0])
    var x2 = parseInt(to[0])
    const y2 = parseInt(to[1])
    if (isNaN(x2))
      x2 = this.getLetterValue(to[0])
    const newfrom = [x, y]
    const newto = [x2, y2]
    var verify = this.Verification(newfrom, newto)
    if (verify) {
      var Matrix = this.createMatrix()
      Matrix[8 - newto[1]][newto[0] - 1] = Matrix[8 - newfrom[1]][newfrom[0] - 1]
      Matrix[8 - newfrom[1]][newfrom[0] - 1] = "-"
      this.fen = this.MatToFen(Matrix)
      this.ChangeTurn()
      console.log("turn : " + this.turn.toString())
    }
    return verify
  }

  ChangeTurn() {
    if (this.turn === "white")
      this.turn = "black"
    else
      this.turn = "white"
  }

  Verification(ori, next) {
    const piece = this.getFenValue(ori[0], ori[1])
    switch (piece) {
      case "r":
        return this.Tower(ori, next)
      case "R":
        return this.Tower(ori, next)
      case "n":
        return this.Knight(ori, next)
      case "N":
        return this.Knight(ori, next)
      case "b":
        return this.Joker(ori, next)
      case "B":
        return this.Joker(ori, next)
      case "q":
        return this.Queen(ori, next)
      case "Q":
        return this.Queen(ori, next)
      case "k":
        return this.King(ori, next)
      case "K":
        return this.King(ori, next)
      case "p":
        return this.Pawn(ori, next, true)
      case "P":
        return this.Pawn(ori, next, false)
      default:
        return false
    }
  }

  MatToFen(matrix) {
    var newfen = ""
    var bonu = 0
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] !== "-") {
          if (bonu !== 0) {
            newfen += bonu.toString()
            bonu = 0
          }
          newfen += matrix[i][j]
        } else {
          bonu += 1
        }
      }
      if (bonu !== 0) {
        newfen += bonu.toString()
        bonu = 0
      }
      newfen += "/"
    }
    newfen = newfen.slice(0, -1)
    return newfen
  }

  getFen() {
    return this.fen;
  }

  getLetterValue(x) {
    const str = "pabcdefgh"
    for (let index = 0; index < 9; index++) {
      if (x === str[index])
        return index
    }
    return 0
  }

  createMatrix() {
    var fenmat = this.fen.split("/")
    var matrix = new Array(8)
    for (var ind = 0; ind < matrix.length; ind++) {
      matrix[ind] = new Array(8);
    }
    var lej
    for (var i = 0; i < 8; i ++) {
      lej = 0
      for (var j = 0; j < 8; j ++) {
        if ("012345678".includes(fenmat[i][lej])) {
          for (let index = parseInt(fenmat[i][lej]); index > 0; index--) {
            matrix[i][j + index - 1] = "-"
          }
          j += parseInt(fenmat[i][lej]) - 1
        } else {
          matrix[i][j] = fenmat[i][lej]
        }
        lej++
      }
    }
    return matrix
  }

  getFenValue(x, y) {
    y = 9 - y;
    if (x > 8 || x <= 0)
      return false
    if (y > 8 || y <= 0)
      return false
    var matrix = this.createMatrix()
    return matrix[y - 1][x - 1]
  }
  
  Tower(ori, next) {
    var bonus = 1
    if (ori[0] === next[0]) {
      if (ori[1] > next[1])
      bonus = -1
      for (let i = ori[1] + bonus; i !== next[1] ; i += bonus) {
        if (this.getFenValue(ori[0], i) !== "-")
          return false
      }
      return true
    }
    if (ori[1] === next[1]) {
      if (ori[0] > next[0])
        bonus = -1
      for (let i = ori[0] + bonus; i !== next[0] ; i += bonus) {
        if (this.getFenValue(i, ori[1]) !== "-")
          return false
      }
      return true
    }
    return false
  }

  RookCheck(isBlack, KingSquare) {
    const ennemy = isBlack? 'R' : 'r';
    const king = isBlack? 'k' : 'K';
    for (let i = KingSquare[0] + 1; i <= 8; i++) {
        if (this.getFenValue(i, KingSquare[1]) === ennemy)
            return true;
        else if (this.getFenValue(i, KingSquare[1]) !== '-' && this.getFenValue(i, KingSquare[1]) !== king)
            break;
    }
    for (let i = KingSquare[0] - 1; i > 0; i--) {
        if (this.getFenValue(i, KingSquare[1]) === ennemy)
        return true;
        else if (this.getFenValue(i, KingSquare[1]) !== '-' && this.getFenValue(i, KingSquare[1]) !== king)
        break;
    }
    for (let i = KingSquare[1] + 1; i <= 8; i++) {
        if (this.getFenValue(KingSquare[0], i) === ennemy)
        return true;
        else if (this.getFenValue(KingSquare[0], i) !== '-' && this.getFenValue(KingSquare[0], i) !== king)
        break;
    }
    for (let i = KingSquare[1] - 1; i > 0; i--) {
        if (this.getFenValue(KingSquare[0], i) === ennemy)
        return true;
        else if (this.getFenValue(KingSquare[0], i) !== '-' && this.getFenValue(KingSquare[0], i) !== king)
        break;
    }
    return false
  }

  Joker(ori, next) {
    if (Math.abs(ori[0] - next[0]) !== Math.abs(ori[1] - next[1]))
      return false
    var bonusx = 1
    var bonusy = 1
    if (next[0] < ori[0])
      bonusx = -1
    if (next[1] < ori[1])
        bonusy = -1
    for (let i = 1; i !== Math.abs(ori[0] - next[0]) ; i += 1) {
      if (this.getFenValue(ori[0] + i * bonusx, ori[1] + i * bonusy) !== "-")
        return false
    }
    return true
  }

  BishopCheck(isBlack, KingSquare) {
    const ennemy = isBlack? 'B' : 'b';
    const king = isBlack? 'k' : 'K';
    for (let i = 1; KingSquare[0] + i <= 8 && KingSquare[1] + i <= 8; i++) {
        if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) === ennemy)
            return true;
        else if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== '-' && this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !==  king)
            break;
    }
    for (let i = -1; KingSquare[0] + i > 0 && KingSquare[1] + i > 0; i--) {
        if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) === ennemy)
            return true;
        else if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== '-' && this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== king)
            break;
    }
    for (let i = 1; KingSquare[0] + i <= 8 && KingSquare[1] - i > 0; i++) {
        if (this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) === ennemy)
            return true;
        else if (this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) !== '-' && this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) !== king)
            break;
    }
    for (let i = 1; KingSquare[0] - i > 0 && KingSquare[1] + i <= 8; i++) {
        if (this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) === ennemy)
            return true;
        else if (this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) !== '-' && this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) !== king)
            break;
    }
    return false
  }

  Pawn(ori, next, isBlack) {
    const direction = isBlack? 1 : -1;
    if (ori[0] === next[0]) {
        if (ori[1] === next[1] + direction && this.getFenValue(next[0], next[1]) === '-')
            return true;
        if (ori[1] === next[1] + direction * 2 && (ori[1] === 2 || ori[1] === 7) && this.getFenValue(next[0], next[1]) === '-')
            return true;
    }
    if (ori[0] === next[0] + 1 || ori[0] === next[0] - 1) {
        if (ori[1] === next[1] + direction) {
            if (this.getFenValue(next[0], next[1]) !== '-')
                return true;
        }
    }
    return false;
  }

  PawnCheck(isBlack, KingSquare) {
    const direction = isBlack? 1 : -1;
    const ennemy = isBlack? 'P' : 'p';
    if (this.getFenValue(KingSquare[0] + 1, KingSquare[1] - direction) === ennemy || this.getFenValue(KingSquare[0] - 1, KingSquare[1] - direction) === ennemy) {
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
      return true
    }
    return false
  }

  KnightCheck(isBlack, KingSquare) {
    const ennemy = isBlack? 'N' : 'n';
    if (this.getFenValue(KingSquare[0] + 2, KingSquare[1] + 1) === ennemy)
      return true
    if (this.getFenValue(KingSquare[0] + 2, KingSquare[1] - 1) === ennemy)
      return true
    if (this.getFenValue(KingSquare[0] + 1, KingSquare[1] + 2) === ennemy)
      return true
    if (this.getFenValue(KingSquare[0] + 1, KingSquare[1] - 2) === ennemy)
      return true
    if (this.getFenValue(KingSquare[0] - 2, KingSquare[1] + 1) === ennemy)
      return true
    if (this.getFenValue(KingSquare[0] - 2, KingSquare[1] - 1) === ennemy)
      return true
    if (this.getFenValue(KingSquare[0] - 1, KingSquare[1] + 2) === ennemy)
      return true
    if (this.getFenValue(KingSquare[0] - 1, KingSquare[1] - 2) === ennemy)
      return true
    return false
  }
  
  King(ori, next) {
    const diffX = Math.abs(ori[0] - next[0]);
    const diffY = Math.abs(ori[1] - next[1]);
  
    if (diffX > 1 || diffY > 1) {
      return false
    }
    return true
  }
  
  Queen(ori, next) {
    return (this.Joker(ori, next) || this.Tower(ori, next))
  }

  QueenCheck(isBlack, KingSquare) {
    const ennemy = isBlack? 'Q' : 'q';
    const king = isBlack? 'k' : 'K';
    for (let i = 1; KingSquare[0] + i <= 8 && KingSquare[1] + i <= 8; i++) {
        if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) === ennemy)
            return true;
        else if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== '-' && this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !==  king)
            break;
          }
          for (let i = -1; KingSquare[0] + i > 0 && KingSquare[1] + i > 0; i--) {
        if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) === ennemy)
            return true;
        else if (this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== '-' && this.getFenValue(KingSquare[0] + i, KingSquare[1] + i) !== king)
            break;
    }
    for (let i = 1; KingSquare[0] + i <= 8 && KingSquare[1] - i > 0; i++) {
        if (this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) === ennemy)
            return true;
        else if (this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) !== '-' && this.getFenValue(KingSquare[0] + i, KingSquare[1] - i) !== king)
            break;
    }
    for (let i = 1; KingSquare[0] - i > 0 && KingSquare[1] + i <= 8; i++) {
        if (this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) === ennemy)
            return true;
        else if (this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) !== '-' && this.getFenValue(KingSquare[0] - i, KingSquare[1] + i) !== king)
            break;
    }
    for (let i = KingSquare[0] + 1; i <= 8; i++) {
        if (this.getFenValue(i, KingSquare[1]) === ennemy)
            return true;
        else if (this.getFenValue(i, KingSquare[1]) !== '-' && this.getFenValue(i, KingSquare[1]) !== king)
            break;
    }
    for (let i = KingSquare[0] - 1; i > 0; i--) {
        if (this.getFenValue(i, KingSquare[1]) === ennemy)
        return true;
        else if (this.getFenValue(i, KingSquare[1]) !== '-' && this.getFenValue(i, KingSquare[1]) !== king)
        break;
    }
    for (let i = KingSquare[1] + 1; i <= 8; i++) {
        if (this.getFenValue(KingSquare[0], i) === ennemy)
        return true;
        else if (this.getFenValue(KingSquare[0], i) !== '-' && this.getFenValue(KingSquare[0], i) !== king)
        break;
    }
    for (let i = KingSquare[1] - 1; i > 0; i--) {
        if (this.getFenValue(KingSquare[0], i) === ennemy)
        return true;
        else if (this.getFenValue(KingSquare[0], i) !== '-' && this.getFenValue(KingSquare[0], i) !== king)
        break;
    }
    return false
}
}
