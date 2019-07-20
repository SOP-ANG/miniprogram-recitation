// pages/text-list/text-list.js
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var submitData = {};
    submitData.userId = app.globalData.backuser.id;
    console.log(submitData);
    wx.request({
      url: urlList.clockInGetCourseListUrl,
      data: JSON.stringify(submitData),
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        console.log(res)
        app.globalData.objectArray = res.data.data
        that.setData({
          objectArray:app.globalData.objectArray
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

  goVoicePage(e) {
    var bean = e.currentTarget.dataset.bean
    app.globalData.content = bean
    if(!bean.done){
      wx.redirectTo({
        url: "/pages/voice/voice"
      })
    } else {
      wx.showToast({
        title: '这篇文章已阅读过',
      })
    }
  }
})