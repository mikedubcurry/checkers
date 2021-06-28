import { Board } from './board';
import { EFile, Files, IPosition, TBoard, TPiece, TRankFile } from './types';

export class Piece {
	constructor(public position: IPosition, public color: TPiece) {
		this.position = position;
		this.color = color;
	}

	move(newPosition: IPosition, board: Board, attacking: boolean) {
		let oldPosition = this.position;
		if (this.canMoveTo(newPosition, board, attacking)) this.position = newPosition;
		board.updateBoard(oldPosition, this);
	}

	private canMoveTo(newPosition: IPosition, board: Board, attacking: boolean) {
		let { file, rank } = this.position;
		if (attacking) {
			if (newPosition.file !== file && Math.abs(EFile[newPosition.file] - EFile[file]) === 2) {
				if (newPosition.rank !== rank && Math.abs(newPosition.rank - rank) === 2) {
					let rankDiff = (newPosition.rank + rank) / 2;
					let fileDiff = Files[(EFile[newPosition.file] + EFile[file]) / 2];
					let rankFile = `${rankDiff}${fileDiff}` as TRankFile;
					let isPlayer = board.squares[rankFile];
					if (isPlayer) return true;
				} 
				return false;
			}
		} else {
			if (newPosition.file !== file && Math.abs(EFile[newPosition.file] - EFile[file]) === 1) {
				if (newPosition.rank !== rank && Math.abs(newPosition.rank - rank) === 1) {
					let rankFile = `${newPosition.rank}${newPosition.file}` as TRankFile;
					if (!board.squares[rankFile].piece) return true;
				}
			}
			console.log('cant move there,', newPosition);

			return false;
		}
	}
}
