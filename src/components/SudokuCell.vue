<script setup lang="ts">
import type { ISudokuCell } from '@/stores/sudoku';
import type { ValueRange } from '@/types/sudoku-types';

    defineProps<{ 
        cell: Readonly<ISudokuCell>
    }>();

    const emit = defineEmits<{
        (event: 'cell-focusin', payload: { row: ValueRange, col: ValueRange }): void;
    }>();
    
</script>


<template>

    <div
    readonly
    class="form-control"
    @click="emit('cell-focusin', { row: cell.row, col: cell.col })"
    :class="{ 
        'cell-immutable': cell.immutable,
        'selected': cell.selected,
        'invalid': !cell.valid,
        'sameValue': cell.sameValueSelected,
        'viewfinder': cell.viewfinder
    }"> {{ cell.value || '' }} </div>


</template>


<style lang="css" scoped>

    .viewfinder {
        background-color: rgb(42, 161, 165) !important;
    }

    .sameValue {
        font-weight: bolder !important; 
        color: yellow !important;
    }

    .invalid {
        color: red !important;
    }

    .selected {
        background-color: rgba(0, 255, 102, 0.3) !important;
        border-color: rgba(0, 255, 102, 0.89) !important;
        box-shadow: 0px 0px 5px rgba(0, 255, 102, 0.89);
    }
    /* .form-control:hover {
        background-color: rgba(0, 255, 102, 0.15);
        border-color: rgba(0, 255, 102, 0.3);
        cursor: default;
    } */

        .form-control:hover {
            border-color: rgba(0, 255, 102, 0.89) !important;
        box-shadow: 0px 0px 5px rgba(0, 255, 102, 0.89);
        cursor: default;
    }
    
    .form-control {
        user-select: none !important;
        background-color: transparent;
        height: 50px;
        font-size: 20px;
        padding: 0;
        aspect-ratio: 1 / 1;
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;

    }
    .form-control:focus {
        background-color: rgba(0, 255, 102, 0.3);
        border-color: rgba(0, 255, 102, 0.89);
        box-shadow: 0px 0px 5px rgba(0, 255, 102, 0.89);
    }
    .cell-immutable {
        background-color: rgba(112, 112, 112, 0.2) !important;
        border-color: rgba(112, 112, 112, 0.3) !important;
    }
    .cell-immutable:focus {
        box-shadow: 0px 0px 5px rgba(112, 112, 112, 0.7) !important;
        border-color: rgba(112, 112, 112, 0.7) !important;
        background-color: rgba(112, 112, 112, 0.4) !important;
    }

    ::selection {
        color: default;
        background: transparent;
    }
    @media (max-width: 360px) {
        .form-control {
        font-size: 12px;
        }
    }
    @media (min-width: 361px) and (max-width: 600px) {
        .form-control {
        font-size: 16px;
        }
    }

</style>