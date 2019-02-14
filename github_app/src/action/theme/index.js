import Types from '../types';
import ThemeDao from "../../expand/dao/ThemeDao";

/**
 * 主题变更
 * @param theme
 * @returns {{type: string, theme: *}}
 */
export function onThemeChange(theme) {
  return {
    type: Types.THEME_CHANGE,
    theme: theme
  }
}

/**
 * 初始化主题
 * @param theme
 * @returns {Function}
 */
export function onThemeInit(theme) {
  return dispatch => {
    new ThemeDao().getTheme().then((data) => {
      dispatch(onThemeChange(data))
    })
  }
}

/**
 * 显示自定义主题浮层
 * @param show
 * @returns {{type: string, customThemeViewVisible: *}}
 */
export function onShowCustomThemeView(show) {
  return {
    type: Types.SHOW_THEME_VIEW,
    customThemeViewVisible: show
  }
}


