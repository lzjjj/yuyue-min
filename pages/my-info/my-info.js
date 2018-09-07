// pages/mine/mine.js
import requestUrl from "../../common/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trd_session: "",
    userDetail: "",
    userInfo: "",
    areaList: [],
    index: 0,
    isShowBtn: false,
    hasUserInfo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    wx.getStorage({
      key: 'trd_session',
      success: res => {
        this.setData({
          trd_session: res.data
        })
        this.getMoreInfo(res.data)
      },
    })
    this.getAreaList()
  },
  changeName(e) { //修改名称
    this.setData({
      'userDetail.name': e.detail.value,
      isShowBtn: true
    })
    console.log(this.data.userDetail.name)
  },
  changePhone(e) { //修改电话
    let value = e.detail.value
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!myreg.test(value)) {
      value = ''
      wx.showToast({
        title: '格式不正确',
        icon: 'none',
        duration: 2000
      })
    } else {
      value = e.detail.value

    }
    this.setData({
      'userDetail.mobile': value,
      isShowBtn: true
    })
  },
  changeAddress(e) { //修改地址
    this.setData({
      'userDetail.address': e.detail.value,
      isShowBtn: true
    })
    console.log(this.data.userDetail.address)
  },
  bindAreaChange(e) { // 修改区域
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value
    this.setData({
      'userDetail.province.id': this.data.areaList[index].id,
      'userDetail.province.name': this.data.areaList[index].name,
      isShowBtn: true
    })
  },
  updateMoreInfo() { //修改用户后台存储信息
    wx.request({
      url: requestUrl.detailUpdate + '?trd_session=' + this.data.trd_session,
      method: 'POST',
      data: {
        "name": this.data.userDetail.name,
        "province": this.data.userDetail.province.id,
        "mobile": this.data.userDetail.mobile,
        "address": ''
      },
      success: res => {
        if (res.data.status == 'success') {
          app.globalData.userDetail = res.data.data
          this.setData({
            isShowBtn: false,
          })
          wx.showToast({
            title: '修改成功',
          })
        } else if (res.data.status == 'failed'){
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })
  },
  getMoreInfo(trd_session) { //获取用后台存储信息
    wx.request({
      url: requestUrl.userDetail + '?trd_session=' + trd_session,
      success: res => {
        if (res.data.status == 'success') {
          app.globalData.userDetail = res.data.data
          this.setData({
            userDetail: res.data.data
          })
        }
      }
    })
  },

  getAreaList() { //获取城市区域信息
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: requestUrl.areaList,
      method: 'GET',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        wx.hideLoading()
        if (res.statusCode === 200) {
          this.setData({
            areaList: res.data,
          })
        }
      },

    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})