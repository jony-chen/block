<template>
<div>
  <div class="wrap">
    <h3>注册</h3>
    <el-form
      class="registerForm"
      :model="registerForm"
      :rules="formRules"
      ref="registerFormRef"
      label-position="top">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="registerForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkpass">
        <el-input v-model="registerForm.checkpass" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机验证码" prop="verificationCode">
        <el-input v-model="registerForm.verificationCode">
          <template v-slot:append>
            <el-button v-if="registerForm.checkCode" type="primary" @click="getcheckCode">获取验证码</el-button>
            <div v-else>{{ registerForm.count }}</div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="contenttext">
        <el-input v-model="registerForm.contenttext"></el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" size="large" @click="register">创建账户</el-button>
        <el-button size="large" @click="resetRegisterForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="wrap">
    <h3>登录</h3>
    <el-form
      class="registerForm"
      :model="loginForm"
      :rules="formRules"
      ref="loginFormRef"
      label-position="top">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="loginForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" size="large" @click="login">登录</el-button>
        <el-button size="large" @click="resetLoginForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="wrap">
    <h3>邮箱获取验证码</h3>
    <el-form
      class="registerForm"
      :model="emailForm"
      :rules="formRules"  
      ref="emailFormRef"
      label-position="top">
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="emailForm.email"></el-input>
    </el-form-item>
    <el-form-item label="邮箱验证码" prop="verificationEmailCode">
        <el-input v-model="emailForm.verificationEmailCode">
          <template v-slot:append>
            <el-button v-if="emailForm.checkCode" type="primary" @click="getEmailcheckCode('check')">获取验证码</el-button>
            <div v-else>{{ emailForm.count }}</div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" size="large" @click="checkemailcode">校验 / 登录</el-button>
        <el-button size="large" @click="resetEmailForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="wrap">
    <h3>邮箱绑定</h3>
    <el-form
      class="registerForm"
      :model="bindForm"
      :rules="formRules"  
      ref="bindFormRef"
      label-position="top">
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="bindForm.phone"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="bindForm.email"></el-input>
    </el-form-item>
    <el-form-item label="邮箱验证码" prop="verificationEmailCode">
        <el-input v-model="bindForm.verificationEmailCode">
          <template v-slot:append>
            <el-button v-if="bindForm.checkCode" type="primary" @click="getEmailcheckCode('bind')">获取验证码</el-button>
            <div v-else>{{ bindForm.count }}</div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" size="large" @click="bind">绑定</el-button>
        <el-button size="large" @click="unbind">解绑</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- <wxlogin class="login" :appid="wxappid" :scope="'snsapi_login'" :theme="'black'" :redirect_uri= "'https://www.3dblockstar.com/#/home'"
    :href="'data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsKICBkaXNwbGF5OiBub25lOwp9Ci5pbXBvd2VyQm94IC5xcmNvZGUgewogIHdpZHRoOiAyMjVweDsKICBoZWlnaHQ6IDIyNXB4Owp9'" :state="`${Math.random()}`">
  </wxlogin> -->
</div>
</template>
<script>
import Home from "../../src/service/home";
//  import wxlogin from 'vue-wxlogin';
export default {
  data() {
    // 验证手机号是否合法
    var checkMobile = (rules, value, callback) => {
      const regMobile = /^(0|86)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value) == true) {
        return callback();
      } else {
        callback(new Error("请输入合法的手机号"));
      }
    };
    // 验证邮箱是否合法
    var checkEmail = (rules, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value) == true) {
        return callback();
      } else {
        callback(new Error("请输入合法的邮箱号"));
      }
    };
    // 验证密码规则是否合法
    var checkPassword = (rules, value, callback) => {
      const regpass = /^[a-zA-Z0-9]{8,16}$/;
      if (regpass.test(value) == true) {
        return callback();
      } else {
        callback(new Error("密码长度不小于 8 位，不大于 16 位，需要包含字母和数字!"));
      }
    };
    // 验证再次输入的密码是否和密码相同
    var checkcCheckPass = (rules, value, callback) => {
      if (this.registerForm.checkpass === this.registerForm.password) {
        return callback();
      } else {
        callback(new Error("您输入的两次密码不一致，请重新输入！"));
      }
    };
    // 验证输入的手机号验证码是否和存储的验证码相同
    var checkPhoneCode = (rules, value, callback) => {
      if (value == this.registerForm.contenttext) {
        return callback();
      } else {
        callback(new Error("验证码错误"));
      }
    };
    return {
      // register表单
      registerForm: {
        phone: "",
        name: "",
        password: "",
        checkpass: "",
        verificationCode: "", //表单中展示的验证码
        contenttext: "", //向手机号发送的随机验证码
        timer: null,
        checkCode: true, //判断展示‘获取验证码’或‘倒计时’
        count: "" //倒计时时间
      },
      // login表单
      loginForm: {
        phone: "",
        password: ""
      },
      // 邮箱验证表单
      emailForm: {
        email: "3331438462@qq.com",
        verificationEmailCode: "", //表单中展示的验证码
        timer: null,
        checkCode: true, //判断展示‘获取验证码’或‘倒计时’
        count: "" //倒计时时间
      },
      //邮箱绑定表单
      bindForm: {
        email: "",
        phone: "",
        verificationEmailCode:"",
        timer: null,
        checkCode: true, //判断展示‘获取验证码’或‘倒计时’
        count: "" //倒计时时间
      },
      // 验证规则
      formRules: {
        phone: [
          { required: true, message: "请输入您的手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        email:[
          { required: true, message: "请输入您的邮箱号", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        password: [
          { required: true,message: "请输入您的密码", trigger: "blur" },
          { validator: checkPassword, trigger: "blur" },
        ],
        checkpass: [
          { required: true,message: "请确认您的密码", trigger: "blur" },
          { validator: checkcCheckPass, trigger: "blur" },
        ],
        verificationCode: [
          { required: true, message: "请输入您的手机验证码", trigger: "blur" },
          { validator: checkPhoneCode, trigger: "blur" },
        ],
        verificationEmailCode: [
          { required: true, message: "请输入您的邮箱验证码", trigger: "blur" },
        ]
      },
      wxappid: 'wx3829e32cd85b895c',
    };
  },
  components: {
    // wxlogin
  },
  methods: {
    // 获取手机验证码
    getcheckCode() {
      let that = this;
      // 如果未输入手机号，结束执行
      if (this.registerForm.phone == "") {
        that.$message.error("请输入您的手机号码！");
        return;
      }
      // 获取随机数（4位数字）
      var numCode = "";
      for (var i = 0; i < 4; i++) {
        numCode += Math.floor(Math.random() * 10);i
      }
      // 存储发送的验证码,用于验证输入的手机验证码是否和本地存储的相同
      this.registerForm.contenttext = numCode;
      // 向手机号发送验证码传入的参数
      let phoneCode = {
        phonenum: this.registerForm.phone,
        contenttext: "您正在修改密码，验证码为:" + numCode + "，切勿将验证码泄露给他人。",
      };
      // 调用接口，向手机号发送验证码
      this.$axios.post("/login", phoneCode).then((res) => {
        if (res.status != 200) {
          return this.$message.error("验证码发送失败！");
        } else {
          // 当验证码发送成功，开始60秒倒计时
          const TIME_COUNT = 60;
          if (!this.registerForm.timer) {
            this.registerForm.checkCode = false;
            this.registerForm.count = TIME_COUNT;
            this.registerForm.timer = setInterval(() => {
              if (
                this.registerForm.count > 0 &&
                this.registerForm.count <= TIME_COUNT
              ) {
                this.registerForm.count -= 1;
              } else {
                this.registerForm.checkCode = true;
                clearInterval(this.registerForm.timer);
                this.registerForm.timer = null;
              }
            }, 1000);
          }
        }
      });
    },
    // 获取邮箱验证码
    async getEmailcheckCode(type) {
      let that = this;
      let nowform;
      if(type == 'check') {
        nowform = this.emailForm;
      } else if( type == 'bind' ) {
        nowform = this.bindForm;
      } else {
        return
      }
      // 如果未输入邮箱，结束执行
      if (nowform.email == "") {
        that.$message.error("请输入您的邮箱！");
        return;
      }
      let nowtime = (Date.parse(new Date()) / 1000); 
      if(nowtime - (localStorage.getItem('settime') - 3600) > 60 || localStorage.getItem('settime') == '') {
        try {
          let res = await Home.postEmailCode(that.emailForm.email,type);
          if (res.status != 200 || res.data.code != 0) {
            return this.$message.error("验证码发送失败！");
          } else {
            // 当验证码发送成功，开始60秒倒计时
            localStorage.setItem('settime',res.data.time);
            const TIME_COUNT = 60;
            if (!nowform.timer) {
              nowform.checkCode = false;
              nowform.count = TIME_COUNT;
              nowform.timer = setInterval(() => {
                if (
                  nowform.count > 0 &&
                  nowform.count <= TIME_COUNT
                ) {
                  nowform.count -= 1;
                } else {
                  nowform.checkCode = true;
                  clearInterval(nowform.timer);
                  nowform.timer = null;
                }
              }, 1000);
            }
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        that.$message.error('您获取的速度太快');
      }
    },
    //绑定邮箱
    async bind() {
      let that = this;
      // 如果未输入邮箱，结束执行
      if (this.bindForm.phone == "") {
        that.$message.error("请输入您的手机号码！");
        return;
      } else if(this.bindForm.email == "") {
        that.$message.error("请输入您的邮箱！");
        return;
      } else if(this.bindForm.verificationEmailCode == "") {
        that.$message.error("请输入您的邮箱验证码！");
        return;
      } else{
        try {
          let res = await Home.postbind(that.bindForm.phone, that.bindForm.email, that.bindForm.verificationEmailCode);
          if(res.data.code == 0) {
            that.$message.success(res.data.msg);
          } else{
            that.$message.error(res.data.msg);
          }
          // return res;
        } catch (e) {
          console.log(e);
        }
      }
    },
    //解绑邮箱
    async unbind() {
      let that = this;
      // 如果未输入邮箱，结束执行
      if (this.bindForm.phone == "") {
        that.$message.error("请输入您的手机号码！");
        return;
      } else if(this.bindForm.email == "") {
        that.$message.error("请输入您的邮箱！");
        return;
      } else if(this.bindForm.verificationEmailCode == "") {
        that.$message.error("请输入您的邮箱验证码！");
        return;
      } else{
        try {
          let res = await Home.postunbind(that.bindForm.phone, that.bindForm.email, that.bindForm.verificationEmailCode);
          if(res.data.code == 0) {
            that.$message.success(res.data.msg);
          } else{
            that.$message.error(res.data.msg);
          }
          // return res;
        } catch (e) {
          console.log(e);
        }
      }
    },
    //校验邮箱验证码
    async checkemailcode() {
      let that = this;
      // 如果未输入邮箱，结束执行
      if (this.emailForm.verificationEmailCode == "") {
        that.$message.error("请输入您的邮箱验证码！");
        return;
      }
      try {
        let res = await Home.postcheckCode(that.emailForm.email,this.emailForm.verificationEmailCode);
        console.log(res.data);
        if(res.data.code == 0) {
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      } catch (e) {
        console.log(e);
      }
    },
    // 开始注册 --- 先验证验证码，如果无误再post云函数
    register() {
      let that = this;
      // alert(that.$md5('hello world'));
      this.$refs.registerFormRef.validate( async (valid) => {
          if (valid) {
            try {
              let phone = that.registerForm.phone;
              let username = that.registerForm.name;
              let password = that.registerForm.password;
              password = that.$md5(password + 'block');
              let reg = await Home.postRegister(phone, username, password);
              if(reg.data.code == 1) {
                that.$message.success('注册成功！');
                // location.reload();
              } else if(reg.data.code == 5741) {
                that.$message.error('注册失败！');
              }  else if(reg.data.code == 5742) {
                that.$message.error('该手机号码已存在！');
              } else if(reg.data.code == 5740) {
                that.$message.error('请输入合法的手机号!');
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            that.$message.error('登录失败，请检查您输入的是否有误！');

          }
      });
    },
    // 开始登录
    login() {
      let that = this;
      this.$refs.loginFormRef.validate( async (valid) => {
          if (valid) {
            let that = this;
            try {
              let phone = that.loginForm.phone;
              let password = that.loginForm.password;
              password = that.$md5(password + 'block');
              let reg = await Home.postLogin(phone, password);
              if(reg.data.code == 1) {
                that.$message.success('登录成功！');
                // location.reload();
              } else if(reg.data.code == 9002) {
                that.$message.error('登录失败！');
              } else if(reg.data.code == 0) {
                that.$message.error('您的手机号码未注册，请注册后再登录！');
              } else if(reg.data.code == 9001) {
                that.$message.error('您输入的密码错误，请重新输入！');
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            that.$message.error('登录失败，请检查您输入的是否有误！');

          }
      });
    },  
    resetRegisterForm() {
      let that = this;
      that.registerForm = [];
      // that.registerForm.checkCode = true;
    },  
    resetLoginForm() {
      let that = this;
      that.loginForm = [];
    },
    resetEmailForm() {
      let that = this;
      that.emailForm = [];
    }
  },
};
</script>
<style scoped>
.registerForm {
  width: 500px;
  margin: 0 auto;
}
.btns {
  text-align: left;
}
</style>