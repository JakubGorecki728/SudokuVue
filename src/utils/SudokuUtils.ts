import type { ArrStruct, CellCallback, CellIdxRange, CellObjPos, IterateUseCase, LiteralObject, ObjStruct, Tuple, Range } from "./SudokuTypes";
import _ from "lodash";

export class SudokuUtils {

    private constructor() {}
    
    static structToRows<T>(struct: ArrStruct<T>, callback?: undefined): ObjStruct<T>;
    static structToRows<T, U>(struct: ArrStruct<T>, callback?: (cell: T) => U): ObjStruct<U>;
    static structToRows<T, U>(struct: ArrStruct<T>, callback?: (cell: T) => U): ObjStruct<U | T> {
        return struct.reduce((prevRow, row, rowIdx) => ({ ...prevRow, [rowIdx+1]: row.reduce((prevCol, col, colIdx) => 
            ({ ...prevCol, [colIdx+1]: callback ? callback(col) : col }), {}) }), {}) as ObjStruct<U | T>;
    }

    static rowsToStruct<T>(rows: ObjStruct<T>, callback?: undefined): ArrStruct<T>;
    static rowsToStruct<T, U>(rows: ObjStruct<T>, callback?: (cell: T) => U): ArrStruct<U>;
    static rowsToStruct<T, U>(rows: ObjStruct<T>, callback?: (cell: T) => U): ArrStruct<U | T> {
        return Object.values(rows).map(x => Object.values(x).map(el => callback ? callback(el) : el)) as ArrStruct<U | T>
    }

    static forEachCell<T>(rows: ObjStruct<T>, callback: CellCallback<T, void>): void;
    static forEachCell<T>(rows: ArrStruct<T>, callback: CellCallback<T, void>): void;
    static forEachCell<T>(rows: ObjStruct<T> | ArrStruct<T>, callback: CellCallback<T, void>): void  {
        SudokuUtils.iterate(rows, callback, 'forEach');
    }

    static mapCell<T, U>(rows: ObjStruct<T>, callback: CellCallback<T, U>): ObjStruct<U>;
    static mapCell<T, U>(rows: ArrStruct<T>, callback: CellCallback<T, U>): ArrStruct<U>;
    static mapCell<T, U>(rows: ObjStruct<T> | ArrStruct<T>, callback: CellCallback<T, U>): ObjStruct<U> | ArrStruct<U>  {
        const rowsCopy = _.cloneDeep(rows);
        return SudokuUtils.iterate(rowsCopy, callback, 'map') as ObjStruct<U> | ArrStruct<U>
    }

    static findCell<T>(rows: ObjStruct<T>, callback: CellCallback<T, boolean>): T | undefined;
    static findCell<T>(rows: ArrStruct<T>, callback: CellCallback<T, boolean>): T | undefined;
    static findCell<T>(rows: ObjStruct<T> | ArrStruct<T>, callback: CellCallback<T, boolean>): T | undefined {
        return SudokuUtils.iterate(rows, callback, 'find') as T | undefined
    }

    static filterCell<T>(rows: ObjStruct<T>, callback: CellCallback<T, boolean>): T[];
    static filterCell<T>(rows: ArrStruct<T>, callback: CellCallback<T, boolean>): T[];
    static filterCell<T>(rows: ObjStruct<T> | ArrStruct<T>, callback: CellCallback<T, boolean>): T[] {
        return SudokuUtils.iterate(rows, callback, 'filter') as T[]
    }

    static transpose<T>(rows: ArrStruct<T>): ArrStruct<T> {
        return rows.map((el, i, arr) => arr.map(x => x[i])) as ArrStruct<T>;
    }

    static rowsToSquares<T>(rows: ArrStruct<T>): ArrStruct<T> {
        return _(rows).map(x => _.chunk(x, 3)).chunk(3)
            .flatMap(x => x.map((x2, x2i) => x2.flatMap((x3, x3i) => x[x3i][x2i]))).value() as ArrStruct<T>;
    }

    static isBoardValid<T extends Range | 0 | null>(rows: ArrStruct<T>, callback?: undefined): boolean;
    static isBoardValid<T extends Range | 0 | null>(rows: ObjStruct<T>, callback?: undefined): boolean;
    static isBoardValid<T, U extends Range | 0 | null>(rows: ArrStruct<T>, callback: T extends  Range | 0 | null ? undefined : (cell: T) => U): boolean;
    static isBoardValid<T, U extends Range | 0 | null>(rows: ObjStruct<T>, callback: T extends  Range | 0 | null ? undefined : (cell: T) => U): boolean;
    static isBoardValid<T, U>(rows: ObjStruct<T> | ArrStruct<T>, callback?: (cell: T) => U): boolean {
        let struct = Array.isArray(rows) ? rows : SudokuUtils.rowsToStruct(rows);
        (struct as any) = SudokuUtils.mapCell(struct, row => {
            const value = callback ? callback(row) : row;
            return value === null ? 0 : value
        }) 
       return SudokuUtils.isValidityStructValid(SudokuUtils.getValidityStruct(struct as any)) as boolean
    }


    static generateEmptyStruct<T extends 0>(): ArrStruct<T> {
        return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0)) as ArrStruct<T>
    }

    static solve<T extends Range | 0>(struct: ArrStruct<T>): ArrStruct<T> | any  {
        const cache: { row: Range, col: Range, potentials: (Range | 0)[] }[] = [] as any;
        if (!SudokuUtils.isBoardValid(struct)) { console.log('board is invalid'); return struct}
        let backtracks = 0;
        let steps = 0;
        const prevStruct = SudokuUtils.mapCell(struct, (cell, row, col ) => ({
            row,
            col,
            value: cell,
            potentials: [],
            isExplicit: cell !== 0 ? true : false,
        }));
        let tempStruct = SudokuUtils.mapCell(prevStruct, el => el.value);
        while (!SudokuUtils.isBoardFull(tempStruct) || steps < 1000) {
            steps++;
            SudokuUtils.forEachCell(prevStruct, (val, row, col) => { 
                (val.potentials as any) = SudokuUtils.getPotentialValuesForCell(tempStruct, row, col);
            });

            const invalidCell = cache.length ? SudokuUtils.findCell(prevStruct, (cell => cell.value === 0 && !cell.potentials.length)) : undefined;

            if (invalidCell) {
                backtracks++;
                SudokuUtils.forEachCell(prevStruct, cell => { if (!cell.isExplicit) { cell.value = 0 as any; } });
                const lastCache = (cache as any)[cache.length-1];
                const newTry = prevStruct[lastCache.row-1][lastCache.col-1];
                newTry.value = lastCache.potentials[0]
                lastCache.potentials = lastCache.potentials.filter((el: any) => el !== lastCache.potentials[0])
                if (!lastCache.potentials.length) {
                    (cache as any).pop();
                    newTry.isExplicit = cache.length === 0 ? true : false;
                }
                tempStruct = SudokuUtils.mapCell(prevStruct, el => el.value);
                continue;
            }

            const sorted = _.sortBy(prevStruct.flat(), [el => el.potentials.length]);
            const explicits = sorted.filter(el => el.potentials.length === 1);

            if (explicits.length) {
                explicits.forEach(el => { 
                    (el.value as any) = el.potentials[0];
                    el.isExplicit = !cache.length;

                })
            } else {
                const implicit = sorted.filter(el => el.potentials.length > 1)[0];
                if (!implicit) { break; }
                implicit.value = implicit.potentials[0];
                implicit.isExplicit = false;
                cache.push({
                    row: implicit.row,
                    col: implicit.col,
                    potentials: implicit.potentials.filter(el => el !== implicit.potentials[0])
                });
            }
            tempStruct = SudokuUtils.mapCell(prevStruct, el => el.value);
        }
        console.log(`finished with ${steps} steps`);
        console.log(`backtracks: ${backtracks}`)
        console.log('is valid ' + SudokuUtils.isBoardValid(prevStruct, el => el.value))
        console.log('is full: '+SudokuUtils.isBoardFull(SudokuUtils.mapCell(prevStruct, el => el.value)))
        return SudokuUtils.mapCell(prevStruct, el => el.value);

    }


    static getPotentialValuesForCell<T extends LiteralObject>(struct: ArrStruct<T>, row: Range, col: Range, callback: (cell: T) => Range | 0): Range[];
    static getPotentialValuesForCell<T extends Range | 0>(struct: ArrStruct<T>, row: Range, col: Range, callback?: undefined): Range[];
    static getPotentialValuesForCell<T extends Range | 0 | LiteralObject>(struct: ArrStruct<T>, row: Range, col: Range, callback?: (cell: T) => Range | 0): Range[] {
        const _struct = (callback ? SudokuUtils.mapCell(struct, el => callback(el)) : struct) as any
        if (_struct[row-1][col-1] !== 0) return [];
        const rows = _struct;
        const cols = SudokuUtils.transpose(_struct);
        const currentSquare = SudokuUtils.rowsToSquares(struct)[SudokuUtils.getChunkIndexByPos(row, col)-1];

        const potentialVals = SudokuUtils.getPotentialValues(rows[row-1], cols[col-1], currentSquare)

        if (potentialVals.length <= 1) return potentialVals;

        const adjacentPositions = SudokuUtils.getAdjacentPositions(row, col).filter(el => el.col !== col || el.row !== row).map(pos => {
            const value = rows[pos.row-1][pos.col-1];
            const potentialVals = value !== 0 ? [] : SudokuUtils.getPotentialValues(rows[pos.row-1], cols[pos.col-1], currentSquare)
            return { ...pos, value, potentialVals }
        });

        const potentialValue = potentialVals.find(value => adjacentPositions.every(cell => !cell.potentialVals.includes(value)));

        return potentialValue ? [potentialValue] : potentialVals
    }

    private static isBoardFull<T extends LiteralObject>(struct: ArrStruct<T>, callback: (cell: T) => Range | 0): boolean;
    private static isBoardFull<T extends Range | 0>(struct: ArrStruct<T>, callback?: undefined): boolean;
    private static isBoardFull<T extends Range | 0 | LiteralObject>(struct: ArrStruct<T>, callback?: (cell: T) => Range | 0): boolean {
        return struct.every(el => el.every(cell => callback ? callback(cell) !== 0 : cell !== 0))
    }

    private static getPotentialValues<T extends Tuple<Range | 0, 9>>(row: T, col: T, square: T): Range[] {
        return _.difference(Array.from({ length: 9 }, (x, i) => i + 1), [...new Set([...row, ...col, ...square])]) as Range[];
    }

    private static getAdjacentPositions(row: Range, col: Range): { row: Range; col: Range }[] {
        const adj: any = [row, col].map(pos => Array.from({ length: 3 }, (x, i) => Math.ceil(pos/3)*3-2 +i));
        return adj[0].flatMap((row: any) => adj[1].map((col: any) => ({ row, col })))
    }

    private static getValidityStruct<T extends Range | 0>(rows: ArrStruct<T>): ArrStruct<boolean> {
        return rows.map((r, ri, ra) => r.map((c, ci) => !c ? true : 
            [ra[ri], ra.map(x => x[ri]), SudokuUtils.rowsToSquares(ra as any)[SudokuUtils.getChunkIndex(SudokuUtils.getCellIndex(<any>ci+1, <any>ri+1))-1]]
                .every(el => el.filter(x => x === c).length < 2))) as ArrStruct<boolean>
    }

    //PRIVATE FUNCTIONS

    private static iterate<T, U>(rows: ObjStruct<T> | ArrStruct<T>, callback: CellCallback<T, U>, usecase: IterateUseCase): ObjStruct<U> | ArrStruct<U> | void | U | undefined | U[] {
        const isArr = Array.isArray(rows);
        const filterArr: U[] = []
        for (let row = 1; row <= 9; row++) {
            for (let col = 1; col <= 9; col++) {
                const pos = { row: isArr ? row - 1 : row, col: isArr ? col - 1 : col }
                const clbck = () => callback((rows as any)[pos.row][pos.col], row as unknown as Range, col as unknown as Range);

                if (usecase === 'forEach') { clbck(); }
                else if (usecase === 'map') { (rows as any)[pos.row][pos.col] = clbck(); }
                else if (usecase === 'find' && clbck()) { return (rows as any)[pos.row][pos.col] as U }
                else if (usecase === 'filter' && clbck()) { filterArr.push((rows as any)[pos.row][pos.col]) }
            }
        }
        if (usecase === 'map') { return rows as unknown as ObjStruct<U> | ArrStruct<U>; }
        else if(usecase === 'filter') { return filterArr; }
    }

    private static eachRowValid<T extends Range | 0>(rows: ArrStruct<T>): Tuple<boolean, 9> {
        return rows.map(x => x.filter(r => r))
            .map(el => el.length === [...new Set(el)].length) as Tuple<boolean, 9>;
    }

    private static eachCellValid<T extends Tuple<boolean, 9>>(rows: T): boolean {
        return !rows.includes(false);
    }

    private static isValidityStructValid(rows: ArrStruct<boolean>): boolean {
        return rows.map(row => row.every(col => col)).every(row => row)
    }

    private static getChunkIndexByPos(row: Range, col: Range): Range {
        return SudokuUtils.getChunkIndex(SudokuUtils.getCellIndex(row, col))
    }

    private static getChunkIndex(cellIdx: CellIdxRange): Range {
        return Math.floor(((cellIdx-1) % 9) / 3) + 3 * Math.floor((cellIdx-1) / (9 * 3))+1 as Range
    }

    private static getCellIndex(row: Range, col: Range): CellIdxRange {
        return (row-1)*9 + col as CellIdxRange
    }

    private static getCellPos(cellIdx: CellIdxRange): CellObjPos {
        return { 
            row: Math.ceil(cellIdx / 9),
            col: (cellIdx % 9) === 0 ? 9 : (cellIdx % 9)
        } as CellObjPos
    }
}


