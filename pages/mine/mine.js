// pages/mine/mine.js
const app = getApp()
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    show:false,
    show_data:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      userInfo:wx.getStorageSync('userInfo'),
      token: wx.getStorageSync('token'),
      instId: wx.getStorageSync('instId')
     })
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
    // 页面刷新监测新消息
    wx.request({
      url: app.globalData.baseUrl + '/msg/count_unread/',
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
         that.setData({
           data:res.data.data
         })
      }
    });
    // 页面刷新监测新的护工请求认证
    wx.request({
      url: app.globalData.baseUrl + '/inststaff/all_by_certification_status/1',
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        if (res.data.data.length > 0) {   //根据返回数据长度判断页面显示状态
          that.setData({
            show: true,
            message_nurse: res.data.data.length
          })
        }else{
          that.setData({
            show: false,
          })
        }
      }
    });
    // 请求护工管理员的详细信息
    wx.request({
      url: app.globalData.baseUrl + '/acluser/get_userId',
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        that.setData({
          coupons: res.data.data
        })
      }
    });
 

  },
  // 进入个人信息详情页
  click_details:function(){
     var that=this;
     wx.navigateTo({
       url: '../personal_information/personal_information',
     })
  },
  // 进入护工认证详情页
  click_nurse:function(){
    var that = this;
    wx.navigateTo({
      url: '../nurse_certification/nurse_certification',
    })  
  },
  // 进入消息通知详情页
  click_message:function(){
    wx.navigateTo({
      url: '../messages/messages',
    })  
  },
  // 进入我的订单详情页
  click_order:function(){
    wx.navigateTo({
      url: '../my_order/my_order',
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