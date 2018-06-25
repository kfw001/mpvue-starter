import QS from 'query-string';

/**
 * 获取标题设置内容
 * @param {*} vm vue instance
 */
const getTitle = function (vm) {
  const { title } = vm.$options;
  if (title) {
    return typeof title === 'function' ? title.call(vm) : title;
  }
  return null;
};
/**
 * 设置标题
 * @param {*} vm vue instance
 */
const setTitle = function (vm) {
  const title = getTitle(vm);
  if (title) {
    wx.setNavigationBarTitle({
      title
    });
  }
};

/**
 * 获取分享设置
 * @param {*} vm vue instance
 */
const getShareMessage = function (vm) {
  const { shareMessage } = vm.$options;
  if (shareMessage) {
    return typeof shareMessage === 'function' ? shareMessage.call(vm) : shareMessage;
  }
  return {};
};
/**
 * 用于小程序强制更新
 * 在小程序启动时检测
 */
const appUpgrade = function (appAutoUpdate) {
  if (!appAutoUpdate) {
    return;
  }
  if (wx.getUpdateManager == null) {
    return null;
  }
  // 获取更新上下文
  const updateManager = wx.getUpdateManager();
  // 开始检测更新
  updateManager.onCheckForUpdate(function ({ hasUpdate }) {
    if (!hasUpdate) {
      return;
    }
    wx.showLoading({
      title: '系统更新',
      mask: true
    });
  });
  // 监听更新完成，进行强制更新
  updateManager.onUpdateReady(function () {
    wx.hideLoading();
    updateManager.applyUpdate();
  });
  // 监听更新失败
  updateManager.onUpdateFailed(function () {
    wx.hideLoading();
    wx.showToast({
      title: '更新失败',
      mask: true
    });
  });
  return updateManager;
};

const handleShareAppMessage = function (vm) {
  const { query } = vm.$mp.appOptions;
  const { sharepath } = query;
  if (sharepath == null) {
    return;
  }
  const url = `${sharepath}?${QS.stringify(query)}`;
  setTimeout(() => wx.navigateTo({ url }), 1000);
};

function mixins (Vue, { store, shareData: defaultShareData = {} }) {
  Vue.mixin({
    // 全局混合变量
    // 用于显示页面
    data() {
      return {
        loading: false
      };
    },
    // 页面启动数据预加载
    async mounted() {
      try {
        const { $mp } = this;
        if ($mp == null) {
          return;
        }
        const {
          asyncData = function () {}
        } = this.$options;
        this.loading = false;
        wx.showLoading({
          title: 'Loading',
          mask: true
        });
        const data = await asyncData({
          vm: this,
          store,
          route: $mp
        });
        if (data instanceof Object) {
          Object.keys(data).forEach(key => {
            Vue.set(this, key, data[key]);
          });
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setTitle(this);
        wx.hideLoading();
        this.loading = true;
      }
    },
    async onShow() {
      try {
        const { $mp } = this;
        if ($mp == null) {
          return;
        }
        const {
          updateData = function () {}
        } = this.$options;
        // app显示
        if ($mp.mpType === 'app') {
          // 处理分享信息
          handleShareAppMessage(this);
        }
        const data = await updateData({
          vm: this,
          store,
          route: $mp
        });
        if (data instanceof Object) {
          Object.keys(data).forEach(key => {
            Vue.set(this, key, data[key]);
          });
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setTitle(this);
      }
    }
  });
}

var share = {
  onShareAppMessage() {
    const { $mp } = this;
    if ($mp == null) {
      return;
    }
    const { appOptions, page, query } = $mp;
    const shareData = getShareMessage(this);
    const { path: rootPath } = appOptions;
    const { route } = page;
    const path = `${rootPath}?sharepath=/${route}&${QS.stringify(query)}`;
    return Object.assign({}, {
      path
    }, shareData);
  }
};

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

const install = function (Vue, options) {
  const {
    appAutoUpgrade = true,
    store = {}
  } = options;

  // add wechat miniapp auto upgrade
  appUpgrade(appAutoUpgrade);
  // add global mixin
  mixins(Vue, {
    store
  });
};

var index = {
  install
};

export default index;
export { share as shareMixin };
