import { Board, Files, Ranks } from "./board";
import { EFile, ERank, IPosition, TBoard, TPiece, TRank, TRankFile } from "./types";

export class Piece {
    king: boolean;
    constructor(public position: IPosition, public color: TPiece) {
        this.position = position;
        this.color = color;
        this.king = false;
    }

    move(newPosition: IPosition, board: Board, attacking: boolean) {
        let oldPosition = this.position;
        if (this.canMoveTo(newPosition, board, attacking)) {
            this.position = newPosition;
        }
        if (attacking) {
            // delete piece
            let midRank: TRank =
                Ranks[Math.floor((ERank[newPosition.rank] + ERank[oldPosition.rank]) / 2)];
            let midFile =
                Files[Math.floor((EFile[newPosition.file] + EFile[oldPosition.file]) / 2)];
            // make sure you dont remove one of your own pieces!
            if (this.position.rank !== midRank && this.position.file !== midFile) {
                let rows = board.getRows();
                console.log(midRank, midFile);

                let piece = rows[midRank][midFile].piece;
                if (piece && piece.color !== this.color) {
                    board.removePiece({ rank: midRank, file: midFile }, this.color);
                    board.updateBoard(oldPosition, this);
                    this.setKing();
                }
            }
        } else {
            board.updateBoard(oldPosition, this);

            this.setKing();
        }
    }

    public canMoveTo(newPosition: IPosition, board: Board, attacking: boolean) {
        let { file, rank } = this.position;
        if (attacking) {
            if (
                newPosition.file !== file &&
                Math.abs(EFile[newPosition.file] - EFile[file]) === 2
            ) {
                if (
                    newPosition.rank !== rank &&
                    Math.abs(ERank[newPosition.rank] - ERank[rank]) === 2
                ) {
                    let midRank = Ranks[Math.floor((ERank[newPosition.rank] + ERank[rank]) / 2)];
                    let midFile = Files[Math.floor((EFile[newPosition.file] + EFile[file]) / 2)];
                    if (
                        board.getRows()[midRank][midFile].piece &&
                        board.getRows()[midRank][midFile].piece?.color !== this.color
                    ) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            if (
                newPosition.file !== file &&
                Math.abs(EFile[newPosition.file] - EFile[file]) === 1
            ) {
                if (
                    newPosition.rank !== rank &&
                    Math.abs(ERank[newPosition.rank] - ERank[rank]) === 1
                ) {
                    if (!this.king) {
                        if (this.color === "red") {
                            // rank and file are rotated 90 degrees due to board datastructure...
                            if (this.position.file > newPosition.file) return false;
                        } else {
                            if (this.position.file < newPosition.file) return false;
                        }
                    }
                    if (!board.getRows()[newPosition.rank][newPosition.file].piece) {
                        return true;
                    }
                }
            }

            return false;
        }
    }

    setKing() {
        if (
            (this.color === "red" && this.position.file === "h") ||
            (this.color === "black" && this.position.file === "a")
        )
            this.king = true;
    }
}
