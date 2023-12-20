<script setup lang="ts">
import SudokuValuePicker from './SudokuValuePicker.vue';
import SudokuBoard from './SudokuBoard.vue';
import SudokuMenu from './SudokuMenu.vue';
import { sudokuBoard } from '@/stores/sudoku';
import ComputedTest from './ComputedTest.vue';

const board = sudokuBoard();

</script>

<template>

    <div 
    id="main-container" 
    @keydown="board.setValue($event.key); board.changeSelection($event.key)"
    @keypress="$event.key === '\u001a' ? board.undo() : ''" 
    tabindex="1" 
    style="outline: none"
    >
        <div id="head-container" class="d-flex justify-content-between w-100">
            <div style="font-size: small;">
            <label class="label h4">Possible values: {{ board.possibleValues.length ? board.possibleValues.join(', ') : ' - ' }}</label>
            </div>
            <SudokuMenu/>
            
        </div>

        <div id="body-container">
            <div id="board-container">
                <div class="board" style="aspect-ratio: 1 / 1 auto;">
                    <SudokuBoard/>
                    <!-- <ComputedTest/> -->
                </div>
            </div>
            <div id="picker-container">
                <SudokuValuePicker/>
            </div>
        </div>

    </div>

</template>


<style lang="css" scoped>

    .board {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @container board-container (orientation: landscape) {
        .board {
            height: 100%;
            max-height: 100%;
        }
    }

    @container board-container (orientation: portrait) {
        .board {
            width: 100%;
            max-width: 100%;
        }
    }

    @media (orientation: landscape) {
        #body-container {
            flex-direction: row;
        }
    }

    @media (orientation: portrait) {
        #body-container {
            flex-direction: column;
        }
    }

    #main-container {
        width: 100vw;
        height: 100svh;
        display: flex;
        flex-direction: column;
    }

    #board-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        container-type: size;
        container-name: board-container;
    }

    #body-container {
        display: flex;
        align-items: stretch;
        height: 100%;
        width: 100%;
    }

</style>