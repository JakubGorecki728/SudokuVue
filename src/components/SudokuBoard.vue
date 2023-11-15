<script setup lang="ts">
import SudokuCell from './SudokuCell.vue';
import { sudokuBoard } from '@/stores/sudoku';
import type { ArrStruct } from '@/types/sudoku-types';
import { SudokuUtils } from '@/utils/sudoku-utils';

    const board = sudokuBoard();

    const transform = (rows: ArrStruct<any>) => SudokuUtils.rowsToSquares(rows);

</script>


<template>

    <div class="h-100 w-100 p-3">
        <div class="grid-container grid-gap">
            <div class="grid-container" v-for="(row, rowIdx) of transform(board.rows)" :key="rowIdx">
                <SudokuCell 
                v-for="(cell, cellIdx) of row"
                :key="cellIdx"
                :cell="(cell as any)" 
                @cell-click="board.setSelection($event)"
                ></SudokuCell>
            </div>
        </div>
    </div>

</template>


<style scoped>

    .grid-gap {
        grid-gap: 5px;
    }

    .grid-container {
        aspect-ratio: 1 / 1;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
    }

</style>