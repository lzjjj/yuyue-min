// pages/date-history/date-history.js
import requestUrl from "../../common/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList:[
    ],
    showNone:false,
    page: 1,
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id ? options.id : 1
    })
    this.getDateHistory(this.data.id)
  },

  getDateHistory(id) { //获取用户预约记录
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
        "dtools": id,
      },
      success: res => {
        wx.hideLoading()
        if (res.data.results.length > 0) {
          let historyList = res.data.results;
          this.setData({
            historyList: this.data.historyList.concat(historyList)
          })
        } else {
          this.setData({
            historyList: this.data.historyList,
          })
        }
        this.setData({
          showNone: this.data.historyList.length == 0 ? true : false,
          canRequest: res.data.count > this.data.historyList.length ? true : false
        })
      }
    })
  },
  showAction(e) { // 展示actionsheet
    let key = e.currentTarget.dataset.index
    let item = this.data.historyList[key]
    wx.showActionSheet({
      itemList: ['查看客户'],
      itemColor: '#ab312c',
      success: (res) => {
        let index = res.tapIndex
        switch (index) {
          case 0:
            let itemNew = JSON.stringify(item.client)
            wx.navigateTo({
              url: '/pages/customer/customer?item=' + itemNew,
            })
            break;
        }
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.showNone) {
      if (this.data.canRequest) {
        this.setData({
          page: this.data.page + 1
        })
        this.getDateHistory(this.data.id);
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