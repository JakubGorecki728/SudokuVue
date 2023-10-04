<script setup lang="ts">
import { ref } from 'vue';
import SudokuCell from './SudokuCell.vue';
import { onMounted } from 'vue';
import { SudokuBoard } from '@/utils/SudokuBoard';
import type { CellStringPos, CellObjPos } from '@/utils/SudokuTypes';

    onMounted(() => {
        createBoard();
    })
    const board = ref<SudokuBoard>()
    const cellRef = ref()
    const createBoard = () => board.value = SudokuBoard.create('easy');
    const innerBorder = (idx: number | string) => ['3', '6'].includes(idx+'');
    
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


    const possibleValues = ref()

    const selectedCell = ref();

    const boardValid = ref(true);

    const viewFinderHandler = (row, col) => (row == selectedCell.value?.position?.row || col == selectedCell.value?.position?.col);

    const sameValueHighlightHandler = (cell) => {
        const slctd = selectedCell.value;
        return slctd?.value !== null && slctd?.value === cell?.value &&
        (slctd?.position?.row !== cell?.position?.row ||
        slctd?.position?.col !== cell?.position?.col);
    }
        

    const cellClickHandler = (pos) => {
        possibleValues.value = board?.value?.getPosibleMoves(pos.row, pos.col);
    }

    const cellValueChangeHandler = () => {
        boardValid.value = board.value?.isBoardValid();
    }
</script>


<template>
    <div>
        <div>
            <div class="d-flex justify-content-center">
                <v-btn class="me-2" @click="board?.solve(); cellValueChangeHandler()" :disabled="!boardValid">Try Solve</v-btn>
                <v-btn class="me-2" @click="createBoard(); cellValueChangeHandler()">New board</v-btn>
                <v-btn @click="board?.restartBoard(); cellValueChangeHandler()">Restart board</v-btn>
            </div>
            <p class="m-2">Possible values: {{ possibleValues }}</p>
            <p class="m-2" :class="boardValid ? 'text-primary' : 'text-danger'">Board {{ boardValid ? 'valid' : 'invalid' }}</p>
        </div>
        <div
        @keydown="switchFocusHandler"
        v-if="board"
        class="border" 
        >
            <div 
            :key="rowIdx"
            v-for="(row, rowIdx) of board.rows" 
            class="d-flex" 
            >
                <div
                ref="cellRef"
                v-for="(cell, cellIdx) of row"
                :key="cellIdx"
                class="p-1 cell-container" 
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
    </div>
    


</template>


<style scoped>
    .border{
        border: 2px solid rgba(128, 128, 128, 0.5) !important;
        border-radius: 5px;
    }
    .border-bottom{
        border-bottom: 2px solid rgba(128, 128, 128, 0.5) !important;
    }
    .border-right{
        border-right: 2px solid rgba(128, 128, 128, 0.5) !important;
    }

    .view-finder {
        background-color: rgba(0, 255, 102, 0.08);
    }

    .same-value-highlight {
        background-color: rgba(255, 238, 0, 0.15) !important;
    }

</style>