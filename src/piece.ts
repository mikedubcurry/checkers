import { Board, Files } from './board';
import { EFile, IPosition, TBoard, TPiece, TRankFile } from './types';

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
			console.log('moving');

			this.position = newPosition;
		}
		if (attacking) {
			// delete piece

			if (this.color === 'red') {
				let midRank = oldPosition.rank + 1;
				let midFile = Files[EFile[newPosition.file] - EFile[oldPosition.file]];
				// @ts-ignore
				let piece = board.squares[`${midRank}${midFile}`];
				//@ts-ignore
				board.removePiece({ rank: midRank, file: midFile });
				console.log('piece removed?');
			}
		}
		console.log(board);
		board.updateBoard(oldPosition, this);
		console.log(board);
	}

	public canMoveTo(newPosition: IPosition, board: Board, attacking: boolean) {
		let { file, rank } = this.position;
		if (attacking) {
			if (newPosition.file !== file && Math.abs(EFile[newPosition.file] - EFile[file]) === 2) {
				if (newPosition.rank !== rank && Math.abs(newPosition.rank - rank) === 2) {
					let rankDiff = (newPosition.rank + rank) / 2;
					let fileDiff = Files[(EFile[newPosition.file] + EFile[file]) / 2];
					let rankFile = `${rankDiff}${fileDiff}` as TRankFile;
					console.log('can move to');
					return true;
				}
				return false;
			}
		} else {
			if (newPosition.file !== file && Math.abs(EFile[newPosition.file] - EFile[file]) === 1) {
				if (newPosition.rank !== rank && Math.abs(newPosition.rank - rank) === 1) {
					if (!this.king) {
						if (this.color === 'red') {
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

	kingMe() {
		this.king = true;
	}
}
