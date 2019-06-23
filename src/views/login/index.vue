<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form ref="form" :model="form">
          <el-form-item>
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 支持栅格布局 一共是24列-->
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="handleSendCode">获取验证码</el-button>
              <!-- <el-button v-show="!show" class="count">{{count}}s</el-button> -->
            </el-col>
          </el-form-item>
          <el-form-item>
            <!--给组件加class 会作用到它的根元素-->
            <el-button class="btn-login" type="primary" @click="handLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import '@/vendor/gt' // git.js会向全局window 暴露一个函数 initGeetest
export default {
  name: 'AppLogin',
  data() {
    return {
    //   show:'true',
    //   count:'',
    //   timer:null,
      form: {
        mobile: '18734800169',
        code: ''
      },
       captchaObj:null // 通过initGeetest得到的级验验证码对象
    }
  },
  methods: {
    handLogin() {
      axios({
        method:'POST',
        url:'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data:this.form
      }).then(res => {
        // Element 提供的提示文本信息组件 这也是组件使用的一种方式  大于等于200或者小于400的状态码都会进入这里
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 跳转到路由首页 建议使用name跳转 路由传参非常方便
        this.$router.push({
          name: 'home'
        })
      })
      .catch(err => {
        // console.log(err)
        if (err.response.status === 400) {
           this.$message.error('登录失败 手机号或验证码错误') // 小于等于400的http状态码都会进入这里
        }
      })
    },
    handleSendCode() {
        const { mobile } = this.form
        // 如果已经初始化了，就直接verify
        if (this.captchaObj) {
            //
          return this.captchaObj.verify()
        }
      axios({
          method:'GET',
          url:`http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
         const data = res.data.data;
         window.initGeetest({
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind' // 隐藏按钮式
        }, (captchaObj) => {
            this.captchaObj = captchaObj
            // 这里可以调用验证实例 captchaObj 的实例方法
            captchaObj.onReady(function() {
                // 只有ready了才能显示验证码
                captchaObj.verify();
            }).onSuccess(function() {
                const {
                 geetest_challenge: challenge,
                 geetest_seccode: seccode,
                 geetest_validate: validate } =
                captchaObj.getValidate()
                axios({
                   method: 'GET',
                   url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                   params: {
                      challenge,
                      validate,
                      seccode
                  }
                }).then(res => {
                    // 开启倒计时效果
                    // const time_count = 60;
                    // if (!this.timer) {
                    //     this.count = time_count
                    //     this.show = false
                    //     this.timer = setInterval(() => {
                    //         if (this.count > 0 && this.count <=time_count) {
                    //             this.count--;
                    //         } else {
                    //             this.show = true
                    //             clearInterval(this.timer)
                    //             this.timer = null
                    //         }
                    //     } , 1000)
                    // }
                })
            })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  //   background-color: skyblue;
  background-image: url(2.jpg);
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% 100%;
  overflow: hidden;
  .login-head {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    img {
      width: 250px;
    }
  }
}
.login-form-wrap {
  background-color: #fff;
  padding: 50px;
  border-radius: 50px;
  .btn-login {
    width: 100%;
  }
}
</style>
