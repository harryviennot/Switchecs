export class ChessGame {
  constructor() {
    this.board = this.initialSetup();
    this.turn = "white";
    this.gameOver = false;
  }

  initialSetup() {
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  }

  move(from, to) {}

  getFen() {
    return this.fen;
  }
}
