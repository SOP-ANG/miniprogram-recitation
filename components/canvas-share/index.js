const app = getApp();
// 引入配置文件config
const urlList = require('../../utils/config.js');

function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: resolve,
      fail: reject,
    })
  })
}

function createRpx2px() {
  const {
    windowWidth
  } = wx.getSystemInfoSync()

  return function(rpx) {
    return windowWidth / 750 * rpx
  }
}

const rpx2px = createRpx2px()

function canvasToTempFilePath(option, context) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      ...option,
      success: resolve,
      fail: reject,
    }, context)
  })
}

function saveImageToPhotosAlbum(option) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      ...option,
      success: resolve,
      fail: reject,
    })
  })
}

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer(visible) {
        if (visible && !this.beginDraw) {
          this.draw()
          this.beginDraw = true
        }
      }
    },
    userInfo: {
      type: Object,
      value: false
    }
  },

  data: {
    beginDraw: false,
    isDraw: false,

    canvasWidth: 945,
    canvasHeight: 1350,

    imageFile: '',

    responsiveScale: 1,
  },

  lifetimes: {
    ready() {
      const designWidth = 300
      const designHeight = 482 // 这是在顶部位置定义，底部无tabbar情况下的设计稿高度

      // 以iphone6为设计稿，计算相应的缩放比例
      const {
        windowWidth,
        windowHeight
      } = wx.getSystemInfoSync()
      const responsiveScale =
        windowHeight / ((windowWidth / designWidth) * designHeight)
      if (responsiveScale < 1) {
        this.setData({
          responsiveScale,
        })
      }
    },
  },

  methods: {
    handleClose() {
      this.triggerEvent('close')
    },
    handleSave() {
      var that = this
      const {
        imageFile
      } = this.data

      if (imageFile) {
        saveImageToPhotosAlbum({
          filePath: imageFile,
        }).then(() => {
          wx.showToast({
            icon: 'none',
            title: '分享图片已保存至相册',
            duration: 2000,
          });
          var submitData = {};
          submitData.userId = app.globalData.backuser.id;
          submitData.courseId = app.globalData.content.courseId
          wx.request({
            url: urlList.clockInDoneUrl,
            data: submitData,
            method: "post",
            header: {
              "content-type": "application/json"
            },
            success: function(res) {
              var json = JSON.parse(JSON.stringify(res.data))
              if (json.status == "success") {
                console.log(json)
                app.globalData.backuser.hasClockIn = true
                that.triggerEvent('close')
                if (json.clockInTimes >= 14) {
                  wx.showModal({
                    title: '提示',
                    content: '您的打卡次数已经符合参加下一阶段的“集赞活动”，点按确定后为您呈现“集赞活动说明”。',
                    showCancel: false,
                    success: function (resbtn) {
                      if (resbtn.confirm) {
                        wx.redirectTo({
                          url: '/pages/work/work',
                        })
                      }
                    }
                  })
                } else {
                  wx.redirectTo({
                    url: '/pages/show/show',
                  })
                }
              } else {
                wx.showToast({
                  title: '请求失败！',
                  image: '/img/error.jpg'
                })
              }
            },
            fail: function() {
              wx.showToast({
                title: '提交失败',
                icon: 'loading'
              })
            }
          })
        })
      }
    },
    draw() {
      wx.showLoading()
      const {
        userInfo,
        canvasWidth,
        canvasHeight
      } = this.data
      const {
        avatarUrl,
        nickName
      } = userInfo
      const avatarPromise = getImageInfo(avatarUrl)
      const backgroundPromise = getImageInfo(urlList.imagesShareImgUrl)

      Promise.all([avatarPromise, backgroundPromise])
        .then(([avatar, background]) => {
          const ctx = wx.createCanvasContext('share', this)

          const canvasW = rpx2px(canvasWidth * 2)
          const canvasH = rpx2px(canvasHeight * 2)

          // 绘制背景
          ctx.drawImage(
            background.path,
            0,
            0,
            canvasW,
            canvasH
          )

          // 绘制头像
          const radius = rpx2px(72 * 2)
          const y = rpx2px(160 * 2)
          ctx.drawImage(
            avatar.path,
            canvasW / 2 - radius,
            y - radius,
            radius * 2,
            radius * 2,
          )

          // 绘制宣传语
          var times = app.globalData.backuser.clockInTimes += 1
          var nickName = app.globalData.backuser.nickName
          ctx.setFontSize(48)
          ctx.setTextAlign('center')
          ctx.setFillStyle('#ffffff')
          ctx.fillText(
            nickName + "已成功打卡" + times + "次!",
            canvasW / 2,
            y + rpx2px(168 * 2),
          )
          ctx.stroke()

          ctx.draw(false, () => {
            canvasToTempFilePath({
              canvasId: 'share',
            }, this).then(({
              tempFilePath
            }) => this.setData({
              imageFile: tempFilePath
            }))
          })

          wx.hideLoading()
          this.setData({
            isDraw: true
          })
        })
        .catch(() => {
          this.setData({
            beginDraw: false
          })
          wx.hideLoading()
        })
    }
  }
})