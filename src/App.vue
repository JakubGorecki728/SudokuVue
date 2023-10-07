<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import SudokuView from './components/SudokuView.vue'
import { setAppTheme } from './main';
</script>

<template>        
  <div class="d-flex justify-content-center align-items-start" style="height: 100vh;">

      <SudokuView />
      
  </div>
</template>

<style scoped>

</style>
