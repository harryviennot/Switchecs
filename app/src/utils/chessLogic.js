export class ChessGame {
  constructor() {
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    this.turn = "white";
    this.gameOver = false;
  }

  findPiece(position) {}

  move(from, to) {}

  getFen() {
    return this.fen;
  }
}
