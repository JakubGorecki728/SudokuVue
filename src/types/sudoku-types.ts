export type ValueRange = IntRange<1, 9>;
export type CellIdxRange = IntRange<1, 81>
export type LiteralObject = { [key: string]: any; }

export type SudokuDifficulty = 'easy' | 'medium' | 'hard'
export type ReadableStruct = ArrStruct<ValueRange | 0>;

export type ReadonlyReadableStruct = Readonly<Tuple<Readonly<Tuple<Readonly<ValueRange | 0>, 9>>, 9>>;
export type Templates = Record<SudokuDifficulty, ReadableStruct[]>


export type DataCell = { value: Readonly<CellValueRange>, immutable: Readonly<boolean> }
export type DataRow = Readonly<Record<ValueRange, DataCell>>
export type DataRows = Readonly<Record<ValueRange, DataRow>>


export type CellObjPos = { row: ValueRange, col: ValueRange }
export type CellStringPos = `${ValueRange}${ValueRange}`
export type CellValueRange = ValueRange | null

export type Cell = DataCell & {
    setValue: (value: CellValueRange | KeyboardEvent) => void;
    position: CellObjPos;
    isValid: boolean;
}
export type Row = Record<ValueRange, Cell>
export type Rows = Record<ValueRange, Row>


/* Utility types */

export type IterateUseCase = 'forEach' | 'map' | 'find' | 'filter'

export type ArrStruct<T> = Tuple<Tuple<T, 9>, 9>

export type ObjStruct<T> = Record<ValueRange, Record<ValueRange, T>>

export type CellCallback<CellType, ReturnType> = (cell: CellType, row: ValueRange, col: ValueRange) => ReturnType

export type Tuple<T, N, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [...R, T]>;

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T

