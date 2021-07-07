import { Piece } from './piece';
import { TRow, TColumn, TFile, TRank, IPosition } from './types';
export const Files: TFile[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const Ranks: TRank[] = [0, 1, 2, 3, 4, 5, 6, 7];
export class Board {
	private rows: TRow;

	constructor() {
		this.rows = Ranks.reduce((rows, rank) => {
			rows[rank] = this.initColumn(rank);
			return rows;
		}, {} as TRow);
	}

	private initColumn(rank: TRank) {
		return Files.reduce((col, file) => {
			if ((file === 'a' || file === 'c' || file === 'g') && rank % 2 === 0) {
				// create piece
				col[file] = { piece: new Piece({ rank, file }, file !== 'g' ? 'red' : 'black'), pos: { file, rank } };
			} else if ((file === 'b' || file === 'f' || file === 'h') && rank % 2 !== 0) {
				// create piece
				col[file] = { piece: new Piece({ rank, file }, file !== 'b' ? 'black' : 'red'), pos: { file, rank } };
			} else {
				col[file] = { piece: null, pos: { file, rank } };
			}
			return col;
		}, {} as TColumn);
	}

	public updateBoard(oldPosition: IPosition, piece: Piece) {
		// this.rows[oldPosition.rank][oldPosition.file].piece = null;
		// this.rows[piece.position.rank][piece.position.file] = { piece, pos: piece.position };
		let newPosition = piece.position;
		this.rows = {
			...this.rows,
			[oldPosition.rank]: {
				...this.rows[oldPosition.rank],
				[oldPosition.file]: { piece: null, position: oldPosition },
			},
		};
		this.rows = {
			...this.rows,
			[newPosition.rank]: {
				...this.rows[newPosition.rank],
				[newPosition.file]: { piece, position: newPosition },
			},
		};
		console.log(this.rows);
		
	}

	public getRows(): TRow {
		return this.rows;
	}
}

let b = new Board();

// b.squares['1d'].piece?.move({ rank: 2, file: 'e' }, b, false);
// b.squares['2e'].piece?.move({ rank: 3, file: 'f' }, b, false);
// console.log(b.squares);
