import { Piece } from './piece';
import { TRank, TFile, TSquare, TBoard, TRankFile, IPosition, toRankFile } from './types';

export class Board {
	squares: TBoard;
	constructor() {
		this.squares = this.initializeBoard();
	}

	initializeBoard(): TBoard {
		let board = {} as TBoard;
		let files = 'abcdefgh';
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				let rankFile = `${i}${files[j]}` as TRankFile;
				if (i <= 1 || i >= 6) {
					let p = new Piece({ rank: i as TRank, file: files[j] as TFile }, i <= 1 ? 'red' : 'black');
					board[rankFile] = this.setSquare({ rank: i as TRank, file: files[j] as TFile }, p);
				} else {
					board[rankFile] = this.setSquare({ rank: i as TRank, file: files[j] as TFile });
				}
			}
		}
		return board;
	}

	setSquare(pos: IPosition, p?: Piece): TSquare {
		return { piece: p ? p : null, pos };
	}

	updateBoard(oldPosition: IPosition, piece: Piece) {
		const oldRankFile = `${oldPosition.rank}${oldPosition.file}` as TRankFile;
		const newRankFile = `${piece.position.rank}${piece.position.file}` as TRankFile;

		this.squares[oldRankFile] = this.setSquare(oldPosition);
		this.squares[newRankFile] = this.setSquare(piece.position, piece);
	}

	getSquares(): TSquare[] {
		const rankFiles = Object.keys(this.squares) as TRankFile[];

		return rankFiles.map((rf) => {
			return this.squares[rf];
		});
	}

	isPieceAtPosition(pos: IPosition): boolean {
		const rankFile = toRankFile(pos);
		return this.squares[rankFile].piece instanceof Piece 
	}
}

let b = new Board();

b.squares['1d'].piece?.move({ rank: 2, file: 'e' }, b, false);
b.squares['2e'].piece?.move({ rank: 3, file: 'f' }, b, false);
console.log(b.squares);
