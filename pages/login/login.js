//login.js
//获取应用实例
const app = getApp();
// 引入配置文件config
const urlList = require('../../utils/config.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    visible: false,
    bg: urlList.imagesAllBgUrl,
    ignoreTs: 'no',
    isWorkTime: false
  },
  //事件处理函数
  show: function () {
    this.setData({
      visible: true
    })
  },
  close: function () {
    this.setData({
      visible: false
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    var that = this
    app.globalData.userInfo = e.detail.userInfo
    that.setData({
      userInfo: e.detail.userInfo
    })
    wx.login({
      success: function (res) {
        if (res.code && app.globalData.userInfo) {
          var initUserInfo = JSON.parse(JSON.stringify(app.globalData.userInfo));
          initUserInfo.code = res.code;
          console.log(initUserInfo)
          wx.request({
            url: urlList.userValidateWxLoginUrl,
            data: JSON.stringify(initUserInfo),
            method: "post",
            header: {
              "content-type": "application/json"
            },
            success: function (res) {
              var nowTs = Date.parse(new Date())
              console.log(that.data)
              var json = JSON.parse(JSON.stringify(res.data))
              if (json.status == "success") {
                that.setData({
                  hasUserInfo: true,
                  ignoreTs: json.data.ignoreTs,
                  isWorkTime: Boolean(nowTs >= 1567267200000),
                })
                console.log(json)
                app.globalData.backuser = json.data
              } else {
                that.setData({
                  hasUserInfo: false
                })
                wx.showToast({
                  title: '登录失败',
                  image: '/img/error.jpg'
                })
                console.log(json)
              }
            },
            fail: function () {
              wx.showToast({
                title: '授权失败',
                icon: 'loading'
              })
            }
          })
        } else {
          that.setData({
            hasUserInfo: false
          })
          wx.showModal({
            title: '提示',
            content: '微信授权失败，请重新点按“微信授权”。如若继续失败，请检查手机网络是否正常，或通过微信小程序反馈功能提交意见反馈，我们的管理员会尽快为您处理。',
            showCancel: false
          })
        }
      }
    })
  },
  next: function () {
    if (app.globalData.backuser.grade != "" && app.globalData.backuser.grade != null) {
      wx.redirectTo({
        url: '/pages/show/show'
      })
    } else if (app.globalData.backuser.grade == "" || app.globalData.backuser.grade == null) {
      wx.redirectTo({
        url: '/pages/logon/logon'
      })
    }
  },
  viewWorkList: function () {
    wx.redirectTo({
      url: '/pages/work-list/work-list'
    })
  },
})