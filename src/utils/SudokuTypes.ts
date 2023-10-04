export type Range = IntRange<1, 9>;
export type CellIdxRange = IntRange<1, 81>
export type LiteralObject = { [key: string]: any; }

export type SudokuDifficulty = 'easy' | 'medium' | 'hard'
export type ReadableStruct = ArrStruct<Range | 0>
export type Templates = Record<SudokuDifficulty, ReadableStruct[]>


export type DataCell = { value: Readonly<CellValueRange>, immutable: Readonly<boolean> }
export type DataRow = Readonly<Record<Range, DataCell>>
export type DataRows = Readonly<Record<Range, DataRow>>


export type CellObjPos = { row: Range, col: Range }
export type CellStringPos = `${Range}${Range}`
export type CellValueRange = Range | null

export type Cell = DataCell & {
    setValue: (value: CellValueRange | KeyboardEvent) => void;
    position: CellObjPos;
    isValid: boolean;
}
export type Row = Record<Range, Cell>
export type Rows = Record<Range, Row>


/* Utility types */

export type IterateUseCase = 'forEach' | 'map' | 'find' | 'filter'

export type ArrStruct<T> = Tuple<Tuple<T, 9>, 9>

export type ObjStruct<T> = Record<Range, Record<Range, T>>

export type CellCallback<CellType, ReturnType> = (cell: CellType, row: Range, col: Range) => ReturnType

export type Tuple<T, N, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [...R, T]>;

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T

