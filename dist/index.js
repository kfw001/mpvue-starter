import QS from 'query-string';

/**
 * 获取标题设置内容
 * @param {*} vm vue instance
 */
var getTitle = function getTitle(vm) {
  var title = vm.$options.title;

  if (title) {
    return typeof title === 'function' ? title.call(vm) : title;
  }
  return null;
};
/**
 * 设置标题
 * @param {*} vm vue instance
 */
var setTitle = function setTitle(vm) {
  var title = getTitle(vm);
  if (title) {
    wx.setNavigationBarTitle({
      title: title
    });
  }
};

/**
 * 获取分享设置
 * @param {*} vm vue instance
 */
var getShareMessage = function getShareMessage(vm) {
  var shareMessage = vm.$options.shareMessage;

  if (shareMessage) {
    return typeof shareMessage === 'function' ? shareMessage.call(vm) : shareMessage;
  }
  return {};
};
/**
 * 用于小程序强制更新
 * 在小程序启动时检测
 */
var appUpgrade = function appUpgrade(appAutoUpdate) {
  if (!appAutoUpdate) {
    return;
  }
  if (wx.getUpdateManager == null) {
    return null;
  }
  // 获取更新上下文
  var updateManager = wx.getUpdateManager();
  // 开始检测更新
  updateManager.onCheckForUpdate(function (_ref) {
    var hasUpdate = _ref.hasUpdate;

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

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var handleShareAppMessage = function handleShareAppMessage(vm) {
  var query = vm.$mp.appOptions.query;
  var sharepath = query.sharepath;

  if (sharepath == null) {
    return;
  }
  var url = sharepath + '?' + QS.stringify(query);
  setTimeout(function () {
    return wx.navigateTo({ url: url });
  }, 1000);
};

function mixins (Vue, _ref) {
  var store = _ref.store,
      _ref$shareData = _ref.shareData;

  Vue.mixin({
    // 全局混合变量
    // 用于显示页面
    data: function data() {
      return {
        loading: false
      };
    },

    // 页面启动数据预加载
    mounted: function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var $mp, _$options$asyncData, asyncData, data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                $mp = this.$mp;

                if (!($mp == null)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return');

              case 4:
                _$options$asyncData = this.$options.asyncData, asyncData = _$options$asyncData === undefined ? function () {} : _$options$asyncData;

                this.loading = false;
                wx.showLoading({
                  title: 'Loading',
                  mask: true
                });
                _context.next = 9;
                return asyncData({
                  vm: this,
                  store: store,
                  route: $mp
                });

              case 9:
                data = _context.sent;

                if (data instanceof Object) {
                  Object.keys(data).forEach(function (key) {
                    Vue.set(_this, key, data[key]);
                  });
                }
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context['catch'](0);

                console.warn(_context.t0);

              case 16:
                _context.prev = 16;

                setTitle(this);
                wx.hideLoading();
                this.loading = true;
                return _context.finish(16);

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 13, 16, 21]]);
      }));

      function mounted() {
        return _ref2.apply(this, arguments);
      }

      return mounted;
    }(),
    onShow: function () {
      var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var $mp, _$options$updateData, updateData, data;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                $mp = this.$mp;

                if (!($mp == null)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return');

              case 4:
                _$options$updateData = this.$options.updateData, updateData = _$options$updateData === undefined ? function () {} : _$options$updateData;
                // app显示

                if ($mp.mpType === 'app') {
                  // 处理分享信息
                  handleShareAppMessage(this);
                }
                _context2.next = 8;
                return updateData({
                  vm: this,
                  store: store,
                  route: $mp
                });

              case 8:
                data = _context2.sent;

                if (data instanceof Object) {
                  Object.keys(data).forEach(function (key) {
                    Vue.set(_this2, key, data[key]);
                  });
                }
                _context2.next = 15;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2['catch'](0);

                console.warn(_context2.t0);

              case 15:
                _context2.prev = 15;

                setTitle(this);
                return _context2.finish(15);

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 12, 15, 18]]);
      }));

      function onShow() {
        return _ref3.apply(this, arguments);
      }

      return onShow;
    }()
  });
}

var share = {
  onShareAppMessage: function onShareAppMessage() {
    var $mp = this.$mp;

    if ($mp == null) {
      return;
    }
    var appOptions = $mp.appOptions,
        page = $mp.page,
        query = $mp.query;

    var shareData = getShareMessage(this);
    var rootPath = appOptions.path;
    var route = page.route;

    var path = rootPath + '?sharepath=/' + route + '&' + QS.stringify(query);
    return Object.assign({}, {
      path: path
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

var install = function install(Vue, options) {
  var _options$appAutoUpgra = options.appAutoUpgrade,
      appAutoUpgrade = _options$appAutoUpgra === undefined ? true : _options$appAutoUpgra,
      _options$store = options.store,
      store = _options$store === undefined ? {} : _options$store;

  // add wechat miniapp auto upgrade

  appUpgrade(appAutoUpgrade);
  // add global mixin
  mixins(Vue, {
    store: store
  });
};

var index = {
  install: install
};

export default index;
export { share as shareMixin };
