<script setup lang="ts">
import { ref } from 'vue';
import SudokuCell from './SudokuCell.vue';
import { onMounted } from 'vue';
import { SudokuBoard } from '@/utils/SudokuBoard';
import type { CellStringPos, CellObjPos, Cell } from '@/utils/SudokuTypes';
import _ from "lodash"
import type { MenuItems } from './CustomMenu.vue';
import CustomMenu from './CustomMenu.vue';
import type { MdiIcon } from '@/utils/mdi-icons.type';
import { useCounterStore } from '@/stores/counter';
import { appTheme } from '@/stores/app-theme';

    onMounted(() => {
        createBoard();
    })
    const board = ref<SudokuBoard>()
    const cellRef = ref()
    const createBoard = () => board.value = SudokuBoard.create('easy');
    const innerBorder = (idx: number | string) => ['3', '6'].includes(idx+'');
    const possibleValues = ref()
    const selectedCell = ref();
    const boardValid = ref(true);

    const theme = appTheme()


    
    const switchFocusHandler = (e: KeyboardEvent) => {
        const key = e.key;
        const dir = {
            up: ['ArrowUp', 'W', 'w'],
            left: ['ArrowLeft', 'A', 'a'],
            down: ['ArrowDown', 'S', 's'],
            right: ['ArrowRight', 'D', 'd']
        }
        if (!Object.values(dir).flat().includes(key)) { return; }
        const cells = (cellRef.value as HTMLElement[]).map(el => el.querySelector('input')) as HTMLInputElement[];
        const currentSelection = cells.find(el => el?.classList?.contains('selected'));

        if (!currentSelection) { return; }
        const convPosition = (pos: CellStringPos) => ({ row: parseInt(pos[0]), col: parseInt(pos[1]) }) as CellObjPos;
        const pos = convPosition((currentSelection as any).id);
        dir.up.includes(key) ? pos.row > 1 ? pos.row-- : pos.row = 9 :
        dir.left.includes(key) ? pos.col > 1 ? pos.col-- : pos.col = 9 :
        dir.down.includes(key) ? pos.row < 9 ? pos.row++ : pos.row = 1 :
        dir.right.includes(key) ? pos.col < 9 ? pos.col++ : pos.col = 1 : '';
        const newSelection = cells.find(el => el.id === `${pos.row}${pos.col}`);
        newSelection?.focus();
    }

    const viewFinderHandler = (row: number, col: number) => (row == selectedCell.value?.position?.row || col == selectedCell.value?.position?.col);

    const sameValueHighlightHandler = (cell: Cell) => {
        const slctd = selectedCell.value;
        return slctd?.value !== null && slctd?.value === cell?.value &&
        (slctd?.position?.row !== cell?.position?.row ||
        slctd?.position?.col !== cell?.position?.col);
    }
        

    const cellClickHandler = (pos: { row: any; col: any; }) => {
        possibleValues.value = board?.value?.getPosibleMoves(pos.row, pos.col);
    }

    const cellValueChangeHandler = () => {
        boardValid.value = board.value?.isBoardValid() ?? true;
    }

    const menuItems: MenuItems = [
        { 
            title: 'New board',
            action: () => { createBoard(); cellValueChangeHandler() },
            icon: 'plus-box'
        },
        { 
            title: 'Reset board',
            action: () => { board?.value?.restartBoard(); cellValueChangeHandler() },
            icon: 'replay'
        },
        { 
            title: 'Try Solve',
            action: () => { board?.value?.solve(); cellValueChangeHandler() },
            icon: 'auto-fix'
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
    <div class="container" style="aspect-ratio: 1 / 1; min-width: 200px; max-width: 600px;">
        <div>
            <div class="d-flex justify-content-center py-3 test-css" style="gap: 10px">

                <v-btn ref="menuActivator" min-width="40" width="40" class="bg-secondary">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>

                
                <CustomMenu :menu-items="menuItems" :activator="menuActivator"></CustomMenu>
            </div>
            <p class="m-2">Possible values: {{ possibleValues }}</p>
            <p class="m-2" :class="boardValid ? 'text-primary' : 'text-danger'">Board {{ boardValid ? 'valid' : 'invalid' }}</p>
        </div>
        <div
        @keydown="switchFocusHandler"
        v-if="board"
        class="border d-flex flex-column h-100" 
        >
            <div 
            :key="rowIdx"
            v-for="(row, rowIdx) of board.rows" 
            class="d-flex h-100" 
            >
                <div
                ref="cellRef"
                v-for="(cell, cellIdx) of row"
                :key="cellIdx"
                class="cell-container d-flex flex-column" 
                :class="{ 
                    'border-bottom': innerBorder(rowIdx),
                    'border-right': innerBorder(cellIdx),
                    'view-finder': viewFinderHandler(rowIdx, cellIdx),
                    'same-value-highlight': sameValueHighlightHandler(cell)
                }">
                    <SudokuCell 
                    :cell="cell" 
                    @value-change="cellValueChangeHandler()"
                    @cell-blur="selectedCell = null"
                    @cell-focusin="cellClickHandler($event.position); selectedCell = $event"
                    />
                </div>
            </div>
        </div>

        <!-- <template v-if="true">
            <div @mousedown="$event.preventDefault();"> 
                <div v-for="(row, rowIdx) of _.chunk([1,2,3,4,5,6,7,8,9], 3)" 
                :key="rowIdx" 
                class="d-flex mb-1" style="gap: 5px;">
                    <button 
                    :disabled="!selectedCell"
                    class="btn btn-success btn-lg"
                    v-for="(btn, btnIdx) of row" 
                    :key="btnIdx" 
                    @mouseup="selectedCell.setValue(btn as any)">
                        {{ btn }}
                    </button>
                </div>
                <button
                :disabled="!selectedCell"
                class="btn btn-danger w-100"
                @mouseup="selectedCell.setValue(null)">
                    clear
                </button>
            </div>
        </template> -->

        <template v-if="true">
            <div 
            @mousedown="$event.preventDefault();"
            class="d-flex justify-content-between pt-4"
            > 
                <button 
                    style="min-width: 1px; padding: 0px; aspect-ratio: 1/1;"
                    :disabled="!selectedCell"
                    class="btn btn-success btn-lg w-100 me-1"
                    v-for="(btn, btnIdx) of [1,2,3,4,5,6,7,8,9]" 
                    :key="btnIdx" 
                    @mouseup="selectedCell.setValue(btn as any)">
                        {{ btn }}
                    </button>
                <button
                :disabled="!selectedCell"
                class="btn btn-danger btn-lg"
                @mouseup="selectedCell.setValue(null)">
                    clear
                </button>
            </div>
        </template>
    </div>

</template>


<style scoped>
    .border{
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

    /* .test-css{
            background-color: green;
        }

    @media (max-aspect-ratio: 1/1) {
        .test-css{
            background-color: red !important;
            display: none !important;
        }
    } */

</style>