// pages/Order details/Order details.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: '', //页面显示状态判断
        token: '', //token
        //样式修改
        isIphoneX: '', //是否iphonex
        bottom: '', //底部样式
        bottom_x: '', //底部样式
        bottom_6: '', //底部样式
        //订单状态
        orderNo: '', //订单号
        orderStatus: '', //订单状态
        timeindex: 0, //选定日期
        timearray: [], //自定义时间数组
        start_name: '请选择', //开始时间初始值
        nurse_name: '请选择', //护工名字初始值
        serviceStaffId: '', //服务护工
        starttime: '', //订单开始日期
        nurseid: '', //护工的id
        project: '', // 订单全部信息
        serviceStatus: '', //订单服务状态
        workTypeId: '', //工种id
        schedulingTypes: ['当前班次', '下个班次'], //班次数据
        schedulingType: '', //选中的班次  --两次派单时显示


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            token: wx.getStorageSync('token') //加载本地token到data
        });
    },
    // 选择结算比例
    bindTimeChange: function (e) {
        var that = this;
        var nurseid = that.data.nurse_id[e.detail.value] //护工的id
        console.log(e.detail.value, nurseid)
        that.setData({
            timeindex: e.detail.value,
            start_name: that.data.nurse_bl[e.detail.value],
            nurseid: nurseid
        })
    },
    //   选择班次
    bindSchedulingTypeChange: function (e) {

        console.log(e.detail.value)
        this.setData({
            schedulingType: Number(e.detail.value)
        })
        console.log(this.data)
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
        wx.getSystemInfo({ //这里做机型判断
            success: function (res) {
                console.log(res)
                if (res.model.search('iPhone X') != -1) { //如果为iPhonex底部做适配
                    console.log(2)
                    that.setData({
                        isIphoneX: true,
                        bottom: '68rpx', //样式修改
                        bottom_x: '320rpx'
                    })
                } else {
                    that.setData({
                        isIphoneX: false,
                        bottom: '0rpx',
                        bottom_6: '178rpx'
                    })
                }
            }
        })
        var orderNo = app.orderNo; //订单号
        var orderStatus = app.orderStatus; //订单状态
        that.setData({
            orderNo: orderNo,
            orderStatus: orderStatus,
        })
        // 请求订单详情信息
        wx.request({
            url: app.globalData.baseUrl + '/customerorder/detail/' + that.data.orderNo,
            method: 'get',
            header: {
                'content-Type': 'application/x-www-form-urlencoded',
                'auth-token': that.data.token
            },
            success: function (res) {
                console.log(res)
                // 返回数据护工姓名为null且本地没有护工姓名字段且本地没有服务护工id字段
                if (res.data.data[0].staffName == null && !wx.getStorageSync('nurse_name') && !wx.getStorageSync('serviceStaffId')) {
                    that.setData({
                        nurse_name: that.data.nurse_name,
                    })
                }
                // 返回数据护工姓名不为null且本地没有护工姓名字段且本地没有服务护工id字段
                else if (res.data.data[0].staffName !== null && !wx.getStorageSync('nurse_name') && !wx.getStorageSync('serviceStaffId')) {
                    that.setData({
                        nurse_name: res.data.data[0].staffName,
                        serviceStaffId: res.data.data[0].serviceStaffId,
                    })
                }
                // 本地存在护工姓名字段且存在服务护工id字段
                else if (wx.getStorageSync('nurse_name') && wx.getStorageSync('serviceStaffId')) {
                    that.setData({
                        nurse_name: wx.getStorageSync('nurse_name'),
                        serviceStaffId: wx.getStorageSync('serviceStaffId'),
                    })
                }
                timestamp1 = new Date(res.data.data[0].serviceStartTime); //服务开始时间处理
                    y = timestamp1.getFullYear(),
                    m = timestamp1.getMonth() + 1,
                    d = timestamp1.getDate();
                // 转换成时间格式存在starttime数组里
                var starttime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp1.toTimeString().substr(0, 8);
                timestamp2 = new Date(res.data.data[0].scheduleServiceEndTime); //服务开始时间处理
                    y = timestamp2.getFullYear(),
                    m = timestamp2.getMonth() + 1,
                    d = timestamp2.getDate();
                // 转换成时间格式存在starttime数组里
                var endtime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp2.toTimeString().substr(0, 8);
                that.setData({
                    project: res.data.data[0],
                    starttime: starttime,
                    endtime: endtime,
                    serviceStatus: res.data.data[0].serviceStatus,
                    workTypeId: res.data.data[0].workTypeId //工种id
                }, function () {
                    //获得工种id来请求结算比例
                    wx.request({
                        url: app.globalData.baseUrl + '/instworktypesettle/list_all/' + that.data.workTypeId,
                        method: 'get',
                        header: {
                            'content-Type': 'application/x-www-form-urlencoded',
                            'auth-token': that.data.token
                        },
                        success: function (res) {
                            console.log(res)
                            var nurse_bl = []; //自定义结算比例数组
                            var nurse_id = []; //自定义结算比例id数组
                            for (var i = 0; i < res.data.data.length; i++) {
                                nurse_bl.push(res.data.data[i].settleRatio) //把返回的数据（结算比例）循环出来放到nurse_bl数组
                            };
                            for (var j = 0; j < res.data.data.length; j++) { //把返回的数据（结算比例id）循环出来放到nurse_id数组
                                nurse_id.push(res.data.data[j].id)
                            };
                            that.setData({
                                timearray: res.data.data,
                                nurse_bl: nurse_bl,
                                nurse_id: nurse_id
                            })
                            console.log(that.data)
                        }
                    });
                })
            }
        });
    },
    // 点击跳转到选择护工的页面
    choose_nurse: function (e) {
        var that = this;
        var orderNo = that.data.orderNo //订单号
        app.orderNo = orderNo;
        var serviceStaffId = that.data.serviceStaffId //护工服务id
        app.serviceStaffId = serviceStaffId;
        if (that.data.serviceStatus == null) { //如果服务状态为空则跳转到nurse_list_one页面来选择护工
            wx.navigateTo({
                url: '../nurse_list_one/nurse_list_one',
            })
        } else if (that.data.serviceStatus == 1) { //如果服务状态为1则跳转到nurse_list_two页面来更换护工
            wx.navigateTo({
                url: '../nurse_list_two/nurse_list_two',
            })
        }
    },
    // 确认派单请求
    regist: function () {
        var that = this;
        if (that)
            var data = that.data.orderStatus == 1 ? {
                orderNo: that.data.orderNo,
                serviceStaffId: that.data.serviceStaffId,
                workTypeSettleId: that.data.nurseid
            } : {
                orderNo: that.data.orderNo,
                serviceStaffId: that.data.serviceStaffId,
                workTypeSettleId: that.data.nurseid,
                schedulingType: that.data.schedulingType
            }
        for (const key in data) {
            if (!data[key]) {
                if (key == 'orderNo') continue;
                if(data[key]===0) continue;
                wx.showToast({
                    title: '请完善服务信息，再派单',
                    icon: 'none',
                    image: '',
                    duration: 1500,
                    mask: false,
                    success: (result) => {
                        console.log(result)
                        let selQuery = wx.createSelectorQuery();
                        let sel = selQuery.select('.' + key);
                        
                        //当前显示区viewPort,当前目标sel,判断sel,在viewPort内
                        let viewPort = selQuery.selectViewport();
                        let bottom;
                        viewPort.fields({
                            size: true,
                            rect: true,
                            scrollOffset:true
                            
                        }, function (res) {
                            bottom = res.height;
                        }).exec()

                        sel.boundingClientRect(function (rect) {
                            if (rect.top < 0 || rect.bottom<0||rect.bottom + 30 > bottom ) 
                            that.pageScrollTo({
                                scrollTop: rect.top,
                                duration: 300
                            })
                        }).exec()
                    
                        


                    },
                    fail: () => {},
                    complete: () => {}
                });
                return;

            }
        }
      wx.setStorageSync('current', 1);
      if (that.data.orderStatus == 1) {
        wx.request({
          url: app.globalData.baseUrl + '/customerorderschedule/mapp_add',
          method: 'post',
          data: data,
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == 200) {  //派单成功
              wx.showToast({
                title: '派单成功',
                icon: 'success',
                duration: 1500,
                mask: true
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 1500)
            } else {  //派单失败
              wx.showToast({
                title: res.data.errorMsg,
                icon: 'none',
                duration: 2500
              })
            }
          }
        });
      } else {
        wx.request({
          url: app.globalData.baseUrl + '/customerorderschedule/mapp_add_again',
          method: 'post',
          data: data,
          header: {
            'content-Type': 'application/x-www-form-urlencoded',
            'auth-token': that.data.token
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == 200) {  //派单成功
              wx.showToast({
                title: '派单成功',
                icon: 'success',
                duration: 1500,
                mask: true
              })
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 1500)
            } else {  //派单失败
              wx.showToast({
                title: res.data.errorMsg,
                icon: 'none',
                duration: 2500
              })
            }
          }
        });
      }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        wx.removeStorage({
            key: 'serviceStaffId'
        })
        wx.removeStorage({
            key: 'nurse_name',
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