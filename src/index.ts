import { IPosition, TFile, TRank, TRankFile } from './types';
import { Board } from './board';

const board = new Board();

updateBoard();

function updateBoard() {
	document.querySelectorAll('.square').forEach((square) => {
		square.remove();
	});
	const domBoard = document.getElementById('board');
	const squares = board.getSquares();

	squares.forEach((square, i) => {
		let domSquare = document.createElement('div');
		domSquare.classList.add('square');
		if (square.piece) {
			domSquare.classList.add('piece', square.piece.color);
		}

		domSquare.setAttribute('data-pos', `${square.pos.rank}${square.pos.file}`);
		if (domSquare.classList.contains('piece')) {
			// domSquare.addEventListener('click', handleAttackClick);
			domSquare.addEventListener('click', handleFirstClick);
		} else {
			domSquare.addEventListener('click', handleSecondClick);
		}
		domBoard?.appendChild(domSquare);
	});
}

let firstSelected: TRankFile | null = null;
let secondSelected: TRankFile | null = null;
let attacking = false;
let moveMap = {};

function handleFirstClick(event: MouseEvent) {
	let square = event.target as HTMLElement;
	if (!firstSelected) {
		square.classList.add('selected');
		firstSelected = square.getAttribute('data-pos') as TRankFile;
		// let t = setTimeout(() => {
		// 	square.classList.remove('selected');
		// 	firstSelected = null;
		// 	clearTimeout(t);
		// }, 2000);
	} else if (attacking) {
		clearSelected();
	} else {
		square.classList.add('attacking');
		attacking = true;
		// clearSelected()
		// firstSelected = null;
	}
}

function handleSecondClick(event: MouseEvent) {
	if (firstSelected && !secondSelected) {
		let square = event.currentTarget as HTMLElement;
		square.classList.add('selected');
		secondSelected = square.getAttribute('data-pos') as TRankFile;

		const [rank1, file1] = firstSelected.split('');
		const [rank2, file2] = secondSelected.split('');
		// calculate if positions are 2 units away, and if theres a piece in between

		movePiece(firstSelected as TRankFile, secondSelected as TRankFile);
		clearSelected();
		// secondSelected = null;
	}
}

function handleAttackClick(event: MouseEvent) {
	const element = event.target as HTMLElement;
	const rf = element.getAttribute('data-pos');

	if (!firstSelected || firstSelected !== rf) {
		return;
	} else {
		element.classList.add('attacking');
		attacking = true;

		let t = setTimeout(() => {
			element.classList.remove('attacking');
			attacking = false;
			clearTimeout(t);
		}, 2000);
	}
}

function movePiece(pieceRF: TRankFile, squareRF: TRankFile) {
	let squarePos = toPosition(squareRF);

	const pieceSquare = board.squares[pieceRF];
	const { piece } = pieceSquare;
	piece?.move(squarePos, board, attacking);
	updateBoard();
}

function toPosition(rf: TRankFile): IPosition {
	let [rank, file] = rf;
	return { rank: rank as unknown as TRank, file: file as unknown as TFile };
}

function clearSelected() {
	let squares = document.querySelectorAll('.square');
	squares.forEach((square) => {
		square.classList.remove('selected');
		square.classList.remove('attacking')
	});
	firstSelected = null;
	secondSelected = null;
	attacking = false;
}
