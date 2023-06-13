//index.js
import requestUrl from "../../common/api.js"
const app = getApp()
Page({
  data: {
    locationList: [], //城市列表
    objectMultiArray: [
    ],
    index: 0,
    conditionsList: ['分类一', '分类一', '分类一', '分类一', '分类一', '分类一', '分类一'],
    toolsList: [], // 工具列表
    canRequest: true, // 是否可以请求
    showNone: false, // 展示空态
    pageNum: 1,//页码
    keyWord: '', //搜索关键字
    toolstype: '', //工具类型
    userDetail: '',
    userInfo:""
  },
  onShow: function (){
    this.setData({
      pageNum: 1,
      keyWord: '',
      toolstype: '',
      toolsList: [],
    })
    if (app.globalData.userInfo) {
      if (app.globalData.userDetail && app.globalData.userDetail.if_engineer) {
        this.setData({
          userInfo: app.globalData.userInfo,
          userDetail: app.globalData.userDetail
        })
        this.data.locationList.forEach((item,idx) => {
            if (item.name == this.data.userDetail.province.name) {
                this.setData({
                    index: idx
                  })
            }
        })
        this.getToolsList()
      } else {
        wx.showToast({
          title: '您不是允许的用户，请联系管理员',
          icon: "none"
        })
      }
    } else {
      app.globalData.goBackHome = true
      wx.switchTab({
        url: "/pages/mine/mine"
      })
    }
  },
  onLoad: function () {
    this.getAreaList()
    this.getDtoolsType()
  },
  keywordChange(e) { // 修改keyword
    let value = e.detail.value
    this.setData({
      keyWord: value
    })
  },
  filterTool(e) { //筛选工具
    let id = e.currentTarget.dataset.id
    this.setData({
      pageNum: 1,
      keyWord: '',
      toolstype: id == -1 ? '' : id,
      toolsList: [],
    })
    this.getToolsList()

  },
  searchTool() { //搜索工具
    if (!this.data.keyWord) {
      wx: wx.showToast({
        title: '关键字不能空',
        icon: 'none',
        duration: 2000,
      })
    } else {
      this.setData({
        pageNum: 1,
        keyWord: this.data.keyWord,
        toolstype: '',
        toolsList: []
      })
      this.getToolsList()
    }
  },
  bindMultiPickerChange(e) { //picker行改变
    var data = {
      objectMultiArray: this.data.objectMultiArray,
      index: e.detail.value,
      pageNum: 1,
      keyWord: this.data.keyWord,
      toolstype: this.data.toolstype,
      toolsList: []
    };
    this.setData(data);
    this.getToolsList()
  },
  getDtoolsType() {  //获取工具分类
    wx.request({
      url: requestUrl.dtoolsType,
      method: 'GET',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            conditionsList: res.data,
          })
        }
      },

    })
  },
  //获取城市区域信息
  getAreaList() {
    wx.request({
      url: requestUrl.areaList,
      method: 'GET',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.statusCode === 200) {
          this.setData({
            locationList: res.data,
            objectMultiArray: res.data,
          })
          this.getToolsList()
          
          // if (app.globalData.userInfo) {
          //   if (app.globalData.userDetail && app.globalData.userDetail.if_engineer) {
          //   } else {
          //     wx.showToast({
          //       title: '您不是允许的用户，请联系管理员',
          //       icon: "none"
          //     })
          //   }
          // } else {
          //   wx.showModal({
          //     title: '提示',
          //     content: '您还没有登录，确定要跳转登录页面么？',
          //     success: (res) => {
          //       if (res.confirm) {
          //         app.globalData.goBackHome = true
          //         wx.switchTab({
          //           url: "/pages/mine/mine"
          //         })
          //       } else if (res.cancel) {
          //         console.log('用户点击取消')
          //       }
          //     }
          //   })
          // }
          
        }
      },

    })
  },

  getToolsList() { //获取工具列表信息
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      canRequest: false
    })
    wx.request({
      url: requestUrl.dtoolsList,
      method: 'GET',
      data: {
        page: this.data.pageNum,
        page_size: 10,
        toolstype: this.data.toolstype,
        toolscity: '',
        toolsprovince: this.data.objectMultiArray[this.data.index].id,
        search: this.data.keyWord
      },
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        wx.hideLoading()
        if (res.data.results.length > 0) {
          let toolsList = res.data.results;
          this.setData({
            toolsList: this.data.toolsList.concat(toolsList)
          })
        } else {
          this.setData({
            toolsList: this.data.toolsList,
          })
        }
        this.setData({
          showNone: this.data.toolsList.length == 0 ? true : false,
          canRequest: res.data.count > this.data.toolsList.length ? true : false
        })
      },

    })
  },
  luanchToDetail(e) { // 跳转工具详情
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/tool-info/tool-info?id=' + id,
    })
  },
  onReachBottom: function () { //到底部触发事件
    if (!this.data.showNone && this.data.userDetail.if_engineer) {
      if (this.data.canRequest) {
        this.setData({
          pageNum: this.data.pageNum + 1
        })
        this.getToolsList();
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
