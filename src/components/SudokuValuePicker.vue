<script setup lang="ts">
import type { Cell } from '@/utils/SudokuTypes';
import { ref, watch } from 'vue';

const emit = defineEmits(['cell-focusin', 'cell-blur', 'value-change'])

    const props = defineProps<{ cell: Cell }>()

    const selected = ref(false)

    const keyEventHandler = (e: KeyboardEvent) => {
        const oldValue = props.cell?.value
        props.cell.setValue(e)
        if (props.cell?.value !== oldValue) emit('value-change', props.cell)
    }

const ac = ref(false)
    
</script>


<template>

<v-text-field
    style="max-width: 200;"
    class="menu-activator"
    id="menu-activator"
      color="primary"
    >
      ac
    </v-text-field>

    
<v-menu
activator="#menu-activator"
    :open-on-click="false"
    :open-on-focus="true"
  :close-on-content-click="false"
  location="bottom"
>
<v-text-field >text</v-text-field>

  <v-card>
    <v-btn>1</v-btn>
    <v-btn>2</v-btn>
    <v-btn>3</v-btn>
    <br>
    <v-btn>4</v-btn>
    <v-btn>5</v-btn>
    <v-btn>6</v-btn>
    <br>
    <v-btn>7</v-btn>
    <v-btn>8</v-btn>
    <v-btn>9</v-btn>
   
    
  </v-card>
</v-menu>




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