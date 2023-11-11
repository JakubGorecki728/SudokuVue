<script setup lang="ts">
import type { MdiIcon } from '@/types/mdi-icons.type';
import { ref, watch, type ComponentPublicInstance } from 'vue';
import type { TableColumns, TableRows } from './AppTable.vue';
import { computed } from 'vue';
import _ from 'lodash';

  export type Filters = { [key: string]: (number | string | boolean)[] }

  const props = defineProps<{ 
    rows: TableRows;
    cols: TableColumns;
    col: TableColumns[number];
    filters?: Filters;
  }>();
  
  const emit = defineEmits<{
    (event: 'update:filters', payload: Filters): void;
    (event: 'filter-func', payload: ((rows: any) => any)): void;

  }>();

  const defaultActivator = ref();

  const menuModel = ref()
  watch(menuModel,(newW) => {
    if (!newW) {
      menuCloseEvent()
    } else { menuOpenEvent() }
  })

  const menuOpenEvent = () => {
    // selected.value = !props.filters ? values.value : props.filters[props.col.field];
  }

  const menuCloseEvent = () => {
    setFilters()
  }



  const values = computed(() => _.flow(_.uniq, _.sortBy)(props.rows.map(el => _.get(el, props.col.field))))

  const selected = ref([])
  watch(selected, (nv) => {
    if (!selected.value.length) { all.value = false; indeterminate.value = false }
    else if (selected.value.length === values.value.length) { all.value = true; indeterminate.value = false }
    else { indeterminate.value = true }
  })

  const setFilters = () => {
    const filterObj = Object.fromEntries(props.cols.map(el => 
      [el.field, _.flow(_.uniq, _.sortBy)(props.rows.filter(z => 
        selected.value.some( q => q === _.get(z, props.col.field))
      ).map(x => _.get(x, el.field))) ]
    ));
    // emit('update:filters', filterObj);
    emit('filter-func', (rows) => {

      return rows.filter(z => 
        selected.value.some( q => q === _.get(z, props.col.field)))
    });
  }


  //vmodel for every filter
  //on checkbox change every filter comp modifies this object, whitch is stored in table component and used to filter by external func,
  //on filter menu open, filter modifies self state due to this object
  const filterObject = {
    id: [1, 2, 3],
    name: ['example1', 'example2'],
    value: [21, 23, 32],
    "subItem.id": [1, 2, 3]
  }

  const indeterminate = ref(false)

  const all = ref();

</script>

<template>

<button ref="defaultActivator" class="text-warning px-2">Y</button> 

  <v-menu
  v-model="menuModel"
  :location="'bottom'"
  :activator="defaultActivator"
  :close-on-content-click="false"
  >
    <div class="d-flex card elevation-3 rounded-0 flex-column px-2 py-1 align-items-stretch" style="min-width: 100px;">
      <!-- <div class="form-check bg-body">
        <label class="form-check-label w-100" for="indeterminate"> ALL </label>
        <input class="form-check-input" type="checkbox" id="indeterminate">
      </div>
      <div class="form-check bg-body" v-for="(val, idx) of values" :key="idx">
        <label class="form-check-label w-100" :for="col.field+idx"> {{ val }} </label>
        <input class="form-check-input" oninput="console.log(val)" type="checkbox" :id="col.field+idx">
      </div> -->
      <v-checkbox
      :indeterminate="indeterminate"
      :density="'compact'"
      v-model="all"
      v-on:update:model-value="$event ? selected = values : selected = []; console.log('all event')"
      label=""
      :hide-details="true"
    ></v-checkbox>
      <v-checkbox
      class="w-100 h-100"
      v-for="(val, idx) of values" :key="idx"
      :density="'compact'"
      v-model="selected"
      :label="val+''"
      :value="val"
      :hide-details="true"
    ></v-checkbox>
    </div>


  </v-menu>

</template>


<style lang="css" scoped>
  
</style>