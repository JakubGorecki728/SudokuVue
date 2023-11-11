<script setup lang="ts">
import { ref } from 'vue';
import type { MenuItems } from './AppMenu.vue';
import type { TableColumns } from './AppTable.vue';
import AppTable from './AppTable.vue';
import { GET } from '@/types/playground.types';
import { watch } from 'vue';
import _ from 'lodash';


type Row = { id: number, name: string, value: string, subItem: { id: number, name: string }}

const rows = [
    { id: 1, name: 'example1', value: '21', subItem: { id: 1, name: 'sub1' } },
    { id: 2, name: 'example2', value: '21', subItem: { id: 2, name: 'sub2' } },
    { id: 3, name: 'example3', value: '23', subItem: { id: 3, name: 'sub3' } },
    { id: 4, name: 'example4', value: '32', subItem: { id: 4, name: 'sub4' } },
    { id: 5, name: 'example5', value: '34', subItem: { id: 5, name: 'sub5' } },
    { id: 6, name: 'example6', value: '54', subItem: { id: 6, name: 'sub6' } },
    { id: 7, name: 'example7', value: '567', subItem: { id: 7, name: 'sub7' } },
    { id: 8, name: 'example8', value: '75', subItem: { id: 8, name: 'sub8' } },
    { id: 9, name: 'example9', value: '1234', subItem: { id: 9, name: 'sub9' } },
    { id: 10, name: 'example10', value: '214', subItem: { id: 10, name: 'sub10' } },
]

// const cols: TableColumns<keyof (typeof rows)[number]> = [
const cols: TableColumns<typeof rows> = [
    { title: 'ID', field: 'id' },
    { title: 'NAMEEEEEEEE', field: 'name' },
    { title: 'Value', field: 'value' },
    { title: 'Sub item', field: 'subItem.id' }
]


const menuItems: MenuItems = [
        { 
            title: 'New row',
            action: () => { console.log('new row') },
            icon: 'plus-box'
        },
        { 
            title: 'Delete row',
            action: () => { console.log('delete row') },
            icon: 'replay'
        },
        { 
            title: 'Edit row',
            action: () => { console.log('edit row') },
            icon: 'auto-fix'
        }
    ]

const rowsRef = ref(rows)

const addExampleRows = () => {
    const newItems = Array.from({ length: 10 }, () => (
        { id: 123, name: 'example', value: '123', subItem: { id: 1, name: '12' } }
    ));
    newItems.forEach((el) => { rowsRef.value.push(el) });
}


const test = GET(`https://www.mypage.pl/main/{item}`, { queries: { param3: undefined, param4: 123 }, path: { item: 1 }})

const test2 = () => console.log(new URLSearchParams({
    string: null,
    string2: 21
} as any).toString())





const testCurry = (a: string, b: string, c: string) => {
    return `${a} ${b} ${c}`
}


const curry = (func: (...args: any[]) => any) => {
    return func.length
}

const curriedTestCurry = _.curry(testCurry);
const customCurriedTestCurry = curry(testCurry);
console.log(curriedTestCurry('first', 'second')('third'))
// console.log(customCurriedTestCurry('first')('second')('third')('fourth'))
console.log(curry((a, b, c) => { return a+b+c+d }))


// watch(filterString, (newVal) => {
//     console.log(newVal)
// });


</script>

<template>
    <app-table
    :menu="menuItems"
    :columns="cols"
    v-model:rows="rowsRef"
    @selected-row="console.log($event)"
    />

    <!-- <v-input v-model="filterString" class="form-control">INPUT</v-input> -->

    <v-btn @click="addExampleRows()">add row</v-btn>
    <v-btn @click="test()">GET URL TEST</v-btn>
</template>