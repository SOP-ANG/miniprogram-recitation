//app.js
const Promise = require('utils/promise.js');
// 引入配置文件config
const urlList = require('utils/config.js');
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //登录，获取token
  getToken: function() {
    console.log("jinlaile")
    let _this = this;
    return new Promise(function(resolve, reject) {
      wx.login({
        success: function(res) {
          if (res.code && _this.globalData.userInfo) {
            var initUserInfo = JSON.parse(JSON.stringify(_this.globalData.userInfo));
            initUserInfo.code = res.code;
            console.log(initUserInfo)
            wx.request({
              url: urlList.userValidateWxLoginUrl,
              data: JSON.stringify(initUserInfo),
              method: "post",
              header: {
                "content-type": "application/json"
              },
              success: function(res) {
                console.log(res)
                var json = JSON.parse(JSON.stringify(res.data))
                if (json.status == "success") {
                  console.log(json)
                  _this.globalData.backuser = json.data
                }
                wx.setStorageSync('token', res.data);
                resolve(res);
              }
            })
          } else {
            reject('error');
          }
        }
      })
    })
  },

  globalData: {
    userInfo: null,
    backuser: {},
    content: null,
    objectArray: null,
  }
})