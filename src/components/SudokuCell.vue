<script setup lang="ts">
import type { ISudokuCell } from '@/stores/sudoku';
import type { ValueRange } from '@/types/sudoku-types';

    defineProps<{ 
        cell: Readonly<ISudokuCell>
    }>();

    const emit = defineEmits<{
        (event: 'cell-click', payload: { row: ValueRange, col: ValueRange }): void;
    }>();
    
</script>


<template>
    
    <div 
    class="cell-container"
    :class="{ 'viewfinder': cell.viewfinder }"
    >
        <div
        class="cell"
        @click="emit('cell-click', { row: cell.row, col: cell.col })"
        :class="{ 
            'immutable': cell.immutable,
            'selected': cell.selected,
            'invalid': !cell.valid,
            'sameValueSelected': cell.sameValueSelected,
        }"> {{ cell.value || '' }} </div>
    </div>

</template>


<style lang="css" scoped>

    .cell-container {
        padding: 2px;
    }
    .cell{
        aspect-ratio: 1 / 1;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid rgba(112, 112, 112, 0.3);
        border-radius: 5px;
    }

    .immutable {
        background-color: rgba(112, 112, 112, 0.3);
    }

    .viewfinder {
        background-color: rgba(56, 182, 255, 0.12);
    }

    .sameValueSelected {
        /* background-color: rgba(255, 238, 0, 0.15); */
        box-shadow: 0px 0px 5px rgb(255, 217, 0);
        border-color: rgb(255, 217, 0);
    }

    .invalid {
        /* background-color: rgba(255, 0, 0, 0.2); */
        color: red;
    }

    .selected {
        /* background-color: rgba(0, 255, 102, 0.01);    */
        border-color: rgb(0, 162, 255);
        box-shadow: 0px 0px 10px rgb(30, 176, 255);
    }

    .cell:hover {
        box-shadow: 0px 0px 10px rgb(30, 176, 255);
        cursor: default;
    }

</style>