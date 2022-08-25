<template>
<div class="main">
  <section class="main_body">
    <header class="head">
      <router-link to="/#">
        <div class="logo d-flex align-items-center">
          <i class="logo_img">
            <img src="../assets/images/logo.svg">
          </i>
          <h2 class="logo_t">3dblockstar</h2>
        </div>
      </router-link>
    </header>
  <section class="main_content login" v-show="loginshow">
    <div class="content_title d-flex align-items-center justify-content-space-between">
      <h3>欢迎登录</h3>
      <p>木有账号?<span @click="registerdiolog">前往注册</span></p>
    </div>
    <div class="wrap content_c d-flex justify-content-center align-items-center">
      <el-form
        class="nowform"
        :model="loginForm"
        :rules="formRules"
        ref="loginFormRef"
        label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" name="loginForm.username" autocomplete></el-input>
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
  </section>
  <section class="main_content register" v-show="registershow">
    <div class="content_title d-flex align-items-center justify-content-space-between">
      <h3>欢迎注册</h3>
      <p>已有账号<span @click="logindiolog">请登录</span></p>
    </div>
      <div class="wrap content_c d-flex justify-content-center align-items-center">
        <el-form
          class="nowform"
          :model="registerForm"
          :rules="formRules"
          ref="registerFormRef"
          label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkpass">
            <el-input v-model="registerForm.checkpass" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" size="large" @click="register">创建账户</el-button>
            <el-button size="large" @click="resetRegisterForm()">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </section>
  </section>
</div>
</template>
<script>
import { mapActions,mapState } from 'vuex';
import { Loading } from 'element-ui';
import Home from "../../src/service/home";
//  import wxlogin from 'vue-wxlogin';
export default {
  inject: ["reload"],
  data() {
    // 验证用户名规则是否合法
    var checkUsername = (rules, value, callback) => {
      const regpass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
      if (regpass.test(value) == true) {
        return callback();
      } else {
        callback(new Error("用户名长度不小于 8 位，不大于 16 位，需要包含字母和数字!"));
      }
    };
    // 验证密码规则是否合法
    var checkPassword = (rules, value, callback) => {
      const regpass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
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
    return {
      loginshow: false,//显示/关闭登录界面
      registershow: true,//显示/关闭注册界面
      // register表单
      registerForm: {
        username: "",
        password: "",
        checkpass: ""
      },
      // login表单
      loginForm: {
        username: "",
        password: ""
      },
      // 验证规则
      formRules: {
        username: [
          { required: true,message: "请输入您的用户名", trigger: "blur" },
          { validator: checkUsername, trigger: "blur" },
        ],
        password: [
          { required: true,message: "请输入您的密码", trigger: "blur" },
          { validator: checkPassword, trigger: "blur" },
        ],
        checkpass: [
          { required: true,message: "请确认您的密码", trigger: "blur" },
          { validator: checkcCheckPass, trigger: "blur" },
        ]
      },
    }
  },
  components: {
    // wxlogin
  },
  computed: {
    ...mapState({
       loginstatus: state => state.loginstatus,
    })
  },
  methods: {
    ...mapActions(['saveloginstatus']),
    registerdiolog() {
      let that = this;
      that.loginshow = false;
      that.registershow = true;
    },
    logindiolog() {
      let that = this;
      that.loginshow = true;
      that.registershow = false;
    },
    // 开始注册 --- 先验证验证码，如果无误再post云函数
    register() {
      let that = this;
      // alert(that.$md5('hello world'));
      this.$refs.registerFormRef.validate( async (valid) => {
          if (valid) {
            try {
              let username = that.registerForm.username;
              let password = that.registerForm.password;
              password = that.$md5(password + 'block');
              let reg = await Home.postRegister( username, password);
              if(reg.status == 200) {
                var thisLoading = Loading.service({
                  lock: true,
                  text: "loading",
                  spinner: "el-icon-loading",
                  background: "rgba(0,0,0,0.7)",
                });
              }
              if(reg.data.code == 1) {
                that.$message.success('注册成功！');
                that.loginshow = true; //显示登录界面
                that.registershow = false; //隐藏注册界面
                that.registerForm.username = "";
                that.registerForm.password = "";
                that.registerForm.checkpass = "";
                // this.rereload();
                // location.reload();
              } else if(reg.data.code == 5741) {
                that.$message.error('注册失败！');
              }  else if(reg.data.code == 5742) {
                that.$message.error('该用户名已存在！');
              } else if(reg.data.code == 5740) {
                that.$message.error('请输入合法的用户名!');
              }
              thisLoading.close();
            } catch (e) {
              thisLoading.close();
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
              let username = that.loginForm.username;
              let password = that.loginForm.password;
              password = that.$md5(password + 'block');
              let reg = await Home.postLogin(username, password);
              var thisLoading = Loading.service({
                lock: true,
                text: "loading",
                spinner: "el-icon-loading",
                background: "rgba(0,0,0,0.7)",
              });
              if(reg.data.code == 1) {
                let res = await Home.cart('getdata', username);
                // console.log(res.data.data.data.length);
                if(res.data.data.data.length != 0) {
                  let uplistdata = res.data.data.data[0].data;
                  if(uplistdata.length != 0) {
                    localStorage.setItem("uploadcartlist", JSON.stringify(uplistdata));
                  }
                }
                that.$message.success('登录成功！');
                let accessToken = reg.data.userInfo;
                //本地存储
                localStorage.setItem("username", username);
                localStorage.setItem("token", JSON.stringify(accessToken));
                localStorage.setItem("isLogin", JSON.stringify(true));
                this.saveloginstatus(true);
                this.$router.push({ path:'/home'});
                // location.reload();
              } else if(reg.data.code == 9002) {
                that.$message.error('登录失败！');
              } else if(reg.data.code == 0) {
                that.$message.error('您的用户名未注册，请注册后再登录！');
              } else if(reg.data.code == 9001) {
                that.$message.error('您输入的密码错误，请重新输入！');
              }
              thisLoading.close();
            } catch (e) {
              thisLoading.close();
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
    }
  },
};
</script>
<style lang="scss" type="text/css" scoped>
@import "../../static/css/_app.scss";

.main{
  width: 100%;
  height: auto;
  margin: 0 auto;
  .main_body{
    max-width: 2000px;
    width: 100%;
    margin: 0 auto;
    .head{
      height: 50px;
      width: 100%;
       background: -webkit-linear-gradient(left,#42547c,#299dd4); /* Safari 5.1 - 6.0 */
       background: -o-linear-gradient(left,#42547c,#299dd4); /* Opera 11.1 - 12.0 */
       background: -moz-linear-gradient(left,#42547c,#299dd4);; /* Firefox 3.6 - 15 */
       background: linear-gradient(left,#42547c,#299dd4);; /* 标准的语法 */
      .logo{
        width: 200px;
        height: 50px;
        margin: 0 0 0 10px;
        i{
          width: 40px;
          height: 40px;
          img{
            width: 40px;
            height: 40px;
          }
        }
        .logo_t{
          font-size: 24px;
          color: #fff;
          margin-left: 10px;
        }
      }
    }
  }
  .main_content{
    max-width: 2000px;
    width: 100%;
    height: auto;
    .content_title{
      width: calc(100% - 20px);
      height: auto;
      margin: 0 10px;
      h3{
        font-size: 24px;
        color: #000;
        font-weight: bold;
      }
      p{
        font-size: 18px;
        color: #000;
        font-weight:normal;
        span{
          color: #299dd4;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
    .content_c{
      width: 100%;
      height: auto;
      margin: 100px auto 0;
      .nowform{
        width: 400px;
      }
    }
  }
}
</style>
<style lang="scss" type="text/css">
.el-form--label-top .el-form-item__label {
  float: left !important;
}
</style>