<script setup lang="ts">
import type { Cell } from '@/utils/SudokuTypes';
import { ref, watch } from 'vue';
import _ from "lodash"

const emit = defineEmits(['cell-focusin', 'cell-blur', 'value-change'])

    const props = defineProps<{ cell: Cell }>()

    const selected = ref(false)

    const keyEventHandler = (e: KeyboardEvent) => {
        const oldValue = props.cell?.value
        props.cell.setValue(e);
        if (props.cell?.value !== oldValue) emit('value-change', props.cell)
    }

const inputRef = ref()

const menuModel = ref(false)

const menuOpenHandler = () => {
    if (props.cell.immutable === true) { return; }
    // console.log('touch')
    // inputRef.value.focus();
    menuModel.value = true;
}

const menuCloseHandler = () => {
    // console.log('close')
    // inputRef.value.focus();
    menuModel.value ? menuModel.value = false : ''
    
}
    
</script>


<template>

    <input
    ref="inputRef"
    menu-activator
    v-model="cell.value"
    :id="`${cell.position.row}${cell.position.col}`"
    @focus="selected = true; emit('cell-focusin', cell)"
    @blur="selected = false; emit('cell-blur', null); menuCloseHandler()"
    @keydown="keyEventHandler($event); emit('cell-focusin', cell)"
    @touchstart="menuOpenHandler"
    type="text"
    readonly
    class="form-control"
    :class="{ 
        'cell-immutable': cell.immutable,
        'selected': selected
    }">

    <template v-if="menuModel">
        <v-menu
        :activator="inputRef"
        v-model="menuModel"
        :open-on-hover="false"
        :open-on-focus="false"
        :open-on-click="false"
        :close-on-content-click="true"
        >
            <div> 
                <div v-for="(row, rowIdx) of _.chunk([1,2,3,4,5,6,7,8,9], 3)" 
                :key="rowIdx" 
                class="d-flex mb-1" style="gap: 5px;">
                    <button 
                    class="btn btn-success btn-lg"
                    v-for="(btn, btnIdx) of row" 
                    :key="btnIdx" 
                    @touchstart="cell.value = (btn as any)">
                        {{ btn }}
                    </button>
                </div>
                <button 
                class="btn btn-danger w-100"
                @touchstart="cell.value = null">
                    clear
                </button>
            </div>
        </v-menu>
    </template>


</template>


<style lang="css" scoped>
    .form-control:hover {
        background-color: rgba(0, 255, 102, 0.15);
        border-color: rgba(0, 255, 102, 0.3);
        cursor: default;
    }
    .form-control {
        user-select: none !important;
        text-align: center; 
        background-color: transparent;
        height: 100%;
        font-size: 20px;
        padding: 0;
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