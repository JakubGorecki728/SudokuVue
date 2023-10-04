import _ from "lodash";
import { SudokuGenerator } from "./SudokuGenerator";
import type { SudokuDifficulty, DataRows, Rows, Cell, CellValueRange } from "./SudokuTypes";
import { SudokuUtils } from "./SudokuUtils";


export class SudokuBoard {
    private constructor(difficulty: SudokuDifficulty) {
        this._dataRows = SudokuGenerator.generate(difficulty)
        this._rows = this.createRows(this._dataRows);
    }

    private _dataRows: DataRows;
    private _rows: Rows;

    get rows() {
        return this._rows;
    }

    static create(difficulty: SudokuDifficulty): SudokuBoard {
        return new SudokuBoard(difficulty)
    }

    private createRows(dataRows: DataRows): Rows {
        return SudokuUtils.mapCell(dataRows, (val, row, col) => {
            const setValueHandler = this.setValueHandler;
            const cell: Cell = {
                ...val,
                setValue(value) { 
                    const val = setValueHandler(value); 
                    if (val !== undefined && this.immutable === false) { this.value = val; }
                },
                position: { row, col },
                isValid: true
            }
            return cell
        }) as Rows;
    }

    solve() {
        const solved = SudokuUtils.solve(SudokuUtils.rowsToStruct(this._rows, el => el.value === null ? 0 : el.value));
        SudokuUtils.forEachCell(this._rows, (el, row, col) => {
            el.value = solved[row-1][col-1];
        })
    }

    isBoardValid(): boolean {
        return SudokuUtils.isBoardValid(this._rows, cell => cell.value);
    }

    restartBoard() {
        SudokuUtils.forEachCell(this._rows, (el) => {
            if (!el.immutable) { el.value = null }
        })
    }

    getPosibleMoves(row: any, col: any) {
        const mapper = SudokuUtils.mapCell(this._rows, el => el.value === null ? 0 : el.value)
        const struct = SudokuUtils.rowsToStruct(mapper)
        return SudokuUtils.getPotentialValuesForCell(struct, row, col)
    }

    private setValueHandler(value: CellValueRange | KeyboardEvent): CellValueRange | undefined {
        const val = value as any;
        return _.inRange(parseInt(val?.key) ?? val, 1, 10) ? 
            (val?.key ? parseInt(val.key) : val) : val === null || 
                ['Delete', 'Backspace', '0'].includes(val?.key) ? 
                    null : undefined
    }

}
