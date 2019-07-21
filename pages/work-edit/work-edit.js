const app = getApp();
// 引入配置文件config
const urlList = require('../../utils/config.js');
Page({
  data: {
    imageList: [],
    userInfo: {},
    bg: urlList.imagesAllBgUrl,
  },
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  formSubmit(e) {
    var that = this
    var submitData = {}
    if (!app.globalData.backuser || !app.globalData.backuser.id) {
      wx.showModal({
        title: '提示',
        content: '用户登录信息失效，请点按确定后重新登录。',
        showCancel: false,
        success: function (resbtn) {
          if (resbtn.confirm) {
            wx.redirectTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return;
    }
    submitData.userId = app.globalData.backuser.id
    if (e.detail.value.workName == '') {
      wx.showToast({
        title: '作品名必填',
        icon: 'none',
        duration: 1000
      })
      return;
    } else {
      submitData.workName = e.detail.value.workName
    }
    if (e.detail.value.workProfile == '') {
      wx.showToast({
        title: '作品简介必填',
        icon: 'none',
        duration: 1000
      })
      return;
    } else {
      submitData.workProfile = e.detail.value.workProfile
    }
    if (that.data.imageList.length != 1) {
      wx.showToast({
        title: '请上传一张图片',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    console.log(submitData)
    wx.uploadFile({
      url: urlList.collectThumbsUpCreateUrl,
      filePath: that.data.imageList[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: submitData,
      success: function (res) {
        console.log(res);
        var json = JSON.parse(res.data)
        var contentMsg = '上传成功，请点按确定查看集赞活动。'
        if (json.status == "failure" && json.data.errCode == 10002) {
          contentMsg = '您已参加过集赞活动，请点按确定直接查看集赞活动。'
        }
        wx.showModal({
          title: '提示',
          content: contentMsg,
          showCancel: false,
          success: function (resbtn) {
            if (resbtn.confirm) {
              wx.redirectTo({
                url: '/pages/work-list/work-list'
              })
            }
          }
        })
      },
      fail: function (res) {
        console.log(res);
        wx.showToast({
          title: '上传失败',
          icon: '/img/error.jpg',
          duration: 2000
        })
      },
      complete: function (res) {

      }
    })
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },

  chooseImage() {
    const that = this
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      count: 1,
      success(res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage(e) {
    const current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  }
})