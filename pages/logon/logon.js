const app = getApp();
// 引入配置文件config
const urlList = require('../../utils/config.js');
Page({
  data: {
    array_district: ['五华区', '盘龙区', '官渡区', '西山区', '呈贡区', '高新区', '经开区', '度假区'],
    wh_school: ['文林小学', '先锋小学', '武成小学', '龙翔小学', '长春小学', '红旗小学', '红云小学', '新闻路小学', '春城小学', '大观小学', '武成小学北校区', '红旗小学北校区', '莲华小学', '韶山小学', '江滨小学', '江岸小学', '师专附小月牙塘校区', '师专附小龙泉路校区', '虹山小学', '壁光小学', '麻园小学', '云铜小学', '联家小学', '普吉小学', '海源小学', '昭宗小学', '瑞和实验学校', '五华区外国语实验小学', '龙泉路小学', '其它'],
    pl_school: ['金康园小学', '盘龙小学本部', '明通小学本部', '拓东一小', '新迎一小', '新迎三小', '园博小学', '云波小学', '联盟小学', '金星中心小学', '明通小学北辰校区一部', '明通小学北辰校区二部', '金实小学', '新迎第二小学', '北京路小学', '古幢小学', '环城第一小学', '东华小学', '东华小学金色交响校区', '盘龙小学滨江校区', '东庄小学', '青云小学', '罗丰小学', '桃源小学', '云南师范大学附属俊发城小学', '其它'],
    gd_school: ['关锁中心学校', '子君中心学校', '东华二小魅力分校', '万科金域南郡小学', '师专附小官渡分校', '云溪小学', '晓东小学', '小板桥小学', '中闸中心学校', '金刚分校', '小板桥中心学校', '小板桥中心学校羊甫分校', '民航路小学', '五里小学', '民航路第二小学', '董家湾小学', '南站小学', '和平小学', '前卫路小学', '佴家湾小学', '六甲第一小学', '新二中心学校', '新二中心学校福保分校', '东站实验小学', '金马中心学校', '金马中心学校黑土凹分校', '金马中心大树营分校', '曙光小学', '方旺中心学校', '方旺中心学校十里分校', '方旺中心学校杨方凹校点', '方旺中心学校牛街分校', '东华二小', '云缨小学', '龙马中心学校', '古镇一小', '官渡中心学校', '关上实验学校湾流海分校', '关上实验学校', '关上第二小学', '福德中心学校', '双凤小学', '双桥中心学校', '小街小学', '西冲小学', '大板桥中心学校', '沙沟中心学校', '空港一小', '立志小学', '白汉场中心学校', '白汉场中心兔儿分校', '白汉场中心乌西分校', '长水中心学校', '长水中心学校复兴分校', '长水中心学校花箐分校', '中对龙中心学校', '其它'],
    xs_school: ['春苑小学', '棕树营小学', '红联小学', '大渔中心学校', '马街中心学校', '徐霞客中心学校徐霞客校区', '徐霞客中心学校碧水校区', '徐霞客中心学校长坡分校', '杨家中心学校', '昆明西山芳草地国际学校', '永昌小学', '华昌小学', '求实小学', '育红小学', '西华园小学', '昆湖小学', '工人新村小学', '崇新小学', '书林一小', '书林二小', '侨光小学', '昆一中附属小学', '书林二小西苑小学', '其它'],
    cg_school: ['呈贡新区第一小学', '中华小学白龙潭校区', '中华小学滇池星城校区', '其它'],
    gx_school: ['高新一小科医路校区', '高新一小经典校区', '高新一小海源校区', '其它'],
    jk_school: ['经开一小', '其它'],
    dj_school: ['滇池度假区实验学校', '度假区第二小学', '其它'],
    array_grade: ['一年级','二年级', '三年级', '四年级', '五年级','六年级'],
    index_district: 0,
    index_school: 0,
    index_grade: 0,
    userInfo: {},
    bg: urlList.imagesAllBgUrl,
  },
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onShareAppMessage() {
    return {
      title: 'picker',
      path: 'pages/logon/logon'
    }
  },
  bindPickerChangeDistrict(e) {
    this.setData({
      index_district: e.detail.value,
      index_school: 0
    })
    console.log('picker发送选择改变，携带值为', e.detail.value)
  },

  bindPickerChangeSchool(e) {
    this.setData({
      index_school: e.detail.value
    })
    console.log('picker发送选择改变，携带值为', e.detail.value)
  },

  bindPickerChangeGrade(e) {
    this.setData({
      index_grade: e.detail.value
    })
    console.log('picker发送选择改变，携带值为', e.detail.value)
  },

  formSubmit(e) {
    var that = this
    var submitData = {}
    submitData.id = app.globalData.backuser.id
    submitData.district = that.data.array_district[that.data.index_district]
    if (that.data.index_district == 0) {
      submitData.school = that.data.wh_school[that.data.index_school]
    } else if (that.data.index_district == 1) {
      submitData.school = that.data.pl_school[that.data.index_school]
    } else if (that.data.index_district == 2) {
      submitData.school = that.data.gd_school[that.data.index_school]
    } else if (that.data.index_district == 3) {
      submitData.school = that.data.xs_school[that.data.index_school]
    } else if (that.data.index_district == 4) {
      submitData.school = that.data.cg_school[that.data.index_school]
    } else if (that.data.index_district == 5) {
      submitData.school = that.data.gx_school[that.data.index_school]
    } else if (that.data.index_district == 6) {
      submitData.school = that.data.jk_school[that.data.index_school]
    } else if (that.data.index_district == 7) {
      submitData.school = that.data.dj_school[that.data.index_school]
    }
    if (submitData.school == '其它') {
      if (e.detail.value.inputSchool == '') {
        wx.showToast({
          title: '注册信息不完整',
          icon: 'none',
          duration: 1000
        })
        return;
      } else {
        submitData.school = e.detail.value.inputSchool
      }
    }
    submitData.grade = that.data.array_grade[that.data.index_grade]
    if (e.detail.value.nickName == '') {
      wx.showToast({
        title: '注册信息不完整',
        icon: 'none',
        duration: 1000
      })
      return;
    } else {
      submitData.nickName = e.detail.value.nickName
      app.globalData.backuser.nickName = e.detail.value.nickName
    }
    console.log(submitData)
    wx.request({
      url: urlList.userRegisterUrl,
      data: submitData,
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        app.globalData.grade = submitData.grade
        app.globalData.clockInTimes = 0
        wx.redirectTo({
          url: '/pages/show/show',
        })
      }
    })
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },

  next() {
    wx.redirectTo({
      url: "/pages/show/show"
    })

  }
})