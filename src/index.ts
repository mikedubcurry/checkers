import { IPosition, TFile, TRank, TRankFile } from "./types";
import { Board } from "./board";

const board = new Board();

updateBoard();

function getTypedKeys<T>(obj: T): Array<keyof T> {
    return Object.keys(obj) as Array<keyof typeof obj>;
}

function getPositionFromSquare(rankFile: string): IPosition {
    let rank = rankFile[0] as unknown as TRank;
    let file = rankFile[1] as unknown as TFile;
    return { rank, file };
}

function updateBoard() {
    document.querySelectorAll(".square").forEach((square) => {
        square.remove();
    });
    const domBoard = document.getElementById("board");
    let rows = board.getRows();
    let i = 0;
    for (let row of getTypedKeys(rows)) {
        const cols = getTypedKeys(rows[row]);
        for (let col of cols) {
            const square = document.createElement("div");
            square.classList.add("square");
            if (rows[row][col].piece) {
                let piece = rows[row][col].piece!;
                square.classList.add("piece", piece.color);
                square.addEventListener("click", handlePieceClick);
                if (rows[row][col].piece?.king) {
                    square.classList.add("king");
                }
            }
            square.setAttribute("data-pos", `${row}${col}`);
            square.classList.add(i++ % 2 === 0 ? "blue" : "gray");
            if (!rows[row][col].piece && square.classList.contains("blue")) {
                square.addEventListener("click", handleSquareClick);
            }
            domBoard?.appendChild(square);
        }
        i++;
    }
}

let pieceSelected: string | null = null;
let squaresSelected: string[] = [];
let attacking = false;

function handlePieceClick(event: MouseEvent) {
    const square = event.currentTarget as HTMLElement;
    const pos = square.getAttribute("data-pos");
    if (pos) {
        if (!pieceSelected || pieceSelected !== pos) {
            clearSelected0();
            pieceSelected = pos;
            attacking = false;
            clearAttacking();
            square.classList.add("selected0");
        } else if (!attacking) {
            square.classList.add("attacking");
            attacking = true;
        } else {
            pieceSelected = null;
            attacking = false;
            clearAttacking();
            clearSelected0();
        }
        clearSelected1();
        squaresSelected = [];
    }
}

function handleSquareClick(event: MouseEvent) {
    const square = event.currentTarget as HTMLElement;
    const pos = square.getAttribute("data-pos");
    if (pos && !squaresSelected.includes(pos)) {
        square.classList.add("selected1");
        squaresSelected.push(pos);
    } else if (pieceSelected && pos === squaresSelected[squaresSelected.length - 1]) {
        // execute moves
        const rankFile = pieceSelected;
        const piecePosition = getPositionFromSquare(rankFile);
        const { piece } = board.getRows()[piecePosition.rank][piecePosition.file];
        if (piece) {
            const newPosition = getPositionFromSquare(squaresSelected[0]);
            piece.move(newPosition, board, attacking);
            updateBoard();
        }
        console.log("trying to move", pieceSelected, " to ", squaresSelected.join(", then to "));
        clearSelected0();
        clearSelected1();
        clearAttacking();
        attacking = false;
        pieceSelected = null;
        squaresSelected = [];
    } else {
        squaresSelected.forEach((selectedPos, idx) => {
            if (selectedPos === pos) {
                squaresSelected = squaresSelected.slice(0, idx);
            }
            document.querySelector(`[data-pos="${selectedPos}"]`)?.classList.remove("selected1");
            squaresSelected.forEach((selectedPos) =>
                document.querySelector(`[data-pos="${selectedPos}"]`)!.classList.add("selected1")
            );
        });
    }
}

function clearSelected0() {
    document.querySelectorAll(".selected0")!.forEach((el) => el.classList.remove("selected0"));
}
function clearSelected1() {
    document.querySelectorAll(".selected1")!.forEach((el) => el.classList.remove("selected1"));
}
function clearAttacking() {
    document.querySelectorAll(".attacking")!.forEach((el) => el.classList.remove("attacking"));
}

window.addEventListener("resize", (event) => {
    const width = window.innerWidth;
    if (width < 640) {
        document.documentElement.style.setProperty("--board-size", width.toString() + "px");
        document.documentElement.style.setProperty("--square-size", (width / 8).toString() + "px");
        document.documentElement.style.setProperty(
            "--piece-size",
            ((width / 8) * 0.8).toString() + "px"
        );
    }
});

// let firstSelected: TRankFile | null = null;
// let secondSelected: TRankFile | null = null;
// let attacking = false;
// let moveMap = {};

// function handleFirstClick(event: MouseEvent) {
// 	let square = event.target as HTMLElement;
// 	if (!firstSelected) {
// 		square.classList.add('selected');
// 		firstSelected = square.getAttribute('data-pos') as TRankFile;
// 		// let t = setTimeout(() => {
// 		// 	square.classList.remove('selected');
// 		// 	firstSelected = null;
// 		// 	clearTimeout(t);
// 		// }, 2000);
// 	} else if (attacking) {
// 		clearSelected();
// 	} else {
// 		square.classList.add('attacking');
// 		attacking = true;
// 		// clearSelected()
// 		// firstSelected = null;
// 	}
// }

// function handleSecondClick(event: MouseEvent) {
// 	if (firstSelected && !secondSelected) {
// 		let square = event.currentTarget as HTMLElement;
// 		square.classList.add('selected');
// 		secondSelected = square.getAttribute('data-pos') as TRankFile;

// 		const [rank1, file1] = firstSelected.split('');
// 		const [rank2, file2] = secondSelected.split('');
// 		// calculate if positions are 2 units away, and if theres a piece in between

// 		movePiece(firstSelected as TRankFile, secondSelected as TRankFile);
// 		clearSelected();
// 		// secondSelected = null;
// 	}
// }

// function handleAttackClick(event: MouseEvent) {
// 	const element = event.target as HTMLElement;
// 	const rf = element.getAttribute('data-pos');

// 	if (!firstSelected || firstSelected !== rf) {
// 		return;
// 	} else {
// 		element.classList.add('attacking');
// 		attacking = true;

// 		let t = setTimeout(() => {
// 			element.classList.remove('attacking');
// 			attacking = false;
// 			clearTimeout(t);
// 		}, 2000);
// 	}
// }

// function movePiece(pieceRF: TRankFile, squareRF: TRankFile) {
// 	let squarePos = toPosition(squareRF);

// 	const pieceSquare = board.squares[pieceRF];
// 	const { piece } = pieceSquare;
// 	piece?.move(squarePos, board, attacking);
// 	updateBoard();
// }

// function toPosition(rf: TRankFile): IPosition {
// 	let [rank, file] = rf;
// 	return { rank: rank as unknown as TRank, file: file as unknown as TFile };
// }

// function clearSelected() {
// 	let squares = document.querySelectorAll('.square');
// 	squares.forEach((square) => {
// 		square.classList.remove('selected');
// 		square.classList.remove('attacking')
// 	});
// 	firstSelected = null;
// 	secondSelected = null;
// 	attacking = false;
// }
export const noop = () => {};
