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
    var serviceStaffId = app.serviceStaffId;
    that.setData({
      orderNo: orderNo,
      serviceStaffId: serviceStaffId
    })
    // 请求所有护工数据
    wx.request({
      url: app.globalData.baseUrl + '/inststaff/staff_schedule',
      method: 'post',
      data: {
        orderNo: that.data.orderNo
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res){
        console.log(res)
        if (res.data.data[0] === undefined) {
            that.setData({
                project: res.data.data,
                arr: {},
                arr1: {}
            })
            return;
        }
        var arr=new Array;
        for(var i=0;i<res.data.data.length;i++){
          if (res.data.data[i].id == that.data.serviceStaffId){  //把后台返回的数据进行处理，分为当前正在服务的护工和其他护工
            arr.push(res.data.data[i])
          }
        }
        var arr1 = new Array;
        for (var j = 0; j< res.data.data.length; j++) {
          if (res.data.data[j].id !== that.data.serviceStaffId) {  //把后台返回的数据进行处理，分为当前正在服务的护工和其他护工
            arr1.push(res.data.data[j])
          }
        }
        that.setData({
          project: res.data.data,
          arr: arr[0],
          arr1: arr1
        })
      }
    });
  },
  // 选择其他护工并返回再次派单页面
  clickDetails: function (e) {
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
    var inputVal = e.detail.value;
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
        var arr2 = new Array;
        for (var j = 0; j < res.data.data.length; j++) {  //搜索结果同样去除当前正在服务的护工，把其他搜索结果放进其他护工选项
          if (res.data.data[j].id !== that.data.serviceStaffId) {
            arr2.push(res.data.data[j])
          }
        }
        that.setData({
          arr1: arr2
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