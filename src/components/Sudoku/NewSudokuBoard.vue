<script setup lang="ts">
import { getDOM } from '@/main';
import NewSudokuCell from './NewSudokuCell.vue';
import { sudokuBoard } from '@/stores/sudoku';
import { onMounted } from 'vue';

    const board = sudokuBoard();
    const innerBorder = (idx: number | string) => ['3', '6'].includes(idx+'');

    onMounted(() => {
        setTimeout(() => {
            getDOM().body.addEventListener('keydown', (e) => {
                keyEventHandler(e);
            });
        });
    });

    const keyEventHandler = (e: KeyboardEvent) => {
        board.setValue(e.key);
        board.changeSelection(e.key);
    }
</script>


<template>


    <div class="d-flex flex-column" style="gap: 5px">

        <button class="btn btn-primary" @click="board.resetGame()">Reset game</button>
        <button class="btn btn-primary" @click="board.newGame(0)">Board 0</button>
        <button class="btn btn-primary" @click="board.newGame(1)">Board 1</button>
        <div :class="{ 'text-danger': !board.isValid, 'text-success': board.isValid }">Board is {{ board.isValid ? 'valid' : 'invalid' }}</div>
        <div :class="{ 'text-danger': !board.isFull, 'text-success': board.isFull }">Board is {{ board.isFull ? 'full' : 'not full' }}</div>
        <div>Possible values: {{ board.possibleValues.length ? board.possibleValues.join(', ') : ' - ' }}</div>
        <div>Percent progress: {{ board.percentProgress }} %</div>
        <progress max="100" :value="board.percentProgress"></progress>


        <div
        v-if="board"
        class="borders d-flex flex-column" 
        style="width: 497px;"
        >
            <div 
            :key="rowIdx"
            v-for="(row, rowIdx) of board.rows" 
            class="d-flex h-100" 
            >
                <div
                v-for="(cell, cellIdx) of row"
                :key="cellIdx"
                class="cell-container d-flex flex-column"
                :class="{ 
                    'border-bottom': innerBorder(cell.row),
                    'border-right': innerBorder(cell.col)
                }">

                    <NewSudokuCell 
                    :cell="(cell as any)" 
                    @cell-focusin="board.setSelection($event)"
                    ></NewSudokuCell>


                </div>
            </div>
        </div>
    </div>



</template>


<style scoped>
    .borders{
        border: 3px solid rgba(128, 128, 128, 0.5) !important;
        border-radius: 5px;
    }

    .border-invalid{
        border: 3px solid rgba(173, 13, 13, 0.5) !important;
        border-radius: 5px;
    }
    .border-bottom{
        border-bottom: 3px solid rgba(128, 128, 128, 0.5) !important;
    }
    .border-right{
        border-right: 3px solid rgba(128, 128, 128, 0.5) !important;
    }

    .view-finder {
        background-color: rgba(0, 255, 102, 0.07);
    }

    .same-value-highlight {
        background-color: rgba(255, 238, 0, 0.15) !important;
    }
    .cell-container {
        padding: 0.4%;
    }

</style>