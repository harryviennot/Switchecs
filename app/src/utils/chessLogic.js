export class ChessGame {
  constructor() {
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    this.turn = "white";
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
    return this.Pawn(false, newfrom, newto)
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
          for (let index = parseInt(fenmat[i][lej]); index > 1; index--) {
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
    console.log("x = " + x + "\ny = " + (9 - y) + "\nvalue = " + matrix[y - 1][x - 1])
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

  Pawn(isBlack, ori, next) {
    const direction = isBlack? 1 : -1;
    if (ori[0] === next[0]) {
        if (ori[1] === next[1] + direction && this.getFenValue(next[0], next[1]) === '-')
            return true;
        if (ori[1] === next[1] + direction * 2 && (ori[1] === 2 || ori[1] === 7) && this.getFenValue(next[0], next[1]) === '-')
            return true;
    }
    if (ori[0] === next[0] + 1 || ori[0] === next[0] - 1) {
        if (ori[1] === next[1] + direction) {
            if (this.getFenValue(next[0], next[1]) != '-')
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
}
