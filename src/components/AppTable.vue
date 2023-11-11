<script setup lang="ts" generic="T extends TableRows, U extends TableColumns<T>"> 

import { ref, watch } from 'vue';
import type { MenuItems } from './AppMenu.vue';
import _ from "lodash"
import { computed } from 'vue';
import AppFilter from './AppFilter.vue';

export type DisplayableTypes = number | string | boolean;
export type GetPath<T> = T extends object ? Path<T> : string;
export type Path<T extends object> = 
{[K in keyof T  & (string | number)]: T[K] extends object 
? `${K}.${Path<T[K]>}` : (T[K] extends DisplayableTypes ? `${K}` : never)
}[keyof T & (string | number)];

export type TableRows = { [key: string]: any }[]

export type TableColumns<E = string> = {
    title: string,
    field: GetKeys<E>
}[];

export type GetKeys<E> = E extends TableRows ? GetPath<E[number]> :
E extends TableRows[number] ? GetPath<E> : E extends string ? E : never;

const props = defineProps<{ 
    columns: U;
    rows: T;
    menu: MenuItems;
}>();


const emit = defineEmits<{
    (event: 'update:rows', payload: any): void;
    (event: 'selected-row', payload: T[number]): void;
    (event: 'deleted-row', payload: T[number]): void;
}>();

const selectedRow = ref();

const tableBodyRef = ref();

watch(selectedRow, (newVal) => {
    emit('selected-row', newVal)
});




const deleteRow = (rowIdx: number) => {
    const rowsModified = props.rows.filter((el, idx) => idx !== rowIdx);
    const rowDeleted = props.rows[rowIdx];
    emit('deleted-row', rowDeleted);
    emit('update:rows', rowsModified);
};


const focusOutHandler = (e: FocusEvent) => {
    if ((tableBodyRef.value as HTMLElement).contains(e.relatedTarget as Node)) return;
    selectedRow.value = null;
};

const focusInHandler = (row: any) => {
    selectedRow.value = row;
}

const sortState = ref<{ 
    readonly field: string; 
    readonly order: 'asc' | 'desc', 
    setSort: (col: string) => void, 
    getSorted: (rows: TableRows) => TableRows 
    }>({
    field: '',
    order: 'asc',
    setSort: function(col: string) {
        (this.order as any) = this.field !== col ? 'asc' : this.order === 'asc' ? 'desc' : 'asc';
        (this.field as any) = this.field === col && this.order === 'asc' ? '' : col;
    },
    getSorted: function(rows: TableRows): TableRows { return this.field ? _.orderBy(rows, [this.field],[this.order]) : rows }
});

const filterState = ref({
    
})



const filterRowsByString = (rows: TableRows): TableRows => {
    if (!filterString.value) return rows;
    const fields = (props as any).columns.map((el: any) => el.field);
    return rows.filter(row => 
        fields.map((field: any) => _.get(row, field))
            .some((cellValue: any) => (cellValue+'')
                .toLowerCase()
                .includes(filterString.value.toLowerCase())
            ) 
    );
}



const sortRows = (rows: TableRows): TableRows => sortState.value.getSorted(rows);

const displayRows = computed(() => { 
    console.log('computedRows'); 
    return _.flow(filterRowsByString, sortRows, filterFunc.value)(props.rows)
})


const filterString = ref('')

const filters = ref()

const filterFunc = ref((rows: any) => rows)

</script>

<template>

<div style="width: 200px;">

<v-text-field
:clearable="true"
min-width="200"
  label="Main input"
  hide-details="auto"
  v-model="filterString"
></v-text-field>

{{ filters }}

</div>

    <div class="m-4 overflow-auto table-wrapper w-100" style="height: 400px;" data-sticky-header v-if="columns && rows">
        <table class="bg-body table table-hover table-responsive">
            <thead>
                <tr>
                    <th class="sticky-top p-0" scope="col" v-for="(col, colIdx) of columns" :key="colIdx">
                        <div class="box-shadow-bottom p-2">
                            {{ (col as any).title }} 
                            <button 
                            @click="sortState.setSort((col as any).field)" 
                            :class="sortState.field === (col as any).field ? 'text-secondary' : 'text-muted'">
                                {{ sortState.field === (col as any).field ? {'asc':'▼', 'desc':'▲'}[sortState.order] : "▼" }}
                            </button>
                            <app-filter :rows="rows" :cols="columns" :col="col" v-model:filters="filters" @filter-func="filterFunc = $event"></app-filter>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody 
            ref="tableBodyRef"
            @focusout="focusOutHandler($event)"
            tabindex="0">
                <tr
                class="bg-on-focus"
                tabindex="0" 
                v-for="(row, rowIdx) of displayRows"
                :key="rowIdx" 
                @focusin="focusInHandler(row)"
                >
                    <td v-for="(col, colIdx) of columns" :key="colIdx" class="p-0 bg-inherit">
                        <div class="px-2 py-1 bg-transparent">
                            {{ _.get(row, (col as any).field, '') }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>


<style lang="css" scoped>

    td {
        vertical-align: middle;
    }
    
    .bg-on-focus:focus {
        background-color: rgba(36, 99, 192, 0.1);
    }
    
    .box-shadow-bottom {
        box-shadow: 0px 3px 0px rgba(148, 148, 148, 0.89);
    }

    .table-wrapper {
        border: 1px solid rgba(128, 128, 128, 0.315)
    }

    .bg-inherit {
        background-color: inherit;
    }

</style>