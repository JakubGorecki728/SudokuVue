<script setup lang="ts">

import { sudokuBoard } from "@/stores/sudoku";
import _ from "lodash";
const emit = defineEmits<{
    (event: 'value', payload: number | null): void;
}>();

const emitValue = (value: number | null) => {
    emit('value', value);
}

const board = sudokuBoard();

</script>


<template>
            <div 
            @mousedown="$event.preventDefault();"
            class="picker-container"
            > 
                <div v-for="(row, rowIdx) of _.chunk([1,2,3,4,5,6,7,8,9,null], 5)" :key="rowIdx" class="picker-row">
                    <button 
                    class="btn btn-success btn-lg picker-btn"
                    :class="value ? 'btn-success' : 'btn-danger'"
                    v-for="(value, valueIdx) of row" 
                    :key="valueIdx" 
                    @click="board.setValue(value as any)"
                    @mouseup="emitValue(value)">
                        {{ value ?? 'X' }}
                    </button>
                </div>
            </div>
</template>


<style lang="css" scoped>

    .picker-btn {
        max-width: 70px; 
        max-height: 70px; 
        min-width: 20px;
        min-height: 20px;
        aspect-ratio: 1/1;
        padding: 0px;
        width: 70px;
        height: 70px;
        margin: 2px;

    }

    .picker-container, .picker-row {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: stretch;
        justify-content: center;
    }

    @media (orientation: landscape) {
        .picker-container {
            flex-direction: row;
        }
        .picker-row {
            flex-direction: column;
        }
    }

    @media (orientation: portrait) {
        .picker-container {
            flex-direction: column;
        }
        .picker-row {
            flex-direction: row;
        }
    }

</style>