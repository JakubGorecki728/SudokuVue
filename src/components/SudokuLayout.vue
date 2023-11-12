<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import SudokuValuePicker from './SudokuValuePicker.vue';
import SudokuView from './SudokuView.vue';
import TestComponent from './TestComponent.vue';
import NewSudokuBoard from './Sudoku/NewSudokuBoard.vue';

const counter = useCounterStore();

</script>

<template>

    <!-- <TestComponent/> -->

    <div id="main-container">
        <div id="head-container">
            <h1>HEADER CONTENT</h1>

        </div>
        <div id="body-container">
            <div id="board-container">


                <div class="board" style="aspect-ratio: 1 / 1 auto;">
                    <!-- <SudokuView ></SudokuView> -->
                    <NewSudokuBoard></NewSudokuBoard>
                </div>

            </div>
            <div id="picker-container">
                <SudokuValuePicker @value="console.log($event)"/>
            </div>
        </div>

    </div>

    <!-- <SudokuView /> -->
</template>


<style lang="css" scoped>

    /* [popover] {
        inset: unset;
        top: anchor(top);
        background-color: red;
    } */

    #modal {
        background-color: rgba(0, 0, 0, 0.185);
        border: none;
        text-align: center;
        justify-content: center;
        align-items: center;
        width: 50vw;
        height: 100vh;
        vertical-align: middle;
    }

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
        height: 100vh;
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