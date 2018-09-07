// pages/mine/mine.js
import requestUrl from "../../common/api.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',//用户信息
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    trd_session: "",
    goBack: false,
    goBackHome: false,
    userDetail: ""
  },
  onShow: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      if (app.globalData.userDetail) {
        this.setData({
          userDetail: app.globalData.userDetail,
        })
      } else {
        wx.getStorage({
          key: 'trd_session',
          success: (res) => {
            this.setData({
              trd_session: res.data
            })
            this.getMoreInfo(this.data.trd_session);
          },
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'trd_session',
      success: (res) => {
        this.setData({
          trd_session: res.data
        })
      },
    })
    if (options.goBack) {
      this.setData({
        goBack: true
      })
    }
    if (options.goBackHome) {
      this.setData({
        goBackHome: true
      })

    }

    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    // if (this.data.hasUserInfo && this.data.userInfo && app.globalData.goBackHome) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '登录成功，您将跳转首页？',
    //     success: (res) => {
    //       app.globalData.goBackHome = false
    //       if (res.confirm) {
    //         wx.switchTab({
    //           url: "/pages/index/index"
    //         })
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //       }
    //     }
    //   })
    // }
  },
  getMoreInfo(trd_session) { //获取用后台存储信息
    wx.request({
      url: requestUrl.userDetail + '?trd_session=' + trd_session,
      success: res => {
        if (res.data.status == 'success') {
          this.setData({
            userDetail: res.data.data,
          })
          app.globalData.userDetail = res.data.data
          if (app.globalData.goBack) {
            app.globalData.goBack = false
            wx.navigateTo({
              url: '/pages/tool-info/tool-info?id=' + app.globalData.currentToolId,
            })
          }
          if (app.globalData.goBackHome) {
            console.log('------------goBackHome')
            wx.showModal({
              title: '提示',
              content: '登录成功，您将跳转首页？',
              success: (res) => {
                app.globalData.goBackHome = false
                if (res.confirm) {
                  wx.switchTab({
                    url: "/pages/index/index"
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
      wx.getStorage({
        key: 'trd_session',
        success: (res) => {
          this.setData({
            trd_session: res.data
          })
          console.log(this.data.trd_session)
          this.getMoreInfo(this.data.trd_session);
          app.setUserInfo(res.data, app.globalData.userInfo)
        },
      })
    }

  },
  //跳转个人信息
  luanchToInfo() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/pages/my-info/my-info',
      })
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }

  },
  //跳转预约记录
  luanchToMyDate() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/pages/my-date/my-date',
      })
    } else {
      wx.showToast({
        title: '请先登录',
      })
    }

  },
  luanchToAreaHistory() {
    console.log(this.data.userDetail)
    wx.navigateTo({
      url: '/pages/area-history/area-history?province=' + this.data.userDetail.province.id,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})