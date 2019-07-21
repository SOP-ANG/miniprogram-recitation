const app = getApp();
// 引入配置文件config
const urlList = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectArray: [],
    bg: urlList.imagesAllBgUrl,
    rootUrl: urlList.rootUrl,
    currentUser: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var submitData = {};
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
    that.setData({
      currentUser: app.globalData.backuser
    })
    console.log(submitData);
    wx.request({
      url: urlList.collectThumbsUpGetListUrl,
      data: JSON.stringify(submitData),
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        console.log(res)
        for (var i = 0; i < res.data.data.length; i++) {
          var workNameDisplay = res.data.data[i].workName
          if (workNameDisplay.length > 10) {
            workNameDisplay = workNameDisplay.substring(0, 10) + "..."
          }
          res.data.data[i].workNameDisplay = workNameDisplay
        }
        app.globalData.objectArray = res.data.data
        that.setData({
          objectArray:app.globalData.objectArray
        })
      },
      fail: function (res) {
        console.log(res);
        wx.showToast({
          title: '列表加载失败，请退出重试',
          icon: '/img/error.jpg',
          duration: 2000
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  giveThumbsUp(e) {
    var that = this
    var bean = e.currentTarget.dataset.bean
    console.info(bean)
    var submitData = {};
    submitData.id = bean.id
    submitData.userId = that.data.currentUser.id  // 这里注意，只用于携带当前点赞用户 id，后端做替换
    console.log(submitData)
    wx.request({
      url: urlList.collectThumbsUpGiveUrl,
      data: JSON.stringify(submitData),
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == "failure" && res.data.data.errCode == 10002) {
          wx.showModal({
            title: '提示',
            content: '每人只能参加一次点赞活动，您之前已经点过赞，请知悉',
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '点赞成功！',
            showCancel: false,
            success: function (resbtn) {
              if (resbtn.confirm) {
                wx.redirectTo({
                  url: '/pages/work-list/work-list'
                })
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showToast({
          title: '点赞失败，请重试',
          icon: '/img/error.jpg',
          duration: 2000
        })
      }
    });
  },

  viewDetail(e) {
    var bean = e.currentTarget.dataset.bean
    console.info(bean)
    wx.showModal({
      title: bean.workName,
      content: bean.workProfile,
      showCancel: false,
      confirmText: '关闭'
    })
  },

  previewImage(e) {
    const current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: [current]
    })
  }
})