import QS from 'query-string'
import {setTitle} from '../utils/index'

const handleShareAppMessage = function (vm) {
  const {query} = vm.$mp.appOptions
  const {sharepath} = query
  if (sharepath == null) {
    return
  }
  const url = `${sharepath}?${QS.stringify(query)}`
  setTimeout(() => wx.navigateTo({url}), 1000)
}

export default function (Vue, {store, shareData: defaultShareData = {}}) {
  Vue.mixin({
    // 全局混合变量
    // 用于显示页面
    data () {
      return {
        loading: false
      }
    },
    // 页面启动数据预加载
    async mounted () {
      try {
        const {$mp} = this
        if ($mp == null) {
          return
        }
        const {
          asyncData = function () {}
        } = this.$options
        this.loading = false
        wx.showLoading({
          title: 'Loading',
          mask: true
        })
        const data = await asyncData({
          vm: this,
          store,
          route: $mp
        })
        if (data instanceof Object) {
          Object.keys(data).forEach(key => {
            Vue.set(this, key, data[key])
          })
        }
      } catch (e) {
      } finally {
        setTitle(this)
        wx.hideLoading()
        this.loading = true
      }
    },
    async onShow () {
      try {
        const {$mp} = this
        if ($mp == null) {
          return
        }
        const {
          updateData = function () {}
        } = this.$options
        // app显示
        if ($mp.mpType === 'app') {
          // 处理分享信息
          handleShareAppMessage(this)
        }
        const data = await updateData({
          vm: this,
          store,
          route: $mp
        })
        if (data instanceof Object) {
          Object.keys(data).forEach(key => {
            Vue.set(this, key, data[key])
          })
        }
      } catch (e) {
        console.warn(e)
      } finally {
        setTitle(this)
      }
    }
  })
}
