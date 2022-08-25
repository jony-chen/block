<template>
  <div class="main">
    <section class="main_body">
      <header
        class="head d-flex align-items-center justify-content-space-between"
      >
        <router-link class="logo_box" to="/#">
          <div class="logo d-flex align-items-center">
            <i class="logo_img">
              <img src="../assets/images/logo.svg" />
            </i>
            <h2 class="logo_t">3dblockstar</h2>
          </div>
        </router-link>
        <div
          class="
            head_btn
            d-flex
            align-items-center
            justify-content-space-between
          "
          v-if="!nowlogin"
        >
          <p @click="loginurl">登录</p>
          <p @click="loginurl">注册</p>
        </div>
        <div
          class="
            head_name
            d-flex
            align-items-center
            justify-content-space-between
          "
          v-if="nowlogin"
        >
          <dl>欢迎您，</dl>
          <router-link to="/myorder"
            ><dd>{{ uname }}</dd></router-link
          >
          <p @click="exit">退出</p>
        </div>
      </header>
      <div class="main_box">
        <div class="upload_box">
          <div class="d-flex align-items-center justify-content-center up_btn">
            <el-button @click="txtbtn" class="upload_btn">上传文件</el-button>
            <input
              type="file"
              @change="loadTextFromFile"
              id="txt"
              style="display: none"
            />
          </div>
          <div class="info">
            <p>功能说明:通过上传拼搭图纸文件或零件列表文件快速批量选件下单。</p>
            <p>
              请确保你上传的文件为ldr格式,
              软件LDD导出的ldr文件与BOM表不支持印刷件，如您的文件内有印刷件请手动添加购物车。
            </p>
          </div>
          <p class="remind">
            注: 因系统限制，单次上传订单零件不要超过5000个<br />记得检查一下下方可购零件中左右方向是否正确哦
          </p>
        </div>
        <div class="output_box">
          <div class="successUpload">
            <p class="fileUpload">已传文件</p>
            <div
              class="
                fileUpload_box
                d-flex
                align-items-center
                justify-content-space-between
              "
              v-if="output"
            >
              <dd>
                <i class="el-icon-document"></i>
                <p>{{ filename }}</p>
              </dd>
              <dd>
                <i class="el-icon-s-tools"></i>
                <p>{{ fileKind }}<span>种</span></p>
              </dd>
              <dd>
                <i class="el-icon-folder-opened"></i>
                <p>{{ filesize }}</p>
              </dd>
              <dd>
                <p>{{ filetime }}</p>
              </dd>
            </div>
          </div>
        </div>
        <div
          class="shopcart_box"
          @click="addshopcart"
          v-if="inForm.length != 0"
        >
          <div class="shoppCartContent">
            <div class="addToCat floatR">
              <span class="totalPrice">￥ {{ totalSumAllPrice }}</span>
              <i class="el-icon-document"></i>
              <span style="padding-left: 2px">可购零件添加购物车</span>
            </div>
          </div>
        </div>
        <div class="part_box" v-if="output">
          <div class="d-flex part_title">
            <p>可购零件 {{ this.inForm.length }}</p>
          </div>
          <div class="block_box" v-for="(item, id) in this.inForm" :key="id">
            <div class="part_no">{{ id + 1 }}</div>
            <div class="part_img">
              <img
                :src="
                  item.in == 1 && item.type == 1
                    ? 'https://pic-1302893429.cos.ap-nanjing.myqcloud.com/items/' +
                      item.Color +
                      '/' +
                      item.Part +
                      '_' +
                      item.Color +
                      '.png'
                    : '../assets/images/default.png'
                "
                @error="defaultSrc"
              />
            </div>
            <div
              class="
                part_t_n
                d-flex
                align-items-center
                justify-content-space-between
              "
            >
              <p class="part_title">{{ item.Part }}</p>
              <!-- </div>
            <div class="part_num"> -->
              <p class="part_num">x {{ item.Quantity }}</p>
            </div>
          </div>
        </div>
        <div class="part_box" v-if="output">
          <div class="d-flex part_title">
            <p>缺货零件 {{ this.unForm.length }}</p>
          </div>
          <div class="block_box" v-for="(item, id) in this.unForm" :key="id">
            <div class="part_no">{{ id + 1 }}</div>
            <div class="part_img">
              <img src="../assets/images/default.png" />
            </div>
            <div
              class="
                part_t_n
                d-flex
                align-items-center
                justify-content-space-between
              "
            >
              <p class="part_title">{{ item.Part }}</p>
              <!-- </div>
            <div class="part_num"> -->
              <p class="part_num">x {{ item.Quantity }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <sidebar></sidebar>
    <foot></foot>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { Loading } from "element-ui";
import Home from "../../src/service/home";
import sidebar from "../../src/components/sideBar";
import foot from "../../src/components/foot";
export default {
  inject: ["reload"],
  data() {
    return {
      nowlogin: false,
      colorArr: [],
      partArr: [],
      onePartArr: [],
      uname: "",
      title: "零件列表",
      output: false,
      filename: "",
      fileKind: "",
      filesize: "",
      filetime: "",
      json_fields: {
        Part: "Part",
        // image: "image",
        Color: "Color",
        Quantity: "Quantity",
      },
      inForm: [],
      unForm: [],
      shopcartlist: [],
    };
  },
  components: {
    sidebar: sidebar,
    foot: foot,
  },
  mounted() {},
  computed:{
    totalSumAll(){
      let totalSumAll = 0;
      if(this.inForm.length != 0){
        for(let i = 0; i < this.inForm.length; i++) {
          totalSumAll += this.inForm[i].Quantity;
        }
      }        
      if(isNaN(totalSumAll)){
        return 0
      }
      return totalSumAll;
    },    
    totalSumAllPrice() {
      let totalSumAll = 0;
      if (this.inForm.length != 0) {
        for (let i = 0; i < this.inForm.length; i++) {
          totalSumAll += this.inForm[i].Quantity * this.inForm[i].partPrice;
        }
      }
      if (isNaN(totalSumAll)) {
        return 0;
      }
      return totalSumAll;
    },
  },
  created: function () {
    this.login();
  },
  methods: {
    ...mapActions(["saveloginstatus"]),
    //图片损毁时触发
    defaultSrc(event) {
      const img = event.srcElement; // 刚开始是以参数的形式定义的，但是默认的图片一直不能使用，遂改为此方式
      img.src = require("../assets/images/default.png"); // 默认一张图片。若是public中的图片，直接 ./ 就可以
      img.οnerrοr = null; // 若默认的图片地址亦无法正常使用，添加此可控制不一直跳动
    },
    login() {
      let nowloginstatus = localStorage.getItem("isLogin");
      let tokenarr = localStorage.getItem("token");
      nowloginstatus = JSON.parse(nowloginstatus);
      if (nowloginstatus) {
        this.nowlogin = JSON.parse(nowloginstatus);
        tokenarr = JSON.parse(tokenarr);
        let nowtime = Date.parse(new Date()) / 1000;
        let nowtokne = parseInt(tokenarr.tokenExpired) - parseInt(nowtime); //判断是否过期
        if (tokenarr && nowtokne < 0) {
          this.$message.error("您的登录已经过期，请重新登录！");
          this.nowlogin = false;
          localStorage.setItem("isLogin", JSON.stringify(false));
          localStorage.setItem("token", "");
          this.$router.push({ path: "/login" });
        }
        this.nowlogin = nowloginstatus;
        this.uname = localStorage.getItem("username");
      }
      if (!nowloginstatus || nowloginstatus == null) {
        this.nowlogin = false;
        localStorage.setItem("isLogin", JSON.stringify(false));
        localStorage.setItem("token", "");
      }
    },
    loginurl() {
      this.$router.push({ path: "/login" });
    },
    remind() {
      console.log(this.nowlogin);
      this.$alert("请先登录后再上传！", "登录提示", {
        confirmButtonText: "确定",
        type: "warning",
      });
    },
    exit() {
      this.$confirm("您确认要退出登录吗", "提示信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "退出成功",
          });
          // let uplist = localStorage.getItem("uploadcartlist");
          // console.log(uplist);
          // if(uplist) {
          //   let res = await Home.cart('upload',this.uname ,uplist);
          //   if(res.data.code == 6533) {
          localStorage.removeItem("uploadcartlist");
          localStorage.setItem("isLogin", JSON.stringify(false));
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          // localStorage.removeItem("uploadcartlist");
          localStorage.removeItem("onepartlist");
          this.saveloginstatus(false);
          this.reload();
          // }
          // }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已经取消退出",
          });
          return;
        });
    },
    // txt文本
    txtbtn() {
      if (this.nowlogin) {
        document.getElementById("txt").click();
      } else {
        this.$alert("请先登录后再上传！", "登录提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
      }
      // document.getElementById("txt").click();
    },
    //图片损毁时触发
    defaultSrc(event) {
      const img = event.srcElement; // 刚开始是以参数的形式定义的，但是默认的图片一直不能使用，遂改为此方式
      img.src = require("@/assets/images/default.png"); // 默认一张图片。若是public中的图片，直接 ./ 就可以
      img.οnerrοr = null; // 若默认的图片地址亦无法正常使用，添加此可控制不一直跳动
    },
    loadTextFromFile(e) {
      const file = e.target.files[0];
      let partname = file.name.split(".").splice(-1).toString();
      if (partname !== "ldr") {
        this.$message.error("文件类型错误,请重新选择文件");
        return;
      }
      const reader = new FileReader();
      if (typeof FileReader === "undefined") {
        alert("您的浏览器不支持FileReader接口");
      }
      reader.onload = (e) => this.$emit("load", this.dealNum(e.target.result));
      reader.readAsText(file, "utf-8");
    },
    async dealNum(item) {
      //获取文件名
      var fileObj = document.getElementById("txt").files[0];
      let newsize = this.formatFileSize(fileObj.size);
      this.filesize = newsize;
      this.filename = fileObj.name;
      this.filetime = this.formatDate();
      console.log(newsize);
      //excal数据
      let searchdata = await Home.uploadLdr(item);
      
      this.inForm = searchdata.data.inarr;
      this.unForm = searchdata.data.unarr;
      this.fileKind = this.inForm.length + this.unForm.length;
      if (this.inForm.length != 0) {
        this.output = true;
      }
    },
    //获取文件的大小
    formatFileSize(fileSize) {
      if (fileSize < 1024) {
        return fileSize + "B";
      } else if (fileSize < 1024 * 1024) {
        var temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return temp + "KB";
      } else if (fileSize < 1024 * 1024 * 1024) {
        var temp = fileSize / (1024 * 1024);
        temp = temp.toFixed(2);
        return temp + "MB";
      } else {
        var temp = fileSize / (1024 * 1024 * 1024);
        temp = temp.toFixed(2);
        return temp + "GB";
      }
    },
    //时间格式
    formatDate() {
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let week = date.getDay(); // 星期
      let weekArr = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let hour = date.getHours(); // 时
      hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
      let minute = date.getMinutes(); // 分
      minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
      let second = date.getSeconds(); // 秒
      second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
      return `${year}/${month}/${day} ${hour}:${minute}:${second} ${weekArr[week]}`;
    },
    addshopcart() {
      let nowloginstatus = localStorage.getItem("isLogin");
      this.nowlogin = JSON.parse(nowloginstatus);
      if (this.nowlogin) {
        //加入购物车
        let alllist = localStorage.getItem("uploadcartlist"); //总的上传零件表
        if (!alllist || alllist == null) {
          alllist = [];
        } else {
          alllist = JSON.parse(alllist);
        }
        let nowlist = this.inForm; //当前上传的可购零件列表
        if (nowlist.length != 0) {
          let arrnameindex = this.filename.lastIndexOf(".");
          let arrname = this.filename.substring(0, arrnameindex);
          // alllist[arrname] = nowlist;
          let uparr = [{ partname: arrname }, { partlist: nowlist }];
          alllist.push(uparr);
          alllist = JSON.stringify(alllist);
          localStorage.setItem("uploadcartlist", alllist);
          this.$message.success("加入购物车成功！");
        } else {
          this.$$message.error("当前购物车是空的！");
        }
        this.reload();
        // this.inForm = [];
        // this.unForm = [];
        // this.shopcartlist = localStorage.getItem("uploadcartlist");
        // console.log(this.uploadcartlist);
        // this.shopcartlist = JSON.parse(alllist);
        // if(this.shopcartlist.length == 0){
        //   this.$message.error('当前添加的零件为空！');
        // } else{
        //   this.$message.success('加入成功');
        //   console.log(this.shopcartlist);
        // }
      } else {
        this.$message.error("请先登录后再加入购物车");
      }
    },
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
      height: 60px;
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
      .logo_box {
        width: auto;
        .logo {
          width: 200px;
          height: 60px;
          margin: 0 0 0 20px;
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
      }
      .head_btn {
        width: auto;
        height: 40px;
        p {
          width: 80px;
          height: 40px;
          line-height: 40px;
          background: #42547c;
          color: #fff;
          font-size: 14px;
          margin: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }
      .head_name {
        width: auto;
        height: 40px;
        color: #fff;
        margin-right: 20px;
        dl {
          height: 40px;
          line-height: 40px;
        }
        dd {
          height: 40px;
          line-height: 40px;
          color: #fff;
          margin: 0 10px 0 5px;
          text-decoration: underline;
        }
        p {
          height: 40px;
          line-height: 40px;
          margin: 0 10px 0 5px;
          cursor: pointer;
        }
      }
    }
    .main_box {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid #eee;
      -webkit-box-shadow: 0 0 10px 0 rgb(8 1 3 / 20%);
      box-shadow: 0 0 10px 0 rgb(8 1 3 / 20%);
      padding-bottom: 50px;
      width: calc(100% - 4px);
      .upload_box {
        height: 400px;
        width: auto;
        background: rgb(235, 235, 235);
        position: relative;
        .up_btn {
          padding: 100px 0 50px;
          .upload_btn {
            background: #0097fc;
            color: #fff;
            font-size: 18px;
            font-weight: bold;
            height: 50px;
            width: 150px;
          }
        }
        .info {
          color: #000;
          font-size: 16px;
          line-height: 1.5;
        }
        .remind {
          position: absolute;
          right: 11px;
          bottom: 13px;
          color: #000;
          font-size: 12px;
          text-align: right;
        }
        .btn {
          height: 50px;
          width: 100px;
          text-align: center;
          font-size: 16px;
        }
      }
      .output_box {
        height: auto;
        width: auto;
        margin: 0 auto;
        .successUpload {
          margin: 10px 15px;
          width: calc(100% - 30px);
          height: auto;
          background: #e7e8ea;
          border-radius: 5px;
          .fileUpload {
            height: 50px;
            line-height: 50px;
            padding-left: 15px;
            text-align: left;
          }
          .fileUpload_box {
            border-top: 1px solid #ccc;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            dd {
              margin: 15px;
              display: flex;
              align-items: center;
              p {
                margin-left: 5px;
              }
            }
            .export {
              margin: 15px;
            }
          }
        }
      }
      .shopcart_box {
        padding: 18px 0px;
        height: 40px;
        line-height: 40px;
        position: relative;
        .shoppCartContent {
          position: absolute;
          right: 0;
          top: 50%;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
          .addToCat {
            cursor: pointer;
            height: 40px;
            line-height: 40px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: #fff;
            background: #0097fc;
            outline: none;
            font-size: 14px;
            border-radius: 20px 0 0 20px;
            padding-left: 18px;
            min-width: 190px;
            max-width: 100%;
            padding-right: 12px;
            .totalPrice {
              padding-right: 15px;
            }
          }
        }
      }
      .part_box {
        width: 100%;
        height: 680px;
        margin: 0 auto;
        display: block;
        text-align: left;
        overflow-y: scroll;
        .block_box {
          display: inline-block;
          background: #fff;
          border-radius: 5px;
          overflow: hidden;
          position: relative;
          border: 1px solid #f2f2f2;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          vertical-align: top;
          width: 200px;
          margin: 10px 20px;
          height: auto;
          .part_no {
            margin: 10px 0 0 10px;
            color: #b0b0b0;
            font-size: 14px;
            font-weight: normal;
          }
          .part_img {
            width: 100%;
            height: auto;
            img {
              width: 160px;
              height: 160px;
              padding: 20px;
            }
          }
          .part_t_n {
            width: calc(100% - 20px);
            height: auto;
            padding: 5px 10px 10px;
            p {
              width: calc(100% - 20px);
              font-size: 16px;
              color: #000;
              text-align: left;
              font-weight: bold;
              margin: 0 auto;
            }
            .part_num {
              text-align: right;
            }
          }
        }
        .part_title {
          margin: 30px 0 15px 25px;
        }
      }
    }
  }
}
</style>
