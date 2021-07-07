import { Piece } from "./piece";

export type TFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type TRank = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';
export const ERank = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
};
export enum EFile {
    a = 0,
    b = 1,
    c = 2,
    d = 3,
    e = 4,
    f = 5,
    g = 6,
    h = 7,
}

export interface IPosition {
    file: TFile;
    rank: TRank;
}

export type TPiece = "red" | "black";

export type TRankFile = `${TRank}${TFile}`;

export type TBoard = {
    [key in TRankFile]: TSquare;
};

export type TSquare = {
    piece: Piece | null;
    pos: IPosition;
};

export function toRankFile(position: IPosition): TRankFile {
    const { rank, file } = position;
    return `${rank}${file}` as TRankFile;
}

export type TColumn = {
    [key in TFile]: TSquare;
};

export type TRow = {
    [key in TRank]: TColumn;
};
