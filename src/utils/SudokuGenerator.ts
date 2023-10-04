import type { ReadableStruct, DataRows, DataCell, SudokuDifficulty, Templates } from "./SudokuTypes";
import { SudokuUtils } from "./SudokuUtils";

export class SudokuGenerator {
    
    private constructor() {}

    private static structToObj(struct: ReadableStruct): DataRows {
        return SudokuUtils.structToRows(struct, el => ({
            immutable: (el === 0 ? false : true), 
            value: (el === 0 ? null : el)
        } as DataCell))
    }

    static generate(difficulty: SudokuDifficulty): DataRows {
        const boards = this.templates[difficulty];
        const randomBoard = boards[Math.floor(Math.random() * boards.length)]
        return this.structToObj(randomBoard)
    }

    private static templates: Templates = {
        easy: [
            [
                [0, 0, 0, 0, 0, 0, 1, 0, 0],
                [0, 0, 6, 0, 0, 1, 0, 0, 4],
                [0, 0, 8, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 3, 4, 0, 0, 0],
                [0, 0, 0, 0, 8, 0, 0, 5, 0],
                [0, 2, 9, 0, 0, 0, 6, 0, 3],
                [0, 0, 0, 0, 1, 6, 7, 0, 0],
                [9, 0, 0, 0, 0, 8, 0, 0, 6],
                [0, 4, 3, 0, 2, 7, 0, 8, 0]
            ],
            [
                [0, 0, 0, 1, 2, 0, 3, 4, 0],
                [5, 0, 0, 3, 0, 0, 0, 0, 8],
                [2, 0, 0, 0, 0, 8, 0, 0, 0],
                [0, 7, 0, 0, 0, 1, 2, 8, 0],
                [8, 0, 0, 0, 0, 0, 0, 0, 9],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 6, 4, 0, 0, 0],
                [3, 1, 0, 0, 0, 0, 8, 0, 0],
                [0, 4, 0, 0, 0, 0, 0, 0, 6]
            ],
            [
                [0, 0, 0, 9, 0, 0, 0, 0, 0],
                [0, 5, 1, 0, 0, 0, 0, 0, 0],
                [0, 7, 0, 4, 0, 0, 5, 9, 8],
                [0, 0, 0, 0, 7, 0, 0, 0, 0],
                [1, 0, 0, 8, 0, 2, 4, 0, 3],
                [0, 0, 0, 6, 0, 9, 0, 0, 2],
                [0, 3, 6, 0, 0, 0, 8, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 6],
                [0, 0, 7, 0, 0, 3, 0, 0, 9]
            ]
        ],
        medium: [
            [
                [0, 0, 0,   0, 0, 0,    0, 1, 7],
                [6, 0, 0,   0, 0, 0,    3, 0, 0],
                [2, 7, 0,   3, 0, 0,    4, 0, 5],

                [9, 0, 0,   0, 8, 0,    0, 0, 3],
                [0, 0, 0,   0, 0, 0,    0, 0, 4],
                [0, 5, 0,   0, 2, 1,    0, 9, 0],
                
                [3, 0, 0,   0, 0, 0,    0, 0, 1],
                [4, 0, 8,   9, 0, 0,    0, 0, 0],
                [0, 0, 5,   0, 0, 0,    0, 7, 0]
            ]
        ],
        hard: [
            [
                [0, 2, 0,   0, 1, 0,    0, 0, 0],
                [0, 0, 8,   0, 5, 0,    0, 0, 6],
                [0, 0, 6,   0, 0, 0,    0, 9, 2],

                [0, 5, 0,   0, 0, 2,    0, 0, 0],
                [3, 1, 0,   0, 0, 0,    0, 0, 0],
                [0, 0, 0,   8, 0, 0,    0, 7, 0],

                [0, 6, 0,   0, 4, 0,    0, 0, 9],
                [0, 0, 9,   3, 0, 0,    8, 0, 4],
                [0, 0, 0,   0, 6, 0,    2, 0, 0]
            ],
            [
                [0, 0, 0,   3, 0, 0,    2, 8, 6],
                [3, 0, 2,   0, 0, 9,    0, 0, 0],
                [0, 0, 0,   0, 0, 6,    0, 0, 0],

                [0, 0, 5,   0, 8, 0,    0, 0, 1],
                [0, 8, 7,   0, 0, 0,    0, 0, 2],
                [0, 0, 0,   0, 0, 0,    3, 0, 0],

                [0, 0, 1,   6, 0, 8,    0, 0, 0],
                [0, 5, 0,   0, 0, 1,    0, 0, 0],
                [6, 2, 0,   0, 0, 0,    5, 0, 0],
            ],
            // [
            //     [0, 0, 0,   8, 0, 1,    0, 0, 0],
            //     [0, 0, 0,   0, 0, 0,    0, 4, 3],
            //     [5, 0, 0,   0, 0, 0,    0, 0, 0],

            //     [0, 0, 0,   0, 7, 0,    8, 0, 0],
            //     [0, 0, 0,   0, 0, 0,    1, 0, 0],
            //     [0, 2, 0,   0, 3, 0,    0, 0, 0],

            //     [6, 0, 0,   0, 0, 0,    0, 7, 5],
            //     [0, 0, 3,   4, 0, 0,    0, 0, 0],
            //     [0, 0, 0,   2, 0, 0,    6, 0, 0]
            // ]
        ]
    };
}


