let playTimeInterval;
let recordTimeInterval;

const app = getApp();
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
// 引入配置文件config
const urlList = require('../../utils/config.js');
var tempFilePath;
Page({
  formatTime: function(time) {
    if (typeof time !== 'number' || time < 0) {
      return time
    }

    const hour = parseInt(time / 3600, 10)
    time %= 3600
    const minute = parseInt(time / 60, 10)
    time = parseInt(time % 60, 10)
    const second = time

    return ([hour, minute, second]).map(function(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }).join(':')
  },

  /**
   * 页面的初始数据
   */
  data: {
    recording: false,
    playing: false,
    hasRecord: false,
    flag: false,
    recordTime: 0,
    playTime: 0,
    formatedRecordTime: '00:00:00',
    formatedPlayTime: '00:00:00',
    title: '',
    text: '',
    shareImgSrc: "",
    bg: urlList.imagesAllBgUrl,
    visible: false,
    userInfo: {}
  },
  onHide() {
    if (this.data.playing) {
      this.stopVoice()
    } else if (this.data.recording) {
      this.stopRecordUnexpectedly()
    }
  },

  startRecord() {
    this.setData({
      recording: true
    })

    const options = {
      duration: 1000*60*4, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }

    const that = this
    recordTimeInterval = setInterval(function() {
      const recordTime = that.data.recordTime += 1
      that.setData({
        formatedRecordTime: that.formatTime(that.data.recordTime),
        recordTime
      })
    }, 1000)
    //MP3

    //开始录音
    recorderManager.start(options);
    /*silk
    wx.startRecord({
      success(res) {
        that.setData({
          hasRecord: true,
          tempFilePath: res.tempFilePath,
          formatedPlayTime: that.formatTime(that.data.playTime)
        })
      },
      complete() {
        that.setData({
          recording: false
        })
        clearInterval(recordTimeInterval)
      }
    })
    */
  },

  stopRecord() {
    //MP3
    var that = this;
    recorderManager.stop();
    this.setData({
      formatedPlayTime: this.formatTime(this.data.playTime)
    })
    /*silk
    wx.stopRecord()
    */
  },

  stopRecordUnexpectedly() {
    //MP3
    const that = this
    recorderManager.stop();

    /*
    const that = this
    wx.stopRecord({
      success() {
        console.log('stop record success')
        clearInterval(recordTimeInterval)
        that.setData({
          recording: false,
          hasRecord: false,
          recordTime: 0,
          formatedRecordTime: that.formatTime(0)
        })
      }
    })
    */
  },

  playVoice() {
    const that = this
    playTimeInterval = setInterval(function() {
      const playTime = that.data.playTime + 1
      console.log('update playTime', playTime)
      if (playTime==that.data.recordTime){
        that.stopVoice()
      }
      that.setData({
        playing: true,
        formatedPlayTime: that.formatTime(playTime),
        playTime
      })
    }, 1000)
    innerAudioContext.src = that.tempFilePath;
    innerAudioContext.play();
    /*silk
    wx.playVoice({
      filePath: this.data.tempFilePath,
      success() {
        clearInterval(playTimeInterval)
        const playTime = 0
        console.log('play voice finished')
        that.setData({
          playing: false,
          formatedPlayTime: that.formatTime(playTime),
          playTime
        })
      }
    })
    */
  },

  pauseVoice() {
    clearInterval(playTimeInterval)
    /*silk
    wx.pauseVoice()
    */
    this.setData({
      playing: false
    })
  },

  stopVoice() {
    clearInterval(playTimeInterval)
    this.setData({
      playing: false,
      formatedPlayTime: this.formatTime(0),
      playTime: 0
    })
    innerAudioContext.stop();
    /*silk
    wx.stopVoice()
    */
  },

  clear() {
    var that = this
    clearInterval(playTimeInterval)
    //MP3
    console.log('停止播放!');
    that.tempFilePath = ''
    that.setData({
      playing: false,
      hasRecord: false,
      formatedRecordTime: that.formatTime(0),
      recordTime: 0,
      playTime: 0
    })
    innerAudioContext.stop();
    /*silk
    wx.stopVoice()
    this.setData({
      playing: false,
      hasRecord: false,
      tempFilePath: '',
      formatedRecordTime: that.formatTime(0),
      recordTime: 0,
      playTime: 0
    })
    */
  },
  //上传录音
  upload: function() {
    var that = this
    if (that.data.recordTime >= 60) {
    wx.uploadFile({
      url: urlList.clockInUpRecordUrl, //演示域名、自行配置
      filePath: this.tempFilePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        "userId": app.globalData.content.userId,
        "courseId": app.globalData.content.courseId
      },
      success: function(res) {
        console.log(res);
        that.setData({
          visible: true
        })
      },
      fail: function(res) {
        console.log(res);
        wx.showToast({
          title: '上传失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: function(res) {

      }
    })
    }else{
      wx.showToast({
        title: '录音不足1分钟',
        image:'/img/error.jpg'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    if (!app.globalData.content || !app.globalData.content.content){
      wx.showModal({
        title: '提示',
        content: '获取文章内容失败，请点按确定，然后重新在文章选择列表页选择文章进行朗诵。',
        showCancel: false,
        success: function (resbtn) {
          if (resbtn.confirm) {
            wx.redirectTo({
              url: '/pages/text-list/text-list'
            })
          }
        }
      })
    }
    this.setData({
      text: app.globalData.content.content.replace(/\\n/g, "\n"),
      nickName: app.globalData.backuser.nickName,
      clockInTimes: app.globalData.backuser.clockInTimes + 1,
      title: app.globalData.content.title
    })
    console.log(this.data)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //录音callback
    recorderManager.onStart(() => {
      console.log('recorder start')
      that.setData({
        formatedPlayTime: that.formatTime(that.data.playTime)
      })
    });
    recorderManager.onError((res) => {
      console.log(res);
      this.setData({
        recording: false,
        hasRecord: false,
        recordTime: 0,
        formatedRecordTime: this.formatTime(0)
      })
    });
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const {
        tempFilePath
      } = res
      console.log('stop record success')
      clearInterval(recordTimeInterval)
      this.setData({
        recording: false,
        hasRecord: true
      })
    });
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    });
    innerAudioContext.onStop((res) => {
      clearInterval(playTimeInterval)
      const playTime = 0
      console.log('onStop play voice finished')
      that.setData({
        playing: false,
        formatedPlayTime: that.formatTime(playTime),
        playTime
      })
    });
    innerAudioContext.onEnded((res) => {
      clearInterval(playTimeInterval)
      const playTime = 0
      console.log('onEnded play voice finished')
      that.setData({
        playing: false,
        formatedPlayTime: that.formatTime(playTime),
        playTime
      })
    });
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    });
  },
})