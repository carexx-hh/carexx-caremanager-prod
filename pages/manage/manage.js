// pages/manage/manage.js
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
      no_order:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      token: wx.getStorageSync('token')   //获取token
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
    var that=this;
    that.setData({
        no_order:false
    })
    // 请求护工信息
    wx.request({
      url: app.globalData.baseUrl + '/inststaff/mapp_all',
      method: 'post',
      data: {
        instId: wx.getStorageSync('instId')
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
          //无数据时
          if(res.data.data.length==0){
            that.setData({
                coupons: [],
                no_order:true
            })

          }else{   //有数据时
            that.setData({
                coupons: res.data.data,  //请求到的data数据存在自定义coupons数组里
                no_order:false
            })

          }
      }
    });
  },
  // 快捷查询护工
  searchSubmitFn:function(e){
    var that=this;
    var inputVal = e.detail.value;  //输入的护工姓名
    wx.request({
      url: app.globalData.baseUrl + '/inststaff/mapp_all',
      method: 'post',
      data: {
        instId: wx.getStorageSync('instId'),
        realName: inputVal
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        //无数据时
        if (res.data.data.length == 0) {
            that.setData({
                coupons: [],
                no_order: true
            })

        } else { //有数据时
            that.setData({
                coupons: res.data.data, //请求到的data数据存在自定义coupons数组里
                no_order: false
            })

        }
      }
    });
  },
  // 点击进入护工信息详情页面
  clickDetails:function(e){
    var realName = e.currentTarget.dataset.realname  //护工姓名
    var idNo = e.currentTarget.dataset.idno          //护工身份证
    var phone = e.currentTarget.dataset.phone        //护工电话
    var address = e.currentTarget.dataset.address       //护工地址
    var instName = e.currentTarget.dataset.instname            //所属机构名称
    var serviceInstName = e.currentTarget.dataset.serviceinstname     //护工服务机构名称
    var id = e.currentTarget.dataset.id     //护工id
    app.realName = realName 
    app.id = id
    app.idNo = idNo
    app.phone = phone
    app.address = address
    app.instName = instName
    app.serviceInstName = serviceInstName
    wx.navigateTo({
      url: '../nurse_information/nurse_information',
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