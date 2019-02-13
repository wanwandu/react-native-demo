import Types from '../types'
import {_projectModels, handleData} from '../ActionUtil'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import ProjectModel from '../../model/ProjectModel'
import LanguageDao from '../../expand/dao/LanguageDao'

// 加载标签
export function onLoadLanguage (flagKey) {
  return async dispatch => {
    try {
      let languages = await new LanguageDao(flagKey).fetch();
      dispatch({type: Types.LANGUAGE_LOAD_SUCCESS, languages: languages, flag: flagKey})
    } catch (e) {
      console.log(e)
    }

  }

}


