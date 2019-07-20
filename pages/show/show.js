const app = getApp();
// 引入配置文件config
const urlList = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    times: '',
    nickName: '',
    clockInTimes: 0,
    hasClockIn: false,
    bg: urlList.imagesAllBgUrl,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      times: app.globalData.backuser.clockInTimes,
      nickName: app.globalData.backuser.nickName,
      clockInTimes: app.globalData.backuser.clockInTimes,
      hasClockIn: app.globalData.backuser.hasClockIn
    })
  },
  next: function() {
    var that = this;
    if (!that.data.hasClockIn) {
      wx.redirectTo({
        url: '/pages/text-list/text-list'
      })
    } else {
      wx.showToast({
        title: '今日已完成',
        icon: 'success',
        duration: 2000,
      })
    }


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

  }
})