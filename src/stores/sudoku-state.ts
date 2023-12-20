import type { ReadableStruct, ReadonlyReadableStruct, ValueRange } from "@/types/sudoku-types";
import { SudokuTemplates } from "@/utils/sudoku-templates";
import { SudokuUtils } from "@/utils/sudoku-utils";
import { defineStore } from "pinia";
import { ref, computed, type ComputedRef, type Ref } from "vue";

export const sudokuState = defineStore('sudoku-state', () => {
    const _saveToLocalStorage = () => {
      localStorage.setItem('boardState', JSON.stringify({
        currentRows: _currentRows.value,
        boardIndex: _boardIndex.value
      }))
    }

    const getFromLocalStorage: () => SudokuLocalStorage | undefined = () => {
      const storage = localStorage.getItem('boardState');
      return storage ? JSON.parse(storage) : undefined;
    }

    const _boardIndex = ref(getFromLocalStorage()?.boardIndex ?? 0);
    const _template = computed(() => SudokuTemplates.getTemplate(_boardIndex.value));
    const _clone = (rows: ReadableStruct) => SudokuUtils.mapCell(rows, (cell) => cell);
    const initialRows = computed(() => _template.value.template);
    const _currentRows = ref<ReadableStruct>(getFromLocalStorage()?.currentRows ?? _clone(initialRows.value));
    const currentRows = computed(() => _currentRows.value);
    const previosValues: { row: ValueRange, col: ValueRange, value: ValueRange | 0 }[] = [];
    const _reset = () => { 
      _currentRows.value = _clone(initialRows.value); 
      previosValues.length = 0;
      _saveToLocalStorage();
    }

    const nextBoard = () => { if (_boardIndex.value < _template.value.length - 1) { _boardIndex.value++; _reset() } };
    const previousBoard = () => { if (_boardIndex.value > 0) { _boardIndex.value--; _reset() } };
    const resetBoard = () => { _reset() };
    const setValue = (value: {row: ValueRange, col: ValueRange, value: ValueRange | 0}) => { 
      const old = _currentRows.value[value.row-1][value.col-1];
      _currentRows.value[value.row-1][value.col-1] = value.value;
      _saveToLocalStorage();
      if (old === value.value) return;
      previosValues.push({ ...value, value: old });
    };
    const undo = () => {
      if (!previosValues.length) return;
      const lastMove = previosValues.pop();
      _currentRows.value[lastMove!.row-1][lastMove!.col-1] = lastMove!.value;
      _saveToLocalStorage();
    };
    
    return { 
      initialRows, 
      currentRows, 
      nextBoard, 
      previousBoard, 
      resetBoard,
      setValue,
      undo
    } satisfies ISudokuState;
});

export interface ISudokuState {
    initialRows: ComputedRef<ReadonlyReadableStruct>;
    currentRows: ComputedRef<ReadonlyReadableStruct>;
    nextBoard: () => void;
    previousBoard: () => void;
    resetBoard: () => void;
    undo: () => void;
    setValue: (value: {row: ValueRange, col: ValueRange, value: ValueRange | 0}) => void;
  }

  type SudokuLocalStorage = {
    currentRows: ReadableStruct;
    boardIndex: number;
  }
