import type { ArrStruct, IntRange, ReadableStruct, ValueRange } from "@/types/sudoku-types";
import { SudokuUtils } from "@/utils/sudoku-utils";
import _ from "lodash";
import { defineStore } from "pinia";
import { computed, ref, type Ref, type ComputedRef } from "vue";



export const sudokuBoard = defineStore('sudoku-board', () => {

    const _boardNo = ref(0);
    const _generated = computed(() => boards[_boardNo.value]);
    const _currentStruct = ref<ReadableStruct>(_generated.value);
    const _validityStruct = computed(() => SudokuUtils.getValidityStruct(_currentStruct.value));
    const _currentSelection = ref<ISudokuCell | null>(null);
    const _valueChangeHandler = () => {
      _currentStruct.value = SudokuUtils.mapCell(rows, (cell) => cell.value.value);
    };

    const rows = SudokuUtils.mapCell(_generated.value, (value, row, col) => {
      const val = ref(value);
      return {
        value: val,
        row: row,
        col: col,
        immutable: computed(() => !!_generated.value[row-1][col-1]),
        selected: computed(() => _currentSelection.value?.row === row && _currentSelection.value?.col === col),
        valid: computed(() => _validityStruct.value[row-1][col-1]),
        viewfinder: computed(() => _currentSelection.value?.row === row || _currentSelection.value?.col === col ),
        sameValueSelected: computed(() => _currentSelection.value?.value === val.value),
      } as ISudokuCell
    });

    const setSelection = (e: { row: ValueRange, col: ValueRange } | null) => {
      _currentSelection.value = !e ? null : (SudokuUtils
        .findCell(rows, (cell, row, col) => e.row === row && e.col === col) ?? null) as any;
    };

    const setValue = (value: KeyboardEvent['key'] | (ValueRange | 0 | null)) => {
      if (!_currentSelection.value || _currentSelection.value?.immutable === true) return;

      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const deletes = [null, 0, 'Backspace', 'Delete', '0'];
      const _value: ValueRange | 0 | undefined = values.some(el => el == value) ? 
        parseInt(value+'') as ValueRange : 
        deletes.some(el => el === value) ? 0 : undefined;

      if (_value === undefined) return;

      _currentSelection.value.value = _value as any;
      _valueChangeHandler();
    };

    const changeSelection = (key: KeyboardEvent['key']) => {
      if (!_currentSelection.value) return;
      const direction = {
          up: ['ArrowUp', 'W', 'w'],
          left: ['ArrowLeft', 'A', 'a'],
          down: ['ArrowDown', 'S', 's'],
          right: ['ArrowRight', 'D', 'd']
      }
      if (!Object.values(direction).flat().includes(key)) return;
      
      const pos = { row: _currentSelection.value.row, col: _currentSelection.value.col};
      direction.up.includes(key) ? pos.row > 1 ? pos.row-- : pos.row = 9 :
      direction.left.includes(key) ? pos.col > 1 ? pos.col-- : pos.col = 9 :
      direction.down.includes(key) ? pos.row < 9 ? pos.row++ : pos.row = 1 :
      direction.right.includes(key) ? pos.col < 9 ? pos.col++ : pos.col = 1 : '';
      setSelection(pos);
    };

    const newGame = (boardNumber: number) => {
      _boardNo.value = boardNumber;
      SudokuUtils.forEachCell(rows, (cell, row, col) => {
        cell.value.value = _generated.value[row-1][col-1];
      });
      _currentSelection.value = null;
      _valueChangeHandler();
    };

    const resetGame = () => {
      newGame(_boardNo.value);
    };

    const isValid = computed(() => SudokuUtils.isValidityStructValid(_validityStruct.value));

    const isFull = computed(() => percentProgress.value === 100);

    const possibleValues = computed(() => !_currentSelection.value ? [] : 
      SudokuUtils.getPotentialValuesForCell(_currentStruct.value, _currentSelection.value.row, _currentSelection.value.col)
    );

    const percentProgress = computed(() => {
      const countFilled = (struct: ReadableStruct) => struct.flat().filter(el => el !== 0).length;
      const initialFilled = countFilled(_generated.value);
      const currentFilled = countFilled(_currentStruct.value);
      return Math.floor(((currentFilled - initialFilled) / (81 - initialFilled))*100);
    });
    
    return { 
      rows, 
      setSelection, 
      setValue, 
      changeSelection, 
      newGame,
      resetGame, 
      isValid, 
      isFull, 
      possibleValues, 
      percentProgress 
    } as ISudokuBoard
});

  export interface ISudokuBoard {
    rows: ArrStruct<Readonly<ISudokuCell>>;
    newGame: (boardNumber: number) => void;
    resetGame: () => void;
    setValue: (value: KeyboardEvent['key'] | (ValueRange | 0 | null)) => void;
    changeSelection: (direction: KeyboardEvent['key']) => void;
    setSelection: (e: { row: ValueRange, col: ValueRange } | null) => void;
    isFull: ComputedRef<boolean>;
    isValid: ComputedRef<boolean>;
    possibleValues: ComputedRef<ValueRange[]>;
    percentProgress: ComputedRef<IntRange<0, 100>>;
  }

  export interface ISudokuCell {
    value: Ref<(ValueRange | 0)>;
    selected: ComputedRef<boolean>;
    immutable: ComputedRef<boolean>;
    valid: ComputedRef<boolean>;
    row: ValueRange;
    col: ValueRange;
    viewfinder: ComputedRef<boolean>;
    sameValueSelected: ComputedRef<boolean>;
  }


  const boards: ReadableStruct[] = [
    [
        [0, 0, 0,   0, 0, 0,    1, 0, 0],
        [0, 0, 6,   0, 0, 1,    0, 0, 4],
        [0, 0, 8,   0, 0, 0,    0, 0, 0],

        [0, 0, 0,   0, 3, 4,    0, 0, 0],
        [0, 0, 0,   0, 8, 0,    0, 5, 0],
        [0, 2, 9,   0, 0, 0,    6, 0, 3],

        [0, 0, 0,   0, 1, 6,    7, 0, 0],
        [9, 0, 0,   0, 0, 8,    0, 0, 6],
        [0, 4, 3,   0, 2, 7,    0, 8, 0]
    ],
    [
        [0, 0, 0,   1, 2, 0,    3, 4, 0],
        [5, 0, 0,   3, 0, 0,    0, 0, 8],
        [2, 0, 0,   0, 0, 8,    0, 0, 0],

        [0, 7, 0,   0, 0, 1,    2, 8, 0],
        [8, 0, 0,   0, 0, 0,    0, 0, 9],
        [0, 0, 0,   0, 0, 0,    0, 0, 0],

        [0, 0, 0,   0, 6, 4,    0, 0, 0],
        [3, 1, 0,   0, 0, 0,    8, 0, 0],
        [0, 4, 0,   0, 0, 0,    0, 0, 6]
    ],
    [
        [0, 0, 0,   9, 0, 0,    0, 0, 0],
        [0, 5, 1,   0, 0, 0,    0, 0, 0],
        [0, 7, 0,   4, 0, 0,    5, 9, 8],

        [0, 0, 0,   0, 7, 0,    0, 0, 0],
        [1, 0, 0,   8, 0, 2,    4, 0, 3],
        [0, 0, 0,   6, 0, 9,    0, 0, 2],

        [0, 3, 6,   0, 0, 0,    8, 0, 0],
        [0, 0, 0,   0, 0, 0,    0, 0, 6],
        [0, 0, 7,   0, 0, 3,    0, 0, 9]
    ]
];