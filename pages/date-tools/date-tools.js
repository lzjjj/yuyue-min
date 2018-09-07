// pages/date-tools/date-tools.js
import requestUrl from "../../common/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '',
    endDate:'',
    id: '',
    toolDetail: '',
    selectCustomer:'',
    clientuserList: [],//客户列表
    canRequest: true, // 是否可以请求
    showNone: false, // 展示空态
    pageNum: 1,//页码
    keyWord: '', //搜索关键字
    isSelect:false,
    userDetail: "",
    trd_session:"",
    itemInfo : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id ? options.id : JSON.parse(options.item).dtools.id,
      itemInfo: options.item ? JSON.parse(options.item) : '',
      startDate: options.item ? JSON.parse(options.item).start_times:'',
      endDate: options.item ? JSON.parse(options.item).end_times : '',
      selectCustomer: options.item ? JSON.parse(options.item).client : '',

    })
    this.getToolDetail(this.data.id)
    this.getClientuser()
    wx.getStorage({
      key: 'trd_session',
      success: (res)=> {
        this.setData({
          trd_session: res.data
        })
        this.getMoreInfo(res.data)
      },
    })
  },
  handDateTool() { // 预约工具接口
    if (!this.data.startDate || !this.data.endDate || !this.data.selectCustomer.id || !this.data.id) {
    wx.showToast({
      title: '请先完善信息',
      icon:"none"
    })
  } else {
    wx.request({
      url: (this.data.itemInfo ? requestUrl.updateDateInfo : requestUrl.dateTool) + '?trd_session=' + this.data.trd_session,
      method: 'POST',
      data: {
        "start_times": this.data.startDate,
        "end_times": this.data.endDate,
        "client": this.data.selectCustomer.id,
        "dtools": this.data.id,
        'date_id': this.data.itemInfo.id
      },
      success: res => {
        let title = ''
        if (res.data.status =='failed'){
          title = res.data.msg
        } else if (res.data.status == 'success'){
          title = res.data.msg
         setTimeout(function(){
           wx.redirectTo({
             url: '/pages/my-date/my-date',
           })
         },2000)
        } else{
          title = '未知错误'
        }
        wx.showToast({
          title: title,
          icon: 'none'
        })
      }
    })
  }

  },
  getMoreInfo(trd_session) { //获取用后台存储信息
    wx.request({
      url: requestUrl.userDetail + '?trd_session=' + trd_session,
      success: res => {
        if (res.data.status == 'success') {
          this.setData({
            userDetail: res.data.data
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
  bindStartDateChange: function (e) { // 修改开始时间
    this.setData({
      startDate: e.detail.value,
      endDate: e.detail.value
    })
  },
  bindEndDateChange: function (e) { // 修改结束时间
    this.setData({
      endDate: e.detail.value
    })
  },
  luanchToClientuser () { // 选择客户
    wx.setNavigationBarTitle({
      title: '选择客户',
    })
    this.setData({
      isSelect:true
    })
  },
  selectClientuser(e) { // 选择客户，存进storage
    let index = e.currentTarget.dataset.index
    let clientuser = this.data.clientuserList[index]
    this.setData({
      selectCustomer: clientuser,
      isSelect: false
    })
    wx.setNavigationBarTitle({
      title: '填写预订信息',
    })
  },
  keywordChange(e) { // 修改keyword
    let value = e.detail.value
    this.setData({
      keyWord: value
    })
  },
  searchClientuser() { // 搜索客户
    if (this.data.keyWord) {
      this.setData({
        pageNum: 1,
        clientuserList: []
      })
      this.getClientuser()
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 2000
      })
    }

  },
  getClientuser() {  //获取客户列表
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      canRequest: false
    })
    wx.request({
      url: requestUrl.getClientuser,
      method: 'GET',
      data: {
        page: this.data.pageNum,
        page_size: 10,
        search: this.data.keyWord
      },
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        wx.hideLoading()
        if (res.data.results.length > 0) {
          let clientuserList = res.data.results;
          this.setData({
            clientuserList: this.data.clientuserList.concat(clientuserList)
          })
        } else {
          this.setData({
            clientuserList: this.data.clientuserList,
          })
        }
        this.setData({
          showNone: this.data.clientuserList.length == 0 ? true : false,
          canRequest: res.data.count > this.data.clientuserList.length ? true : false
        })
      },

    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { //到底部触发事件
    if (!this.data.showNone) {
      if (this.data.canRequest) {
        this.setData({
          pageNum: this.data.pageNum + 1
        })
        this.getClientuser();
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