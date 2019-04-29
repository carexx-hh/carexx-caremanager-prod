// pages/order/order.js
const util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchtab: [  //头部nav状态
      {
        name: '未完成',
      },
      {
        name: '已完成',
      },
    ],
    current: 0,
    coupons: [],
    no_order:false, //无订单
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      token: wx.getStorageSync('token'),
      userId: wx.getStorageSync('userId'),
      instId: wx.getStorageSync('instId')
    });
  },
  // 点击切换状态（已完成、未完成）
  switchNav: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    that.setData({
      current: index,
      no_order:false
    }, function () {
      if (that.data.current == 0) {  //选择未完成时请求数据
        wx.request({
          url: app.globalData.baseUrl + '/customerorder/by_orderStatus_and_serviceStatus',
          method: 'post',
          data:{
            orderStatus:4,
            serviceStatus:1
          },
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {
            console.log(res)
            //无订单时
            if(res.data.data.length==0){
                that.setData({
                    coupons: [],
                    no_order: true
                })
                return ;
            }
            //有订单时
            var timestamp = [];
            for (var i = 0; i < res.data.data.length; i++) {
            timestamp.push(new Date(res.data.data[i].createTime));          //对时间戳进行转换
            var arr = [];
            for (var j = 0; j < timestamp.length; j++) {
                y = timestamp[j].getFullYear(),
                m = timestamp[j].getMonth() + 1,
                d = timestamp[j].getDate();
                arr.push((m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) + '号');  //正常格式存到arr数组里
            }
            }
            that.setData({
                coupons: res.data.data,
                time: arr,
                no_order:false
            })
          }
        });
      } else if (that.data.current == 1) {  //选择已完成时请求数据
        wx.request({
          url: app.globalData.baseUrl + '/customerorder/by_orderStatus_and_serviceStatus' ,
          method: 'post',
          data: {
            orderStatus: '5,6',
            serviceStatus: 2
          },
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {
            console.log(res)
            //无订单时
            if (res.data.data.length == 0) {
                that.setData({
                    coupons: [],
                    no_order: true
                })
                return;
            }
            //有订单时
            var timestamp = [];
            for (var i = 0; i < res.data.data.length; i++) {            //对时间戳进行转换
              timestamp.push(new Date(res.data.data[i].createTime));    
              var arr = [];
              for (var j = 0; j < timestamp.length; j++) {
                y = timestamp[j].getFullYear(),
                  m = timestamp[j].getMonth() + 1,
                  d = timestamp[j].getDate();
                arr.push((m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) + '号');       //正常格式存到arr数组里
              }
            };
            that.setData({
              coupons: res.data.data,
              time: arr,
              no_order:false
            })
          }
        });
      }
    });
  },
// 未：4 1
// 已：5，6  2
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
    that.setData({         //页面刷新时current默认为未完成，进行还未完成订单的数据请求
      current: 0,
      no_order:false
    })
    wx.request({
      url: app.globalData.baseUrl + '/customerorder/by_orderStatus_and_serviceStatus',
      method: 'post',
      data: {
        orderStatus: 4,
        serviceStatus: 1
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        //无订单时
        if (res.data.data.length == 0) {
            that.setData({
                coupons: [],
                no_order: true
            })
            return;
        }
        //有订单时
        var timestamp = [];
        for (var i = 0; i < res.data.data.length; i++) {          //对时间戳进行转换
          timestamp.push(new Date(res.data.data[i].createTime));
          var arr = [];
          for (var j = 0; j < timestamp.length; j++) {
            y = timestamp[j].getFullYear(),
              m = timestamp[j].getMonth() + 1,
              d = timestamp[j].getDate();
            arr.push((m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) + '号');      //正常格式存到arr数组里
          }
        }
        var timestamp1 = [];      
        for (var m = 0; m < res.data.data.length; m++) {
          timestamp1.push(new Date(res.data.data[m].createTime).toDateString());
          var arr1 = [];
          for (var k = 0; k < timestamp.length; k++) {
            arr1.push(timestamp[k].toTimeString().substr(0, 5));
          }
        }
        var newtime = new Date().toDateString()
        //  console.log(timestamp, timestamp1, newtime,arr1)
        that.setData({
          coupons: res.data.data,
          time: arr,   //显示几月几号
          newtime: newtime,  //当前时间（未转换）
          time2: arr1,       //当前时间（几点几分）
          time3: timestamp1,
          no_order: false
        })  
      }
    });
  },
  // 点击进入列表详情进行查看
  clickDetails: function (e) {
    var orderNo = e.currentTarget.dataset.orderno
    app.orderNo = orderNo;
    var orderStatus = e.currentTarget.dataset.orderstatus
    app.orderStatus = orderStatus;
    wx.navigateTo({
      url: '../Order-details/Order-details',
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