var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:'',
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
    var that=this;
    var id = app.id;
    that.setData({
      id: id,
    }, function () {
      //进行护工的信息请求
      wx.request({
        url: app.globalData.baseUrl + '/inststaff/get_staffId/' + that.data.id,
        method: 'get',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        success: function (res){
          that.setData({
            coupons: res.data.data
          })
        }
      });
    })
  },
  // 修改完信息进行提交保存
  formSubmit: function (e) {
    var that = this;  
    var realName = e.detail.value.input_name;   //姓名
    var phone = e.detail.value.input_phone;         //电话
    var idNo = e.detail.value.input_idNo;           //身份证
    var address = e.detail.value.input_address;      //地址
    var instName = e.detail.value.input_instName;      //所属机构
    var serviceInstName = e.detail.value.input_serviceInstName;    //服务机构
    var sex = e.detail.value.input_sex;     //性别
    if (realName==''){
      that.setData({
        realName: that.data.coupons.realName
      })
    } else if (realName !== ''){
      that.setData({
        realName: e.detail.value.input_name
      })
    };
    // 
    if (address == '') {
      that.setData({
        address: that.data.coupons.address
      })
    } else if (address !== '') {
      that.setData({
        address: e.detail.value.input_address
      })
    };
    // 
    if (instName == '') {
      that.setData({
        instName: that.data.coupons.instName
      })
    } else if (realName !== '') {
      that.setData({
        instName: e.detail.value.input_instName
      })
    };
    // 以下if语句判断编辑信息时修改的具体内容
    if (serviceInstName == '') {
      that.setData({
        serviceInstName: that.data.coupons.serviceInstName
      })
    } else if (realName !== '') {
      that.setData({
        serviceInstName: e.detail.value.input_serviceInstName
      })
    };
    // 
    if (phone == '') {
      that.setData({
        phone: that.data.coupons.phone
      })
    } else if (phone !== '') {
      that.setData({
        phone: e.detail.value.input_phone
      })
    };
    // 
    if (idNo == '') {
      that.setData({
        idNo: that.data.coupons.idNo	
      })
    } else if (idNo !== ''){
      that.setData({
        idNo: e.detail.value.input_idNo	
      })
    };
    // 
    if (that.data.coupons.entryDate == '' || that.data.coupons.entryDate == null) {
      that.setData({
        entryDate:''
      })
    } else {
      that.setData({
        entryDate: that.data.coupons.entryDate
      })
    };
    if (that.data.coupons.leaveDate == '' || that.data.coupons.leaveDate == null) {
      that.setData({
        leaveDate:''
      })
    } else {
      that.setData({
        leaveDate: that.data.coupons.leaveDate
      })
    };
    // 
    if(sex==''){
      that.setData({
        sex: that.data.coupons.sex	
      })
    }else if(sex=='男'){
      that.setData({
        sex:1
      })
    }else if(sex=='女'){
      that.setData({
        sex: 2
      })
    }
    //提交请求保存修改
    wx.request({
        url: app.globalData.baseUrl + '/inststaff/modify',
        method: 'POST',
        header: {
          'content-Type': 'application/x-www-form-urlencoded',
          'auth-token': that.data.token
        },
        data: {
          id:that.data.id,
          realName:that.data.realName,
          idNo: that.data.idNo,
          address: that.data.address,
          phone: that.data.phone,
          instName: that.data.instName,
          serviceInstId: that.data.coupons.serviceInstId,
          sex:that.data.sex,
          photo:'',
          personType: that.data.coupons.personType, //人员性质
          jobStatus: that.data.coupons.jobStatus,   //工作状态
          entryDate: that.data.entryDate,      //入职日期
          leaveDate: that.data.leaveDate,       //离职日期
        },
        success: function (res) {
          console.log(res)
          if(res.data.code==200){
            that.onShow();
            wx.showToast({
              title: '已保存',
              icon:'success',
              duration:300,
              success(res){
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../nurse_information/nurse_information',
                  })
                },500);
              }
            })
          }else{
            wx.showToast({
              title: '修改失败',
              duration: 1500,
            })
          }
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