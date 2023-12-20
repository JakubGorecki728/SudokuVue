<template>
    <p>a={{ a }} b={{ b }}</p>
    <button @click="b = 3">Click me</button>
  </template>
  
  <script setup lang="ts">
  import {computed, ref} from 'vue';
  
  const a = ref(1);
  const b = computed({
    get: () => a.value + 1,
    set: (v) => (a.value = v - 1),
  })
  </script>