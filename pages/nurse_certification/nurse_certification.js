// pages/order/order.js
const util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchtab: [  //头部nav三种状态选项
      {
        name: '未认证',
      },
      {
        name: '已认证',
      },
      {
        name: '已拒绝',
      }
    ],
    current: 0,
    coupons: [],
    show_o:false,
    show_t: false,
    norecord:false,  //无记录
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      token: wx.getStorageSync('token'),
      instId: wx.getStorageSync('instId')
    });
  },
  // 点击进行选项切换
  switchNav: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    that.setData({
      current: index
    },function(){
      if(that.data.current==0){   //未认证状态下数据请求
        wx.request({
          url: app.globalData.baseUrl + '/inststaff/all_by_certification_status/1',
          method: 'get',
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {
            console.log(res)
            //无数据时norecord:true,有数据时norecord:false
            that.setData({
                coupons: res.data.data,
                show_o: false,
                show_t: false,
                norecord: res.data.data.length == 0 ?true:false
            })
          }
        });
      } else if (that.data.current == 1) {      //已认证状态下数据请求
        wx.request({
          url: app.globalData.baseUrl + '/inststaff/all_by_certification_status/2',
          method: 'get',
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {
            console.log(res)
            that.setData({
              coupons: res.data.data,
              show_o: false,
              show_t: true,
              norecord: res.data.data.length == 0 ? true : false
            })
          }
        });
      } else if (that.data.current == 2) {            //已拒绝状态下数据请求
        wx.request({        
          url: app.globalData.baseUrl + '/inststaff/all_by_certification_status/3',
          method: 'get',
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {
            console.log(res)
            that.setData({
              coupons: res.data.data,
              show_o: true,
              show_t: false,
              norecord: res.data.data.length == 0 ? true : false
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
    var that=this;
    that.setData({   //页面刷新时默认为未认证进行数据请求
      current: 0,
      norecord:false
    })
    wx.request({
      url: app.globalData.baseUrl + '/inststaff/all_by_certification_status/1',
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        //无数据时norecord:true//有数据时norecord:false
        that.setData({
            coupons: res.data.data,
            norecord: res.data.data.length == 0 ? true : false
        })
      }
    });
  },        
  // 点击列表进入详情页
  clickDetails:function(e){
    var that=this;
    var certificationStatus = e.currentTarget.dataset.certificationstatus      //护工认证状态
    var id = e.currentTarget.dataset.id                                       //护工主键id
    var instName = e.currentTarget.dataset.instname                //护工所属机构名称
    var serviceInstName = e.currentTarget.dataset.serviceinstname            //护工服务机构名称
    var realName = e.currentTarget.dataset.realname               //护工姓名
    var idNo = e.currentTarget.dataset.idno                   //护工身份证
    var sex = e.currentTarget.dataset.sex                   //护工性别
    var birthday = e.currentTarget.dataset.birthday              //护工出生日期
    var phone = e.currentTarget.dataset.phone               //护工电话
    var address = e.currentTarget.dataset.address           //护工地址
    app.id = id;
    app.instName = instName;
    app.serviceInstName = serviceInstName;
    app.realName = realName;
    app.idNo = idNo;
    app.birthday = birthday;
    app.sex = sex;
    app.phone = phone;
    app.address = address;
    app.certificationStatus = certificationStatus;
    wx.navigateTo({
      url: '../nurse_Auth_info/nurse_Auth_info',
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
    wx.switchTab({
      url: '../mine/mine',
    })
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