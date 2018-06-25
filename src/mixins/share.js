import QS from 'query-string'
import {getShareMessage} from '../utils/index'

export default {
  onShareAppMessage () {
    const {$mp} = this
    if ($mp == null) {
      return
    }
    const {appOptions, page, query} = $mp
    const shareData = getShareMessage(this)
    const {path: rootPath} = appOptions
    const {route} = page
    const path = `${rootPath}?sharepath=/${route}&${QS.stringify(query)}`
    return Object.assign({}, {
      path
    }, shareData)
  }
}
