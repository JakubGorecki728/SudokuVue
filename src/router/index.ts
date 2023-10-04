import { createRouter, createWebHistory } from 'vue-router'
import Sudoku from '../components/Sudoku.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/sudoku",
      name: "Sudoku",
      component: Sudoku
    }
  ]
})

export default router
