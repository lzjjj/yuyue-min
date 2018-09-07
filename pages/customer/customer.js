// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    client:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    client: options.item ? JSON.parse(options.item) :""
  })
  },

 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})