var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   //页面初始化加载上级页面传的参数
    var that = this;
    var msgId = app.msgId  //消息主键ID
    var orderNo = app.orderNo      //订单号
    var msgStatus = app.msgStatus    //消息状态
    that.setData({
      token: wx.getStorageSync('token'),
      userId: wx.getStorageSync('userId'),
      msgId: msgId,
      orderNo: orderNo,
      msgStatus: msgStatus
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 请求消息详情数据
    wx.request({
      url: app.globalData.baseUrl + '/customerorder/detail/' + that.data.orderNo ,
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        // 服务天数
        var serviceDays = ((res.data.data[0].orderServiceEndTime - res.data.data[0].serviceStartTime) / 86400000).toFixed(1)
        timestamp1 = new Date(res.data.data[0].serviceStartTime);
          y = timestamp1.getFullYear(),
          m = timestamp1.getMonth() + 1,
          d = timestamp1.getDate();
          // 开始时间
        var starttime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp1.toTimeString().substr(0, 8);
        timestamp2 = new Date(res.data.data[0].orderServiceEndTime);
          k = timestamp2.getFullYear(),
          f = timestamp2.getMonth() + 1,
          w = timestamp2.getDate();
          // 结束时间
        var endtime = k + "-" + (f < 10 ? "0" + f : f) + "-" + (w < 10 ? "0" + w : w) + " " + timestamp2.toTimeString().substr(0, 8);
        that.setData({
          coupons: res.data.data[0],
          starttime: starttime,
          endtime: endtime,
          serviceDays: serviceDays
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
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