<script setup lang="ts">
import { sudokuBoard } from '@/stores/sudoku';
import { ref } from 'vue';
import { appTheme } from '@/stores/app-theme';
import type { MenuItems } from './AppMenu.vue';
import AppMenu from './AppMenu.vue';

    const board = sudokuBoard();

    const theme = appTheme();

    const menuItems: MenuItems = [
        { 
            title: 'Next game',
            action: () => { board.nextGame() },
            icon: 'arrow-right-bold'
        },
        { 
            title: 'Previous game',
            action: () => { board.previousGame() },
            icon: 'arrow-left-bold'
        },
        { 
            title: 'Reset game',
            action: () => { board.resetGame() },
            icon: 'replay'
        },
        { 
            title: 'Undo',
            action: () => { board.undo() },
            icon: 'undo'
        },
        { 
            title: () => `Set ${theme.next} theme`,
            action: () => { theme.change() },
            icon: 'theme-light-dark'
        },
    ]

    const menuActivator = ref();


</script>


<template>


    <div class="d-flex" style="gap: 5px">

        <!-- <button class="btn btn-primary" @click="board.resetGame()">Reset game</button>
        <button class="btn btn-primary" @click="board.newGame(0)">Board 0</button>
        <button class="btn btn-primary" @click="board.newGame(1)">Board 1</button>
        <div :class="{ 'text-danger': !board.isValid, 'text-success': board.isValid }">Board is {{ board.isValid ? 'valid' : 'invalid' }}</div>
        <div :class="{ 'text-danger': !board.isFull, 'text-success': board.isFull }">Board is {{ board.isFull ? 'full' : 'not full' }}</div> -->

        <!-- <div style="font-size: small;">
            <label class="label">Possible values: {{ board.possibleValues.length ? board.possibleValues.join(', ') : ' - ' }}</label>
        </div> -->

        <!-- <progress class="w-100 mx-4" max="100" :value="board.percentProgress"></progress> -->


        <v-btn ref="menuActivator" min-width="40" width="40" class="bg-secondary">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        
        <AppMenu :menu-items="menuItems" :activator="menuActivator"></AppMenu>

    </div>
</template>


<style scoped>

progress {
    height: 30px;
}

</style>