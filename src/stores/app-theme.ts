import { getDOM } from "@/main";
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getEnumKeys } from "@/utils/enum-utils";

enum Theme { 
    'light', 
    'dark'
}

export const appTheme = defineStore('app-theme', () => {
  const _current = ref<keyof typeof Theme | null>(null);
  const next = computed(() => !_current.value || _current.value === 'light' ? 'dark' : 'light');
  const current = computed(() => _current.value)

  const getCurrentTheme = <T extends keyof typeof Theme>(): T | null => {
    const curr = getDOM().documentElement.getAttribute('data-bs-theme');
    const allThemes = getEnumKeys(Theme);
    return (!curr ? null : allThemes.includes(curr) ? curr : null) as T;
  };

  const change = () => {
    _current.value = getCurrentTheme();
    getDOM().documentElement.setAttribute('data-bs-theme', next.value);
    _current.value = next.value;
  };

  setTimeout(() => {
    _current.value = getCurrentTheme();
  });
  
  return { current, next, change, _current }
})

