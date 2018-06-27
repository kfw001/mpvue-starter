/**
 * 获取标题设置内容
 * @param {*} vm vue instance
 */
const getTitle = function (vm) {
  const { title } = vm.$options
  if (title) {
    return typeof title === 'function'
      ? title.call(vm)
      : title
  }
  return null
}
/**
 * 设置标题
 * @param {*} vm vue instance
 */
export const setTitle = function (vm) {
  const { title } = getTitle(vm)
  if (title) {
    wx.setNavigationBarTitle({
      title
    })
  }
}

/**
 * 获取分享设置
 * @param {*} vm vue instance
 */
export const getShareMessage = function (vm) {
  const {shareMessage} = vm.$options
  if (shareMessage) {
    return typeof shareMessage === 'function'
      ? shareMessage.call(vm)
      : shareMessage
  }
  return {}
}
/**
 * 用于小程序强制更新
 * 在小程序启动时检测
 */
export const appUpgrade = function (appAutoUpdate) {
  if (!appAutoUpdate) {
    return
  }
  if (wx.getUpdateManager == null) {
    return null
  }
  // 获取更新上下文
  const updateManager = wx.getUpdateManager()
  // 开始检测更新
  updateManager.onCheckForUpdate(function ({hasUpdate}) {
    if (!hasUpdate) {
      return
    }
    wx.showLoading({
      title: '系统更新',
      mask: true
    })
  })
  // 监听更新完成，进行强制更新
  updateManager.onUpdateReady(function () {
    wx.hideLoading()
    updateManager.applyUpdate()
  })
  // 监听更新失败
  updateManager.onUpdateFailed(function () {
    wx.hideLoading()
    wx.showToast({
      title: '更新失败',
      mask: true
    })
  })
  return updateManager
}
