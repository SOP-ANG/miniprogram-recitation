// 引入配置文件config
const urlList = require('../../utils/config.js');
var startX, endX;
var moveFlag = true;// 判断执行滑动事件
Page({
  data: {
    picture1: urlList.imagesIndexBg1Url,
    picture2: urlList.imagesIndexBg2Url,
    time: 120,
    interval: "",
    change: true,
    page: 1,
    ani1: '',
    ani2: ''
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {
    // 页面渲染完成
  },
  onChangeTap: function() {
    var that = this;
    if (that.data.change) {
      that.setData({
        change: false
      })
    } else {
      that.setData({
        change: true
      })
    }
  },
  onUnload: function() {
    var that = this;
    that.clearTimeInterval(that)
  },
  onShow: function() {
  },
  clearTimeInterval: function(that) {
    var interval = that.data.interval;
    clearInterval(interval)
  },
  goto: function() {
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },

  touchStart: function(e) {
    startX = e.touches[0].pageX; // 获取触摸时的原点
    moveFlag = true;
  },
  // 触摸移动事件
  touchMove: function(e) {
    endX = e.touches[0].pageX; // 获取触摸时的原点
    if (moveFlag) {
      if (endX - startX > 50) {
        console.log("move right");
        this.move2right();
        moveFlag = false;
      }
      if (startX - endX > 50) {
        console.log("move left");
        this.move2left();
        moveFlag = false;
      }
    }
  },
  // 触摸结束事件
  touchEnd: function(e) {
    moveFlag = true; // 回复滑动事件
  },
  //向左滑动操作
  move2left() {
    var that = this;
    if (this.data.page == 2) {
      return
    }
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 100
    });
    animation.opacity(0.2).translate(-500, 0).step()
    this.setData({
      ani1: animation.export()
    })
    setTimeout(function() {
      that.setData({
        page: 2,
        ani2: ''
      });
    }, 800)
  },
  //向右滑动操作
  move2right() {
    var that = this;
    if (this.data.page == 1) {
      return
    }
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 100
    });
    animation.opacity(0.2).translate(500, 0).step()
    this.setData({
      ani2: animation.export()
    })
    setTimeout(function() {
      that.setData({
        page: 1,
        ani1: ''
      });
    }, 800)
  }
})