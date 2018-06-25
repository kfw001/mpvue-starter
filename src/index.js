/*!
 * mpvue-mate
 * 提供全局页面组件数据请求钩子 asyncData
 * 提供全局页面组件数据更新请求钩子 updateData
 * 提供全局组件mpvue-toast用于分享小程序码生成保存
 * 提供全局解析分享路由钩子以及分享数据设置钩子shareMessage
 * @time: 2018年06月25日13:46:31
 * @author: helloLaoYang(aaron@codonas.cn)
 * @version: 0.0.1
 */
import mixins from './mixins/index'
import {appUpgrade} from './utils/index'
export {default as shareMixin} from './mixins/share'

const install = function (Vue, options) {
  const {
    appAutoUpgrade = true,
    store = {}
  } = options

  // add wechat miniapp auto upgrade
  appUpgrade(appAutoUpgrade)
  // add global mixin
  mixins(Vue, {
    store
  })
}

export default {
  install
}
