var app = getApp();
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   *   isCode ： 是否为手机验证码登录
   *   isAgree ： 是否同意协议
   *   loginType : 登录方式为密码登录还是手机号登录
   */
  data: {
    /**
     *  dialog 
     *  isDialog : 是否显示
     *  isGetnumber : 是否获取到手机号
     *  phone ： 获取到的手机号码
     *  isShouquan : 是否授权
     */
    dialog: {
      isDialog: false,
    },
    inter: {
      loginUrl: 'newHRWX/saveLogin.do',
      getPhoneCodeUrl: 'smartroutine/code.do'
    },
    userPhone: '',
    userCode: '',
    userInputCode: '',
    isCode: true,
    userPassword: '',
    appicon: '',
    isAgree: true,
    loginType: '密码登录',
    //  4.23修改  登陆者身份
    countryCodes: ["求职者", "HR"],
    countryCodeIndex: 0,
    chooseCode: '求职者',
    //  能否点击获取验证码
    is_get_code : true,
    get_code_btn_text : '获取验证码',
    code_index : 50,
    code_flag : '',
  },
  /**
   *   方法： 是否同意发才乐协议
   *     login ： 登录
   *     getPhone : 更新手机号
   *     getCode ：更新验证码
   *     getPassword ： 更新密码
   *     changeType : 更改登录方式
   *     getPhoneCode : 获取验证码
   *     bindCountryChange : 修改登录者身份
   */
  bindCountryCodeChange: function (e) {
    var country = this.data.countryCodes;
    this.setData({
      countryCodeIndex: e.detail.value,
      chooseCode: country[e.detail.value],
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  getPhone: function (e) {
    this.setData({
      userPhone: e.detail.value
    })
    //  手机号那一栏动了，就得将验证码设置为空
    if (this.data.userInputCode != ""){
      this.setData({
        userInputCode : "",
        userCode: ""
      })
    }
  },
  getCode: function (e) {
    this.setData({
      userInputCode: e.detail.value
    })
  },
  getPassword: function (e) {
    this.setData({
      userPassword: e.detail.value
    })
  },
  changeType: function () {
    this.setData({
      isCode: !this.data.isCode,
      loginType: this.data.loginType == '密码登录' ? '验证码登录' : '密码登录'
    })
  },
  getPhoneCode: function () {
    if (!this.data.is_get_code){
        return;
    }
    var that = this, phone = this.data.userPhone;
    if (phone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      });
      return;
    };
    var reg = /^1[123457890]\d{9}$/;
    if (!reg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      });
      return;
    };
    var data = {
      mobile: phone
    }
    app.func.req(that.data.inter.getPhoneCodeUrl, data, function (ret) {
      if (ret.data.code == 0 || ret.data.code == '0') {
        wx.showToast({
          title: '验证码发送成功',
        });
        var flag = setInterval(that.startSecond, 1000);
        that.setData({
          userCode: ret.data.yzm,
          is_get_code : false,
          code_flag: flag,
        });
        //  设置60s以后再发
      } else {
        wx.showToast({
          title: '验证码发送失败',
        });
      }
    })
  },
  /**
   * fnloofxieyi : 查看协议
   */
  fnloofxieyi : function(){
     this.setData({
       ["dialog.isDialog"]: true
     });
  },
  /**
   *  resizeUser 跳转到注册页面
   */
  resizeUser: function () {
    wx.navigateTo({
      url: '../user/pages/resigize/resigize',
    })
  },
  //  登录逻辑：点击登录获取微信个人信息，点击登录将获取到的微信信息连同用户名密码之类的全部交给周帅，登录可以一键登录，一键登录直接判断id往上传
  login: function () {
    if (!this.data.isAgree){
        wx.showToast({
          title: '需同意《发才乐用户协议》',
          icon : 'none',
          mask : true,
          duration : 1000,
        });
        return;
    }
    var that = this, data;
    //  获取用户signature用于匹配用户信息
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         success() {
    //           // 用户已经同意小程序使用获取信息功能，后续调用 wx.getUserInfo 接口不会弹窗询问

    //         }
    //       })
    //     }
    //   }
    // })
    //  判断手机号
    if (that.data.userPhone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    };
    var reg = /^1[123457890]\d{9}$/;
    if (!reg.test(that.data.userPhone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1000
      })
    };
    // LOGIN_TYPE 登录类型 测试类型(0的时候为求职者登录，1,2为hr登录)
    //  判断手机号，如果是18705423198的，则直接默认密码为11111111
    // if (that.data.userPhone == '18705423198'){
    //     that.setData({
    //         isCode : false,  //  密码登录
    //         userPassword : 11111111,  // 写死的密码
    //     })
    // }
    var loginerType = that.data.countryCodeIndex;
    if (that.data.isCode == true) {
      if (that.data.userInputCode == '') {
        wx.showToast({
          title: '验证码不能为空',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      if (that.data.userInputCode != that.data.userCode) {
        wx.showToast({
          title: '验证码错误',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      if (loginerType == 0 || loginerType == '0') {
        //  这是求职者
        data = {
          PHONE: that.data.userPhone,
          yzm: that.data.userCode,
          fs: 'dx',
          js: 'qzz'
        };
      } else if (loginerType == 1 || loginerType == '1') {
        //  这是企业
        data = {
          PHONE: that.data.userPhone,
          yzm: that.data.userCode,
          fs: 'dx',
          js: 'qy',
        };
      } else {
        data = {
          PHONE: that.data.userPhone,
          yzm: that.data.userCode,
          fs: 'dx',
          js: 'hr',
        };
      }
    } else {
      var password = that.data.userPassword;
      if (password == '') {
        wx.showToast({
          title: '密码不能为空',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      if (loginerType == 0 || loginerType == '0') {
        //  这是求职者
        data = {
          PHONE: that.data.userPhone,
          pwd: that.data.userPassword,
          fs: 'mm',
          js: 'qzz'
        };
      } else if (loginerType == 1 || loginerType == '1') {
        //  这是企业
        data = {
          PHONE: that.data.userPhone,
          pwd: that.data.userPassword,
          fs: 'mm',
          js: 'qy',
        };
      } else {
        data = {
          PHONE: that.data.userPhone,
          pwd: that.data.userPassword,
          fs: 'mm',
          js: 'hr',
        };
      }
    };
    // var loginerType = 0;
    // var data = {
    //   phone: that.data.userPhone,
    //   pwd: that.data.userPassword,
    //   LOGIN_TYPE: '1',
    //   fs: 'mm'
    // };
    app.func.req(that.data.inter.loginUrl, data, function (ret) {
      //  判断ret的type是求职者还是hr LOGIN_TYPE -- 1 HR  LOGIN_TYPE -- 2 求职者
      if (ret.data.code == 0 || ret.data.code == '0') {
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000,
          mask: true
        });
        if (ret.data.data.LOGIN_TYPE == 2 || ret.data.data.LOGIN_TYPE == '2') {
          //  求职者
          try {
            //  登录状态
            // wx.setStorage({
            //   key: 'isLogin',
            //   data: true,
            // })
            wx.setStorageSync('isLogin', true);
            //  登录身份
            // wx.setStorage({
            //   key: 'loginerType',
            //   data: 2,
            // })
            wx.setStorageSync('loginerType', 2);
            //  获取成功
            // wx.setStorage({
            //   key: 'login_id',
            //   data: ret.data.data.LOGIN_ID,
            // })
            wx.setStorageSync('login_id', ret.data.data.LOGIN_ID);
            // wx.setStorage({
            //   key: 'userPhone',
            //   data: that.data.userPhone,
            // })
            /*****   5-28 修改登录接口  *****/
            //  是否已完善简历
            // wx.setStorage({
            //   key: 'isResume',
            //   data: ret.data.data.SEEKER_NSTATUS,
            // })
            wx.setStorageSync('isResume', ret.data.data.SEEKER_NSTATUS);
            wx.setStorageSync('userPhone', that.data.userPhone);
            app.isLoginHr = true;
            setTimeout(function () {
              wx.redirectTo({
                url: '../user/pages/hr/hr',
              })
            }, 1000);
          } catch (e) {
            console.log('出错了');
          }
        }
        else if (ret.data.data.LOGIN_TYPE == 1 || ret.data.data.LOGIN_TYPE == '1'){
            //  将数据保存到本地
            try {
              //  登录状态
              // wx.setStorage({
              //   key: 'isLogin',
              //   data: true,
              // })
              wx.setStorageSync('isLogin', true);
              //  登录身份
              // wx.setStorage({
              //   key: 'loginerType',
              //   data: 1,
              // })
              wx.setStorageSync('loginerType', 1);
              //  获取成功
              // wx.setStorage({
              //   key: 'login_id',
              //   data: ret.data.data.LOGIN_ID,
              // })
              wx.setStorageSync('login_id', ret.data.data.LOGIN_ID);
              // wx.setStorage({
              //   key: 'userPhone',
              //   data: that.data.userPhone,
              // })
              wx.setStorageSync('userPhone', that.data.userPhone);
              //  未分享次数
              app.login_id = ret.data.data.LOGIN_ID;
              app.isLoginHr = true;
              setTimeout(function () {
                wx.redirectTo({
                  url: '../hr/pages/hr/hr',
                })
              }, 1000);
            } catch (e) {
              console.log('保存错误' + e);
            }    
        }else{
          //  账号有误
          wx.showToast({
            title: '登录失败',
          })
        }
      } else if (ret.data.code == 2 || ret.data.code == '2') {
        wx.showToast({
          title: ret.data.message,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      } else {
        wx.showToast({
          title: ret.data.message,
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  /**
   *  dialog 方法
   *  _cancelEvent ： 不同意
   *  _confirmEvent ： 同意
   */
  _cancelEvent: function () {
    this.setData({
      dialog: {
        isDialog: false,
        isAgree: false,
      },
      isAgree: false,
    })
  },
  _confirmEvent: function () {
    this.setData({
      dialog: {
        isDialog: false,
        isAgree: true,
      },
      isAgree: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var width = wx.getSystemInfoSync().windowWidth;
    if (width > 1000) {
      this.setData({
        appicon: '../hr/images/144.png'
      })
    } else {
      this.setData({
        appicon: '../hr/images/108.png'
      })
    };
  },
  /**
   *   获取验证码以后倒计时
   */
  startSecond : function(){
    if (this.data.code_index == 0) {
      var flag = this.data.code_flag;
      clearInterval(flag);
      this.setData({
        is_get_code: true,
        get_code_btn_text: '获取验证码',
        code_index: 30,
        code_flag: '',
      });
      return;
    }else{
      this.setData({
        code_index: this.data.code_index - 1,
        get_code_btn_text: this.data.code_index + 's后重发'
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },
  getPhoneNumber: function (e) {
    console.log(e);
  }
})