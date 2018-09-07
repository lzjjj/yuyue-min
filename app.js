//app.js
import requestUrl from "./common/api.js"
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        var that = this;
        var code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getStorage({
          key: 'trd_session',
          success: res1 => {

            if (res1.data != undefined) {
              wx.request({

                url: requestUrl.login + "?trd_session=" + res1.data,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res2 => {
                  if (res2.data.msg == 'noLogin') {
                    wx.request({

                      url: requestUrl.login + "?code=" + code,
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: res3 => {

                        wx.setStorage({
                          key: "trd_session",
                          data: res3.data.data
                        })

                      }
                    })
                  }


                }
              })
            }
            else {

              wx.request({

                url: requestUrl.login + "?code=" + code,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res4 => {

                  wx.setStorage({
                    key: "trd_session",
                    data: res4.data.data
                  })

                }
              })
            }

          },
          fail: function () {
            wx.request({
              url: requestUrl.login + "?code=" + code,
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: res5 => {

                wx.setStorage({
                  key: "trd_session",
                  data: res5.data.data
                })

              }
            })
          }

        })
        this.getUserInfo();
      },
    })

  },

  getMoreInfo(trd_session) { //获取用后台存储信息
    wx.request({
      url: requestUrl.userDetail + '?trd_session=' + trd_session,
      success: res => {
        if (res.data.status == 'success') {
          this.globalData.userDetail = res.data.data
        }
      }
    })
  },

  //存储用户信息数据库
  setUserInfo(trd_session, userInfo) {

    wx.request({
      url: requestUrl.setUserInfo + "?trd_session=" + trd_session,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        "nickname": userInfo.nickName,
        "image": userInfo.avatarUrl,
        "gender": userInfo.gender
      },
      success: (res) => {

      }
    })
  },

  // 获取用户信息
  getUserInfo() {
    console.log("------开始--------")
    wx.getUserInfo({
      success: res => {
        console.log("------getUserInfo--------")
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo
        wx.getStorage({
          key: 'trd_session',
          success: res => {
            this.setUserInfo(res.data, this.globalData.userInfo)
            this.getMoreInfo(res.data)
          },
        })
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res => {
            console.log("------userInfoReadyCallback--------")
            this.globalData.userInfo = res.userInfo
            wx.getStorage({
              key: 'trd_session',
              success: res => {
                this.setUserInfo(res.data, this.globalData.userInfo)
              },
            })
          })
        }
      }
    })
  },
  globalData: {
    goBackHome:false,
    userDetail:'',
    userInfo: '',
    goBack:false,
    currentToolId:""
  }
})