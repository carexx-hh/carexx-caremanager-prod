// pages/order/order.js
const util = require('../../utils/util.js')
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchtab: [ //头部nav状态选项
        {
            name: '未派单',
        },
        {
            name: '已派单',
        }
    ],
    current:0,
    coupons:[],
    windowHeight:'', //设备高度
    height:'',  //scroll高度
    no_order:false, //无数订单


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.getStorageSync('token')!=''){   //页面初始化监测是否存在token，存在则保存token，instid，userid到data
      that.setData({
        token: wx.getStorageSync('token'),
        instId: wx.getStorageSync('instId'),
        userId: wx.getStorageSync('userId')
      });
    }else{                              //不存在则跳转页面到登录页
      wx.redirectTo({
        url: '../login/login',
      })
    }
    
  },
  // 点击选项卡功能（未派单、已派单）
  switchNav: function (e){
    var that = this;
    var index = e.target.dataset.index;
    //点击活动按钮时直接返回
    if(that.data.current===index) return;
    wx.setStorageSync('current', index);
    that.setData({
        current: index,
        no_order:false
    },function(){
      if(that.data.current==0){  //如果current为0，则请求未派单的数据
        wx.request({
          url: app.globalData.baseUrl + '/customerorder/wait_schedule',
          method: 'get',
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {
              //无数据时，显示无数据，直接返回
              if(res.data.data.length==0){
                  that.setData({
                    no_order: true,
                    coupons: res.data.data,
                  })
                  return;
                  
              }
              //有数据时
            var timestamp = [];
            var arr = [];
            for (var i = 0; i < res.data.data.length; i++) {        //创建时间处理  
              timestamp.push(new Date(res.data.data[i].createTime));
              for (var j = 0; j < timestamp.length; j++) {    //如果时间不是当天，则显示几月几号
                  y = timestamp[j].getFullYear(),
                  m = timestamp[j].getMonth() + 1,
                  d = timestamp[j].getDate();
                  arr.push((m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) + '号');
              }
            }
            var timestamp1 = [];
            var arr1 = [];
            for (var m = 0; m < res.data.data.length; m++) {           //判断时间是否为当天，如果是当天则只显示几点几分
              timestamp1.push(new Date(res.data.data[m].createTime).toDateString());
              for (var k = 0; k < timestamp.length; k++) {
                arr1.push(timestamp[k].toTimeString().substr(0, 5));
              }
            }
            var newtime = new Date().toDateString() //获取当天时间
            that.setData({
              coupons: res.data.data,
              time: arr,  //当天之前下单的时间
              newtime: newtime, //当天的时间，用作判断下单的时间
              time2: arr1,  //当天下单的时间
              time3: timestamp1,
              no_order:false
            })
          }
        });
      } else if (that.data.current == 1) {        //如果current为1，则请求已派单的数据
        wx.request({
          url: app.globalData.baseUrl + '/customerorder/do_orderSchedule',
          method: 'post',
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {            //以下数据处理同上
            //无数据时，显示无数据，直接返回
            if (res.data.data.length == 0) {
                that.setData({
                    no_order: true,
                    coupons: res.data.data,
                })
                return;

            }
            //有数据时
            var timestamp = [];
            var arr = [];
            for (var i = 0; i < res.data.data.length; i++) {
              timestamp.push(new Date(res.data.data[i].createTime));
            }
            for (var j = 0; j < timestamp.length; j++) {
                y = timestamp[j].getFullYear(),
                m = timestamp[j].getMonth() + 1,
                d = timestamp[j].getDate();
                arr.push((m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) + '号');
            }
            var timestamp1 = [];
            var arr1 = [];
            for (var m = 0; m < res.data.data.length; m++) {
              timestamp1.push(new Date(res.data.data[m].createTime).toDateString());
            }
            for (var k = 0; k < timestamp.length; k++) {
                arr1.push(timestamp[k].toTimeString().substr(0, 5));
            }
            var newtime = new Date().toDateString()
            that.setData({
              coupons: res.data.data,
              time: arr,
              newtime: newtime,
              time2: arr1,
              time3: timestamp1,
              no_order:false
            })
          }
        });
      }
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
    that.setData({
      current: wx.getStorageSync('current')
    })
    if(that.data.current == 0){
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/wait_schedule',
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {  //以下数据处理同上
            //无数据时，显示无数据，直接返回
            if (res.data.data.length == 0) {
                that.setData({
                    no_order: true,
                    coupons: res.data.data,
                })
                return;

            }
            //有数据时
          var timestamp = [];
          var arr = [];
          for (var i = 0; i < res.data.data.length; i++) {
            timestamp.push(new Date(res.data.data[i].createTime));
          }
            for (var j = 0; j < timestamp.length; j++) {
              y = timestamp[j].getFullYear(),
                m = timestamp[j].getMonth() + 1,
                d = timestamp[j].getDate();
              arr.push((m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) + '号');
            }
          var timestamp1 = [];
          var arr1 = [];
          for (var m = 0; m < res.data.data.length; m++) {
            timestamp1.push(new Date(res.data.data[m].createTime).toDateString());
          }
            for (var k = 0; k < timestamp.length; k++) {
              arr1.push(timestamp[k].toTimeString().substr(0, 5));
            }
          var newtime = new Date().toDateString()
          that.setData({
            coupons: res.data.data,
            time: arr,
            newtime: newtime,
            time2: arr1,
            time3: timestamp1,
            no_order:false
          })
        }
      });
    } else {
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/do_orderSchedule',
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res){  //以下数据处理同上
            //无数据时，显示无数据，直接返回
            if (res.data.data.length == 0) {
                that.setData({
                    no_order: true,
                    coupons: res.data.data,
                })
                return;

            }
            //有数据时
            var timestamp = [];
            var arr = [];
            for (var i = 0; i < res.data.data.length; i++) {
                timestamp.push(new Date(res.data.data[i].createTime));
            }
            for (var j = 0; j < timestamp.length; j++) {
                y = timestamp[j].getFullYear(),
                m = timestamp[j].getMonth() + 1,
                d = timestamp[j].getDate();
            arr.push((m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d)+'号');
            }
            var timestamp1 = [];
            var arr1 = [];
            for (var m = 0; m < res.data.data.length; m++) {
                timestamp1.push(new Date(res.data.data[m].createTime).toDateString());
            }
            for (var k = 0; k < timestamp.length; k++) {
                arr1.push(timestamp[k].toTimeString().substr(0, 5));
            }
            var newtime = new Date().toDateString()
            that.setData({
                coupons: res.data.data,   
                time:arr,
                newtime:newtime,
                time2:arr1,
                time3: timestamp1,
                no_order:false
            })
        }
      });
    }
  },
  // 点击列表跳转到派单详情页面
  clickDetails: function(e){
    var orderNo = e.currentTarget.dataset.orderno  //订单号
    app.orderNo = orderNo; 
    var orderStatus = e.currentTarget.dataset.orderstatus  //订单状态
    app.orderStatus = orderStatus;
    wx.navigateTo({
      url: '../details/details',
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