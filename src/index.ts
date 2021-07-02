import { IPosition, TFile, TRank, TRankFile } from './types';
import { Board } from './board';

const board = new Board();

updateBoard()

function updateBoard() {
  document.querySelectorAll('.square').forEach(square => {
    square.remove()
  })
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
			domSquare.addEventListener('click', handleFirstClick);

		} else {
			domSquare.addEventListener('click', handleSecondClick);
		}
		domBoard?.appendChild(domSquare);
	});
}

let firstSelected: TRankFile | null = null;
let secondSelected: TRankFile | null = null;

function handleFirstClick(event: MouseEvent) {
	if (!firstSelected) {
		let square = event.target as HTMLElement;
		square.classList.add('selected');
		firstSelected = square.getAttribute('data-pos') as TRankFile;
		let t = setTimeout(() => {
			square.classList.remove('selected');
			firstSelected = null;
			clearTimeout(t);
		}, 2000);
	}
}

function handleSecondClick(event: MouseEvent) {
	if (firstSelected && !secondSelected) {
		let square = event.currentTarget as HTMLElement;
		square.classList.add('selected');
		secondSelected = square.getAttribute('data-pos') as TRankFile;
		console.log(secondSelected);
		const [rank1, file1] = firstSelected.split('')
		const [rank2, file2] = secondSelected.split('');
		// calculate if positions are 2 units away, and if theres a piece in between
		

		
		movePiece(firstSelected as TRankFile, secondSelected as TRankFile);
		let t = setTimeout(() => {
			square.classList.remove('selected');
			secondSelected = null;
			clearTimeout(t);
		}, 2000);
	}
}

function handleThirdClick(event: MouseEvent) {}

function movePiece(pieceRF: TRankFile, squareRF: TRankFile) {
	let squarePos = toPosition(squareRF);

	const pieceSquare = board.squares[pieceRF];
	const { piece } = pieceSquare;
	piece?.move(squarePos, board, false);
  updateBoard();
}

function toPosition(rf: TRankFile): IPosition {
	let [rank, file] = rf;
	return { rank: rank as unknown as TRank, file: file as unknown as TFile };
}
