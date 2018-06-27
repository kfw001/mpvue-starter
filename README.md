# mpvue-starter

微信小程序开发规范化插件 for mpvue

<!-- TOC -->

- [mpvue-starter](#mpvue-starter)
- [1. 安装](#1-安装)
- [2. 快速使用](#2-快速使用)
- [3. 组件钩子](#3-组件钩子)
- [4. 混合](#4-混合)
- [组件](#组件)

<!-- /TOC -->

# 1. 安装

```bash
npm install --save mpvue-starter
```

# 2. 快速使用

``` javascript
import Vue from 'vue'
import store from './store'
import MpvueStarter from 'mpvue-starter'

Vue.use(MpvueStarter, {
  store,
  
  appAutoUpgrade: true
})

```
- arguments

参数 | 类型 | 默认值 | 说明
--- | --- | --- | ---
store | Object | {} | 将在asyncData,updateData的钩子中被使用
appAutoUpgrade | Boolean| true | 是否开启微信小程序强制更新重启

# 3. 组件钩子


1. asyncData

> 在页面组件加载时被调用，返回一个对象或者Promise结果（对象），返回的数据直接挂载到当前组件

```javascript
// 返回数据
export default {
  asyncData ({store, route, vm}) {
    return {
      nickname: 'Hello'
    }
  }
}

// 返回Promise对象
export default {
  async asyncData ({store, route, vm}) {
    const {avatar, nickname} = await store.dispatch('user/info')
    return {
      nickname,
      avatar
    }
  }
}

```

* 在页面组件中含有loading字段，默认为`false`，在asyncData执行完成之后loading改变为`true`，用于在数据在加载完成后渲染页面时使用。

- arguments

参数 | 类型  | 说明
--- | --- | --- 
store | Object  | 插件注册时传入的对象
route | Object  | 页面/程序启动参数
vm | Object  | 当前页面实例

2. updateData

> 在页面组件显示时被调用，返回一个对象或者Promise结果（对象），返回的数据直接挂载到当前组件

```javascript
// 返回数据
export default {
  updateData ({store, route, vm}) {
    return {
      nickname: 'Hello'
    }
  }
}

// 返回Promise对象
export default {
  async updateData ({store, route, vm}) {
    const {avatar, nickname} = await store.dispatch('user/info')
    return {
      nickname,
      avatar
    }
  }
}

```

- arguments

参数 | 类型  | 说明
--- | --- | --- 
store | Object  | 插件注册时传入的对象
route | Object  | 页面/程序启动参数
vm | Object  | 当前页面实例

3. shareMessage [function, Object]

> 在页面分享功能被唤醒时调用，返回一个对象用于设置分享内容

```javascript
// 返回数据
import {shareMixin} from 'mpvue-starter'

// 样例1
export default {
  mixins: [shareMixin],
  shareMessage: {
    title: '分享标题'
  }
}

// 样例2
export default {
  shareMessage () {
    const {title} = this.detail
    return {
      title
    }
  }
}

```

4. title [function, Object]

> 用于设置页面标题，在asyncData或updateData钩子被调用后执行

```javascript
// 样例1
export default {
  title: {
    title: '标题'
  }
}

// 样例2
export default {
  title () {
    const {title} = this.detail
    return {
      title
    }
  }
}

```

# 4. 混合

1. shareMixin

> 用于开启页面分享功能，`shareMessage`才能生效

* 默认分享当前页面，请使用`shareMessage`设置分享路径

* 默认无标题，请使用`shareMessage`设置分享标题

* 默认图片为页面截图，请使用`shareMessage`设置分享图片

# 组件

1. starter-share

> 分享进阶操作，添加分享到朋友圈功能

```javascript
// javascript

import SatrterShare from 'mpvue-starter/package/starter-share.vue'

export default {
  components: {
    StarterShare
  },
  methods: {
    async getQRimg () {
      const {qrurl} = await fetch('get qrimg api')
      return {src: qrurl}
    },
    showShareToast () {
      this.$refs.starter.show()
    }
  }
}

// template

<starter-share :create="getQRimg" ref="starter"></starter-share>

```