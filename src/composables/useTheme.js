import { readonly, ref } from 'vue'

const THEME_STORAGE_KEY = 'course-task-board.theme.v1'

export function useTheme(getStorage, rootElement) {
  const theme = ref('light')
  const themeError = ref('')

  try {
    const saved = getStorage().getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') theme.value = saved
  } catch {
    themeError.value = '无法读取主题偏好，已使用浅色。仍可切换主题。'
  }

  function applyTheme() {
    rootElement.classList.toggle('dark', theme.value === 'dark')
  }

  // 在 setup 中同步恢复；启动不写入，以已有的合法选择为准。
  applyTheme()

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
    try {
      getStorage().setItem(THEME_STORAGE_KEY, theme.value)
      themeError.value = ''
    } catch {
      themeError.value = '主题已切换，但无法记住选择，刷新后可能恢复原主题。'
    }
  }

  return { theme: readonly(theme), themeError: readonly(themeError), toggleTheme }
}
