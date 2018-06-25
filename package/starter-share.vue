<template>
  <div class="starter-share" :class="className" v-if="display">
    <div class="starter-share__transparent" @touchmove="prevent" @click="hide"></div>
    <div class="starter-share__container" @touchmove="prevent">
      <img class="starter-share__img" v-if="src"
        :src="src">
      <div class="starter-share__img" v-else></div>
      <div class="starter-share__btn starter-share__btn--primary"
        @click="saveFile2Album">
        分享到朋友圈
      </div>
      <button open-type="share" class="starter-share__btn">
        分享给朋友
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'starter-share',
  data () {
    return {
      src: '',
      display: true
    }
  },
  props: {
    create: {
      type: Function,
      default () {
        return function () {
          return {
            src: require('../assets/demo.jpg')
          }
        }
      }
    },
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    prevent (event) {
      event.preventDefault()
      return {}
    },
    saveFile2Album () {
      wx.showLoading({
        title: '处理中',
        mask: true
      })
      const path = this.src
      wx.downloadFile({
        url: path,
        success ({tempFilePath: filePath}) {
          wx.saveImageToPhotosAlbum({
            filePath,
            success () {
              wx.showToast({
                title: '二维码已经保存在相册，可以在朋友圈分享啦！',
                icon: 'success'
              })
            },
            fail () {
              wx.showToast({
                title: '请保存二维码，分享至朋友圈',
                icon: 'none'
              })
            }
          })
        },
        fail () {
          wx.showToast({
            title: '请保存二维码，分享至朋友圈',
            icon: 'none'
          })
        }
      })
    },
    hide () {
      this.display = false
    },
    show () {
      this.display = true
    }
  },
  async mounted () {
    console.log(this)
    try {
      const {src} = await this.create()
      this.src = src
    } catch (error) {
      console.warn(error)
      wx.showToast({
        message: '错误！',
        icon: 'warn'
      })
    }
  }
}
</script>
<style>
.starter-share__transparent {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .3);
  z-index: 1000;
}
.starter-share__container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  -webkit-transform: translate3d(-50%, -50%, 0);
  padding: 50rpx 30rpx;
  background-color: #fff;
  border-radius: 30rpx;
  z-index: 1001;
}
.starter-share__img {
  width: 560rpx;
  height: 560rpx;
  background-color: #fff;
}
.starter-share__btn {
  padding: 15rpx;
  margin-top: 20rpx;
  border-radius: 10rpx;
  border: 1rpx solid #a3a3a3;
  background-color: #ededed;
  color: #a3a3a3;
  text-align: center;
  font-size: 14px;
  -webkit-appearance: none;
}

.starter-share__btn::before, .starter-share__btn::after {
  display: none;
}

.starter-share__btn--primary {
  background-color: #7e2020;
  border-color: #7e2020;
  color: #fff;
}
</style>
