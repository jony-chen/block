<template>
  <div class="main">
    <section class="main_body">
      <header
        class="head d-flex align-items-center justify-content-space-between"
      >
        <router-link to="/#">
          <div class="logo d-flex align-items-center">
            <i class="logo_img">
              <img src="../assets/images/logo.svg" />
            </i>
            <h2 class="logo_t">3dblockstar后台管理系统</h2>
          </div>
        </router-link>
      </header>
      <div class="main_content login">
        <div class="wrap content_c d-flex justify-content-center align-items-center">
          <el-form
            class="nowform"
            :model="loginForm"
            :rules="formRules"
            ref="loginFormRef"
            label-position="top">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username"></el-input>
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
      </div>
    </section>
    <foot></foot>
  </div>
</template>
<script>
import Home from "../service/home";
import foot from "../../src/components/foot";
export default {
  inject: ["reload"],
  data() {
    // 验证用户名规则是否合法
    var checkUsername = (rules, value, callback) => {
      const regpass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,16}$/;
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
    return {
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
        ]
      },
    };
  },
  components: {
    foot: foot,
  },
  mounted() {},
  computed:{
  },
  created: function () {
  },
  methods: {
    // 开始登录
    login() {
      let that = this;
      this.$refs.loginFormRef.validate( async (valid) => {
          if (valid) {
            let that = this;
            try {
              let username = that.loginForm.username;
              let password = that.loginForm.password;
              // password = that.$md5('3dblockstar' + 'block');
              // console.log(password);
              password = that.$md5(password + 'block');
              let reg = await Home.admin('login',username, password,'');
              if(reg.data.code == 1) {
                that.$message.success('登录成功！');
                localStorage.setItem("isAdminLogin", JSON.stringify(true));
                localStorage.setItem("adminName", JSON.stringify(this.loginForm.username));
                localStorage.setItem("adminLastTime", reg.data.data);
                this.$router.push({ path:'/admin'});
              } else if(reg.data.code == 9002) {
                that.$message.error('登录失败！');
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            that.$message.error('登录失败，请检查您输入的是否有误！');

          }
      });
    },    
    resetLoginForm() {
      let that = this;
      that.loginForm = [];
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/css" scoped>
@import "../../static/css/_app.scss";

.main {
  width: 100%;
  height: auto;
  margin: 0 auto;
  .main_body {
    max-width: 2000px;
    width: 100%;
    margin: 0 auto;
    .head {
      height: 50px;
      width: 100%;
      background: -webkit-linear-gradient(
        left,
        #42547c,
        #299dd4
      ); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(
        left,
        #42547c,
        #299dd4
      ); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(
        left,
        #42547c,
        #299dd4
      ); /* Firefox 3.6 - 15 */
      background: linear-gradient(left, #42547c, #299dd4); /* 标准的语法 */
      .logo {
        width: auto;
        height: 50px;
        margin: 0 0 0 10px;
        i {
          width: 40px;
          height: 40px;
          img {
            width: 40px;
            height: 40px;
          }
        }
        .logo_t {
          font-size: 24px;
          color: #fff;
          margin-left: 10px;
        }
      }
      .back {
        font-size: 16px;
        color: #fff;
        margin-right: 20px;
        font-weight: bold;
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
}
</style>
<style lang="scss" type="text/css">
.el-form--label-top .el-form-item__label {
  float: left !important;
}
</style>
