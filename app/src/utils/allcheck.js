export class ChessGame {
  constructor() {
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    this.turn = "white"
    this.gameOver = false;
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

  PawnCheck(isBlack, KingSquare) {
    const direction = isBlack? 1 : -1;
    const ennemy = isBlack? 'P' : 'p';
    if (this.getFenValue(KingSquare[0] + 1, KingSquare[1] - direction) === ennemy || this.getFenValue(KingSquare[0] - 1, KingSquare[1] - direction) === ennemy) {
      return true;
    }
    return false; 
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

EscapeCheckmate(ori, next) {
    const king = findKing(ori);
    const safeSquares = getSafeSquares(ori);
  
    for (let i = 0; i < safeSquares; i++) {
      const safeSquare = safeSquares[i];
      const move = { from: king.ori, to: safeSquare };
  
      const newPosition = makeMove(king, move, next);
      if (!Check(newPosition)) {
        return true;
      }
    }
    return false;
  }
  
allcheck() {
    RookCheck(isBlack, KingSquare);
    PawnCheck(isBlack, KingSquare);
    KnightCheck(isBlack, KingSquare);
    QueenCheck(isBlack, KingSquare);
    BishopCheck(isBlack, KingSquare);
  }
  
checkmate(ori, next) {
      if (allCheck(ori)) {
        return true;
      }
      if (EscapeCheckmate(ori, next)) {
        return false;
      } else {
        const playerPieces = ori.filter(piece => piece.color === ori.turn);
        for (let i = 0; i < playerPieces.length; i++) {
          const possibleMoves = getValidMoves(playerPieces[i], next);
          for (let j = 0; j < possibleMoves.length; j++) {
            const newPosition = makeMove(playerPieces[i], possibleMoves[j], next);
            if (!isCheck(newPosition)) {
              return false;
            }
          }
        }
        return true;
      }
    return false;
    }
  }
