// pages/my-date/my-date.js
import requestUrl from "../../common/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datingList: [ //正在预约列表

    ],
    isShowPop: false,
    page: 1,
    showNone: false,
    trd_session: '',
    canRequest: true,
    comment:'',
    id:""
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
        this.getDateRecords(res.data)
      },
    })
  },
  showAction(e){ // 展示actionsheet
    let key = e.currentTarget.dataset.index
    let item = this.data.datingList[key]
    wx.showActionSheet({
      itemList: ['去评价','取消预约', '修改预约','查看客户'],
      itemColor:'#ab312c',
      success:(res)=> {
        let index = res.tapIndex
        console.log(res.tapIndex)
        switch (index) {
          case 0:
            this.showPop(item.dtools.id)
            break;
          case 1:
            this.HandleCancel(item.id);
            break;
          case 2:
            let itemNew = JSON.stringify(item)
            this.changeDate(itemNew);
            break;
          case 3:
            let itemNew1 = JSON.stringify(item.client)
            wx.navigateTo({
              url: '/pages/customer/customer?item=' + itemNew1,
            })
            break;
        }
      },
      fail:(res)=> {
        console.log(res.errMsg)
      }
    })
  },
  changeDate(item){ // 修改预订信息
    wx.navigateTo({
      url: '/pages/date-tools/date-tools?item=' + item ,
    })
  },
  changeComment(e) { // 监听评论输入框的改变评论
    this.setData({
      comment:e.detail.value
    })
  },
  addComment() { //添加评论
    if (this.data.comment) {
      wx.request({
        url: requestUrl.addComment + '?trd_session=' + this.data.trd_session,
        method:'POST',
        data: {
          "comment": this.data.comment,
          "dtools": this.data.id
        },
        success: res => {
          wx.showToast({
            title: '评论成功！',
            icon: "none"
          })
          setTimeout(()=>{
            wx.redirectTo({
              url: '/pages/tool-info/tool-info?id=' + this.data.id,
            })
          },2000)
          this.setData({
            isShowPop:false
          })

        },
      })
    } else if (!this.data.comment) {
      wx.showToast({
        title: '评论不能为空！',
        icon: "none"
      })
    } else {
      wx.showToast({
        title: '评论失败！',
        icon: "none"
      })
    }
    
  },
  getDateRecords(trd_session) { //获取用户预约记录
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      canRequest: false
    })
    wx.request({
      url: requestUrl.getRecords,
      method: 'GET',
      data: {
        "page_size": 10,
        "page": this.data.page,
        "trd_session": trd_session,
      },
      success: res => {
        wx.hideLoading()
        if (res.data.results.length > 0) {
          let datingList = res.data.results;
          this.setData({
            datingList: this.data.datingList.concat(datingList)
          })
        } else {
          this.setData({
            datingList: this.data.datingList,
          })
        }
        this.setData({
          showNone: this.data.datingList.length == 0 ? true : false,
          canRequest: res.data.count > this.data.datingList.length ? true : false
        })
      }
    })
  },
  HandleCancel(id) { //取消预约操作
    wx.showModal({
      title: '提示',
      content: '确定要取消预约么？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: requestUrl.cancelDate,
            data: {
              "usrdate_id": id,
              "trd_session": this.data.trd_session,
            },
            success: res => {
              this.setData({
                page: 1,
                datingList: []
              })
              this.getDateRecords(this.data.trd_session)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showPop(id) { // 显示评价弹窗
    this.setData({
      isShowPop: true,
      id : id
    })
  },
  hidePop() { // 关闭评价弹窗
    this.setData({
      isShowPop: false
    })
  },
  onReachBottom: function () { //到底部触发事件
    if (!this.data.showNone) {
      if (this.data.canRequest) {
        this.setData({
          page: this.data.page + 1
        })
        this.getDateRecords(this.data.trd_session);
      } else {
        wx.showToast({
          title: '已到底部',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})