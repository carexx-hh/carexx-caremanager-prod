// pages/Order details/Order details.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    project:'',
    companyindex:0,
    document_type: '请选择',  //凭证类型
    affiliated_company: '请选择',  //所属公司
    type:['收据','发票']
  },
  // 选择凭证类型 0为收据（id为1） 1为发票（id为2）
  bindtypeChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.detail.value==0){
      this.setData({
        type_id: 1,
        document_type:'收据'
      })
    } else if (e.detail.value == 1) {
      this.setData({
        type_id: 2,
        document_type: '发票'
      })
    }
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
    var orderStatus = app.orderStatus;
    that.setData({
      orderNo: orderNo,
      orderStatus: orderStatus
    },function(){
      // 查询订单详情
      wx.request({
        url: app.globalData.baseUrl + '/customerorder/detail/' + that.data.orderNo,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          console.log(res)
          var newdata = new Date(); //获取最新日期
          var newdddatas = ((newdata - res.data.data[0].serviceStartTime) / 86400000).toFixed(1);
          // 服务天数
          var serviceDays = ((res.data.data[0].orderServiceEndTime - res.data.data[0].serviceStartTime) / 86400000).toFixed(1);
          timestamp1=new Date(res.data.data[0].serviceStartTime);
            y = timestamp1.getFullYear(),
            m = timestamp1.getMonth() + 1,
            d = timestamp1.getDate();
            // 开始日期
          var starttime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp1.toTimeString().substr(0, 8);
          timestamp2 = new Date(res.data.data[0].orderServiceEndTime);
            k = timestamp2.getFullYear(),
            f = timestamp2.getMonth() + 1,
            w = timestamp2.getDate();
            // 结束日期
          var endtime = k + "-" + (f < 10 ? "0" + f : f) + "-" + (w < 10 ? "0" + w : w) + " " + timestamp2.toTimeString().substr(0, 8);
          if (res.data.data[0].proofType==1){   //判断凭证类型
            that.setData({
              number: res.data.data[0].receiptNo  //收据
            }) 
          } else if (res.data.data[0].proofType == 2){
            that.setData({
              number: res.data.data[0].invoiceNo   //发票
            })
          }else{
            that.setData({
              number:'无'
            })
          }
          that.setData({
            project:res.data.data[0],
            starttime: starttime,
            endtime: endtime,
            serviceDays: serviceDays,
            newdddatas: newdddatas
          })
        }
      });
      // 根据订单号查询日期
      wx.request({
        url: app.globalData.baseUrl + '/customerorderschedule/all_schedule/' + that.data.orderNo,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res) {
          console.log(res)
          var timestamp3 = [];
          for (var i = 0; i < res.data.data.length; i++) {
            timestamp3.push(new Date(res.data.data[i].serviceStartTime));
            var arr1 = [];
            for (var j = 0; j < timestamp3.length; j++) { //开始日期
                y = timestamp3[j].getFullYear(),
                m = timestamp3[j].getMonth() + 1,
                d = timestamp3[j].getDate();
                arr1.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp3[j].toTimeString().substr(0, 8));
            }
          }
          var timestamp4 = [];
          for (var i = 0; i < res.data.data.length; i++) {
            timestamp4.push(new Date(res.data.data[i].serviceEndTime));
            var arr2 = [];
            for (var j = 0; j < timestamp4.length; j++) {  //结束日期
              y = timestamp4[j].getFullYear(),
                m = timestamp4[j].getMonth() + 1,
                d = timestamp4[j].getDate();
              arr2.push(y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + timestamp4[j].toTimeString().substr(0, 8));
            }
          }
          that.setData({
            serviceinfo:res.data.data,
            arr1:arr1,
            arr2:arr2
          })
        }
      });
    })
    if (that.data.orderStatus==5){  //如果订单状态为5时查询返回的凭证信息  5已支付未填写凭证信息    6已完成（已填写凭证信息）
    wx.request({
      url: app.globalData.baseUrl + '/careinstsys/list_all/' + wx.getStorageSync('instId'),
      method: 'get',
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        console.log(res)
        var companyarray = [];
        var companyid = [];
        for (var i = 0; i < res.data.data.length; i++) {
          companyarray.push(res.data.data[i].instSysName)   //所属公司
        };
        for (var j = 0; j < res.data.data.length; j++) {
          companyid.push(res.data.data[j].id)            //所属公司id
        };
        console.log(companyarray)
        console.log(companyid)
        that.setData({
          companyarray: companyarray,
          companyid: companyid
        })
      }
    });
    } 
  },
  // 选择所属公司
  bindcompanyChange: function (e) {
    var that = this;
    var company_id = that.data.companyid[e.detail.value]
    console.log(e.detail.value, company_id)
    that.setData({
      companyindex: e.detail.value,
      affiliated_company: that.data.companyarray[e.detail.value],
      company_id: company_id
    })
  },
  // 填写凭证号
  numberInput:function(e){
    this.setData({
      voucher_no:e.detail.value
    })
  },
  // 填写签订单人
  signInput: function (e) {
    this.setData({
      singles: e.detail.value
    })
  },
  // 填写完之后保存提交
  click_Save:function(){
    var that=this;
    wx.request({
      url: app.globalData.baseUrl + '/customerorder/confirmcompleted',
      method: 'post',
      data:{
        instSysId: that.data.company_id,   //机构id
        proofType: that.data.type_id,      //凭证类型id
        proofNo: that.data.voucher_no,      //凭证号
        signingPerson: that.data.singles,     //签单人
        orderNo: that.data.orderNo       //订单号
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'auth-token': that.data.token
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.onShow();
          wx.showToast({
            title: '已保存',
            icon: 'success',
            duration: 300,
          })
        } else {
          wx.showToast({
            title: '修改失败',
            duration: 1500,
          })
        }
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