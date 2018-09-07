// pages/tool-info/tool-info.js
import requestUrl from "../../common/api.js"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    toolDetail: '',
    comList: [] //评论列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id ? options.id : 1
    })
    this.getToolDetail(options.id)
    this.getComList(options.id)
  },
  getComList(id) {
    wx.request({
      url: requestUrl.getComments,
      data: {
        page: 1,
        page_size: 100,
        dtools: id
      },
      success: res => {
        if (res.data.results.length > 0) {
          this.setData({
            comList: res.data.results
          })
        }
      }
    })
  },
  getToolDetail(id) { // 获取工具详情
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: requestUrl.toolDetail + id + '/',
      success: res => {
        this.setData({
          toolDetail: res.data
        })
        wx.hideLoading()
      }
    })
  },
  luanchToHistory() { // 跳转预约历史
    wx.navigateTo({
      url: '/pages/date-history/date-history?id=' + this.data.id,
    })
  },
  luanchTodate() { // 跳转预约界面
    if (app.globalData.userInfo) {
      console.log('----------------app.globalData.userDetail')
      console.log(app.globalData.userDetail)
      if (app.globalData.userDetail && app.globalData.userDetail.if_engineer) {
        wx.navigateTo({
          url: '/pages/date-tools/date-tools?id=' + this.data.id,
        })
      } else {
        wx.showToast({
          title: '您不是允许的用户，请联系管理员',
          icon:"none"
        })
      }

    } else {
      wx.showModal({
        title: '提示',
        content: '您还没有登录，确定要跳转登录页面么？',
        success: (res) => {
          if (res.confirm) {
            app.globalData.goBack = true
            app.globalData.currentToolId = this.data.id
            wx.switchTab({
              url: "/pages/mine/mine"
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})