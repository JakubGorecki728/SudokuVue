<script setup lang="ts">
import type { MdiIcon } from '@/types/mdi-icons';
import { ref, watch, type ComponentPublicInstance } from 'vue';

  type MenuItem = {
        title: string | (() => string),
        action: () => void,
        icon?: MdiIcon | (() => MdiIcon)
    }
  export type MenuItems = MenuItem[];

  defineProps<{ 
    menuItems: MenuItems, 
    activator?: ComponentPublicInstance<HTMLElement> 
  }>();

  
  const defaultActivator = ref();

</script>

<template>

  <template v-if="!activator">
    <v-btn
    ref="defaultActivator"
    width="40"
    min-width="40"
    class="bg-primary"
    color="grey"
    >
      <v-icon icon="mdi-menu" />
    </v-btn>
  </template>

  <v-menu
  :location="'bottom'"
  :activator="activator ?? defaultActivator"
  >
    <div class="d-flex card elevation-3 rounded-0 flex-column">
      <button 
      class="btn rounded-0 border border-dark d-flex"
      v-for="(item, idx) of menuItems" 
      :key="idx" 
      @click="item.action()">
        <v-icon v-if="item?.icon" class="pe-3">
          mdi-{{ typeof item.icon === 'function' ? item.icon() : item.icon }}
        </v-icon>
        <div class="w-100">{{ typeof item.title === 'function' ? item.title() : item.title }}</div>
      </button>
    </div>
  </v-menu>

</template>


<style lang="css" scoped>
  
</style>@/types/mdi-icons