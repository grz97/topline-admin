<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form">
        <!--
          表单验证：
          rules: 配置验证规则
          将需要验证的字段通过 prop 属性配置到el-form-item组件上
          ref: 获取表单组件 可以手动调用表单组件的验证方法
        -->
        <el-form ref="ruleForm" :model="form" :rules="rules">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <!-- 支持栅格布局 一共是24列-->
            <el-col :span="10">
              <el-input v-model="form.code" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
              <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
              <el-button
                @click="handleSendCode"
                :disabled="!!codeTimer || codeLoading"
              >{{ codeTimer ? `剩余${codeSecons}秒` : '获取验证码' }}</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree"></el-checkbox>
            <span>
              我已阅读并同意
              <a href="#">用户协议</a>和
              <a href="#">隐私条款</a>
            </span>
          </el-form-item>
          <el-form-item>
            <!--给组件加class 会作用到它的根元素-->
            <el-button
              class="btn-login"
              type="primary"
              @click="handLogin"
              :loading="loginLoading"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
// import axios from "axios";
import "@/vendor/gt"; // git.js会向全局window 暴露一个函数 initGeetest
const initCodeSeconds = 60;
export default {
  name: "AppLogin",
  data() {
    return {
      //   show:'true',
      //   count:'',
      //   timer:null,
      form: {
        // 表单数据
        mobile: "",
        code: "",
        agree: "" // 是否同意用户协议
      },
      loginLoading: false, // 登录按钮的loading 状态
      rules: {
        // 表单验证规则
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度为11个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 6, max: 6, message: "长度为6个字符", trigger: "blur" }
        ],
        agree: [
          { required: true, message: "请同意用户协议", trigger: "change" },
          // pattern 正则表达式
          { pattern: /true/, message: "请同意用户协议", trigger: "change" }
        ]
      },
      captchaObj: null, // 通过initGeetest得到的级验验证码对象
      codeSecons: initCodeSeconds, // 倒计时的时间
      codeTimer: null, // 倒计时定时器
      sendMobile: "", // 保存初始化验证码之后发送短信的手机号
      codeLoading: false
    };
  },
  methods: {
    handLogin() {
      //  表单组件有一个方法 validatae 可以用来获取当前表单的验证状态
      this.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return;
        }
        this.submitLogin();
      });
    },
    submitLogin() {
      // 登录
      this.loginLoading = true; // 登录加载
      this.$http({
        method: "POST",
        url: "/authorizations",
        data: this.form // form表单
      })
        .then(res => {
          // 登录成功 将接口返回的用户信息数据放到本地存储
          // window.localStorage.setItem('user_info',JSON.stringify(res.data.data))
          window.localStorage.setItem('user_info', JSON.stringify(res.data.data))
          // Element 提供的提示文本信息组件 这也是组件使用的一种方式  大于等于200或者小于400的状态码都会进入这里
          this.$message({
            message: "登录成功",
            type: "success"
          });
          this.loginLoading = false;
          // 跳转到路由首页 建议使用name跳转 路由传参非常方便
          this.$router.push({
            name: "home"
          });
        })
        .catch(err => {
          // console.log(err)
          if (err.response.status === 400) {
            this.$message.error("登录失败 手机号或验证码错误"); // 小于等于400的http状态码都会进入这里
          }
          this.loginLoading = false;
        });
    },
    handleSendCode() {
      // 验证手机号是否有效
      this.$refs["ruleForm"].validateField("mobile", errorMessage => {
        if (errorMessage.trim().length > 0) {
          return;
        }
        // 手机号码验证通过
        // 验证是否有验证码插件对象
        if (this.captchaObj) {
          // 手机号码有效，初始化验证码插件
          // this.showGeetest()
          // 如果用户输入的手机号和之前初始化的验证码手机号不一致，就基于当前手机号码重新初始化
          // 否则，直接 verify 显示
          if (this.form.mobile !== this.sendMobile) {
            // 手机号码发送改变，重新初始化验证码插件
            // 重新初始化之前，将原来的验证码插件 DOM 删除
            document.body.removeChild(document.querySelector(".geetest_panel"));
            // 重新初始化
            this.showGeetest();
          } else {
            // 一致，直接 verify
            this.captchaObj.verify();
          }
        } else {
          // 这里是第1次的初始化验证码插件
          this.showGeetest();
        }
      });
    },
    showGeetest() {
      // const { mobile } = this.form;
      // // 如果已经初始化了，就直接verify
      // if (this.captchaObj) {
      //   //
      //   return this.captchaObj.verify();
      // }
      // 初始化验证码期间，禁用按钮的点击状态
      this.codeLoading = true
      this.$http({
        method: "GET",
        url: `/captchas/${
          this.form.mobile
        }`
      }).then(res => {
        const data = res.data.data;
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: "bind" // 隐藏按钮式
          },
          captchaObj => {
            this.captchaObj = captchaObj;
            // 这里可以调用验证实例 captchaObj 的实例方法
            captchaObj
              .onReady(() => {
                // 只有ready了才能显示验证码
                this.sendMobile = this.form.mobile;
                captchaObj.verify();
                // 验证码初始好了，让‘获取验证码’按钮可点击
                this.codeLoading = false
              })
              .onSuccess(() => {
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate();
                // 调用 获取短信验证码接口（级验 API2）接口 发送短信
                this.$http({
                  method: "GET",
                  url: `/sms/codes/${
                    this.form.mobile
                  }`,
                  params: {
                    // 专门用来传递 query 查询字符串参数
                    challenge,
                    validate,
                    seccode
                  }
                }).then(res => {
                  // 发送短信之后，开始倒计时
                  this.codeCountDown();
                });
              });
          }
        );
      });
    },
    codeCountDown() {
      this.codeTimer = window.setInterval(() => {
        this.codeSecons--;
        if (this.codeSecons <= 0) {
          this.codeSecons = initCodeSeconds; // 让倒计时时间回到初始状态
          window.clearInterval(this.codeTimer); // 清除倒计时
          this.codeTimer = null; // 清除倒计时定时器的标志
        }
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  //   background-color: skyblue;
  background-image: url(./2.jpg);
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
