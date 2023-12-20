import type { ArrStruct, IntRange, ReadableStruct, ValueRange } from "@/types/sudoku-types";
import { SudokuTemplates } from "@/utils/sudoku-templates";
import { SudokuUtils } from "@/utils/sudoku-utils";
import { defineStore } from "pinia";
import { computed, ref, type ComputedRef } from "vue";
import { sudokuState } from "./sudoku-state";



export const sudokuBoard = defineStore('sudoku-board', () => {

    const state = sudokuState();
    const _generated = computed(() => state.initialRows);
    const _currentStruct = computed(() => state.currentRows);
    const _validityStruct = computed(() => SudokuUtils.getValidityStruct(_currentStruct.value));
    const _currentSelection = ref<ISudokuCell | null>(null);
    const _clearSelection = () => { _currentSelection.value = null };

    const rows = SudokuUtils.mapCell(_currentStruct.value, (value, row, col) => {
      const val = computed(() => _currentStruct.value[row-1][col-1]);
      return {
        value: val,
        row: row,
        col: col,
        immutable: computed(() => !!_generated.value[row-1][col-1]),
        selected: computed(() => _currentSelection.value?.row === row && _currentSelection.value?.col === col),
        valid: computed(() => _validityStruct.value[row-1][col-1]),
        viewfinder: computed(() => _currentSelection.value?.row === row || _currentSelection.value?.col === col ),
        sameValueSelected: computed(() => _currentSelection.value?.value === val.value && val.value !== 0)
      } satisfies ISudokuCell
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
      const pos = { row: _currentSelection.value.row, col: _currentSelection.value.col};
      state.setValue({...pos, value: _value});
    };

    const changeSelection = (key: KeyboardEvent['key']) => {
      if (!_currentSelection.value) return;
      const direction = {
          up: ['ArrowUp', 'W', 'w'],
          left: ['ArrowLeft', 'A', 'a'],
          down: ['ArrowDown', 'S', 's'],
          right: ['ArrowRight', 'D', 'd']
      };
      if (!Object.values(direction).flat().includes(key)) return;
      
      const pos = { row: _currentSelection.value.row, col: _currentSelection.value.col};
      direction.up.includes(key) ? pos.row > 1 ? pos.row-- : pos.row = 9 :
      direction.left.includes(key) ? pos.col > 1 ? pos.col-- : pos.col = 9 :
      direction.down.includes(key) ? pos.row < 9 ? pos.row++ : pos.row = 1 :
      direction.right.includes(key) ? pos.col < 9 ? pos.col++ : pos.col = 1 : '';
      setSelection(pos);
    };

    const nextGame = () => {
      state.nextBoard();
      _clearSelection();
    }

    const previousGame = () => {
      state.previousBoard();
      _clearSelection();
    }

    const resetGame = () => {
      state.resetBoard();
      _clearSelection();
    };

    const undo = () => {
      state.undo();
    }

    const isValid = computed(() => SudokuUtils.isValidityStructValid(_validityStruct.value));

    const isFull = computed(() => percentProgress.value === 100);

    const possibleValues = computed(() => !_currentSelection.value ? [] : 
      SudokuUtils.getPotentialValuesForCell(_currentStruct.value, _currentSelection.value.row, _currentSelection.value.col)
    );

    const percentProgress = computed(() => {
      const countFilled = (struct: ReadableStruct) => struct.flat().filter(el => el !== 0).length;
      const initialFilled = countFilled(_generated.value);
      const currentFilled = countFilled(_currentStruct.value);
      return initialFilled === 81 ? 100 : Math.floor(((currentFilled - initialFilled) / (81 - initialFilled))*100) as IntRange<0, 100>;
    });
    
    return { 
      rows, 
      setSelection, 
      setValue, 
      changeSelection,
      nextGame,
      previousGame,
      resetGame, 
      undo,
      isValid, 
      isFull, 
      possibleValues, 
      percentProgress 
    } satisfies ISudokuBoard;
});

  export interface ISudokuBoard {
    rows: ArrStruct<Readonly<ISudokuCell>>;
    resetGame: () => void;
    nextGame: () => void;
    previousGame: () => void;
    undo: () => void;
    setValue: (value: KeyboardEvent['key'] | (ValueRange | 0 | null)) => void;
    changeSelection: (direction: KeyboardEvent['key']) => void;
    setSelection: (e: { row: ValueRange, col: ValueRange } | null) => void;
    isFull: ComputedRef<boolean>;
    isValid: ComputedRef<boolean>;
    possibleValues: ComputedRef<ValueRange[]>;
    percentProgress: ComputedRef<IntRange<0, 100>>;
  }

  export interface ISudokuCell {
    value: ComputedRef<(ValueRange | 0)>;
    selected: ComputedRef<boolean>;
    immutable: ComputedRef<boolean>;
    valid: ComputedRef<boolean>;
    row: ValueRange;
    col: ValueRange;
    viewfinder: ComputedRef<boolean>;
    sameValueSelected: ComputedRef<boolean>;
  }