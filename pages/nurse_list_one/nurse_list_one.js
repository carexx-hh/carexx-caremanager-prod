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
  onLoad: function (options) {
    var that = this;
    that.setData({
      token: wx.getStorageSync('token')
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
    var orderNo = app.orderNo;
    that.setData({
      orderNo: orderNo
    })
    // 请求所有护工数据
    wx.request({
      url: app.globalData.baseUrl + '/inststaff/staff_schedule',
      method: 'post',
      data:{
        orderNo: that.data.orderNo
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        that.setData({
          project: res.data.data
        })
      }
    });
  },
  // 选中选择的护工并返回派单页面
  clickDetails:function(e){
    var realName = e.currentTarget.dataset.realname
    var id = e.currentTarget.dataset.id
    wx.setStorageSync('nurse_name', realName)
    wx.setStorageSync('serviceStaffId', id)
    wx.navigateBack({
      delta: 1
    })
  },
  // 快捷搜索护工
  searchSubmitFn: function (e) {
    var that = this;
    var inputVal = e.detail.value;  //输入的值
    wx.request({
      url: app.globalData.baseUrl + '/inststaff/staff_schedule',
      method: 'post',
      data: {
        orderNo: that.data.orderNo,
        staffName: inputVal
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        that.setData({
          project: res.data.data
        })
      }
    });
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