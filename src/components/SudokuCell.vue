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
            'invalid': !cell.valid && cell.sameValueSelected,
            'sameValueSelected': cell.sameValueSelected && cell.valid,
        }"> {{ cell.value || '' }} </div>
    </div>

</template>


<style lang="css" scoped>

    .cell-container {
        container: cell-container / size;
        padding: 1%;
        aspect-ratio: 1 / 1;

        --same-value-selected-color: rgb(231, 201, 32);
        --value-selected-color: rgb(30, 175, 255);
        --invalid-value-color: rgb(253, 55, 55);

        --viewfinder-bg-color: rgba(56, 182, 255, 0.1);
        --box-shadow-size: 0px 0px 15cqh;
        --immutable-bg-color: rgba(112, 112, 112, 0.3);
    }
    .cell{

        aspect-ratio: 1 / 1;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--immutable-bg-color);
        border-radius: 15%;
        font-size: 50cqh;
        user-select: none;
    }

    .immutable {
        background-color: var(--immutable-bg-color);
    }

    .viewfinder {
        background-color: var(--viewfinder-bg-color);
    }

    .sameValueSelected {
        box-shadow: var(--box-shadow-size) var(--same-value-selected-color) inset;
        border-color: var(--same-value-selected-color);
    }

    .invalid {
        box-shadow: var(--box-shadow-size) var(--invalid-value-color) inset;
        border-color: var(--invalid-value-color);
    }

    .selected {
        border-color: var(--value-selected-color);
        box-shadow: var(--box-shadow-size) var(--value-selected-color) inset;
    }

    .cell:hover {
        box-shadow: var(--box-shadow-size) var(--value-selected-color) inset;
        cursor: default;
    }

</style>