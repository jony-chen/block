<template>
  <div class="main">
    <section class="main_body">
      <header class="head d-flex align-items-center justify-content-space-between">
        <router-link class="logo_box" to="/#">
          <div class="logo d-flex align-items-center">
            <i class="logo_img">
              <img src="../assets/images/logo.svg">
            </i>
            <h2 class="logo_t">3dblockstar</h2>
          </div>
        </router-link>
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
        </div>
      </div>
    </section>
    <foot></foot>
  </div>
</template>
<script>
import foot from "../../src/components/foot";
export default {
  inject: ["reload"],
  data() {
    return {
      title: "零件列表",
      output: false,
      nowlogin: false,
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
      DetailsForm: [],
      inForm: [],
      unForm: [],
      shopcartlist: []
    };
  },
  components: {
    foot: foot,
  },
  watch: {
  },
  mounted() {
    // this.postTest();
  },
  methods: {
    // txt文本
    txtbtn() {
      document.getElementById("txt").click();
    },
    //图片损毁时触发
    loadTextFromFile(e) {
      const file = e.target.files[0];
      let partname = file.name.split(".").splice(-1).toString();
      if (partname !== "xls") {
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
      //excal数据
      console.log(item);
      return
      let res = '';
      let arr = item.split("\n");
      // console.log(arr);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].indexOf("}") != -1) {
          let part = arr[i].substring(0,arr[i].indexOf("}"));
          part = part + ',"partPrice":0.5}' + '\n';
          res += part;
            //  console.log(arr[i].lastIndexOf("}"));
        }
      }
      console.log(res);
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
        width: 200px;
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
      .back{
        font-size: 16px;
        color: #fff;
        margin-right: 20px;
        font-weight: bold;
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
      .shopcart_box{
        padding: 18px 0px;
        height: 40px;
        line-height: 40px;
        position: relative;
        .shoppCartContent{
          position: absolute;
          right: 0;
          top: 50%;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
          .addToCat{
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
      .part_box{    
        width: 100%;
        height: 680px;
        margin: 0 auto;
        display: block;
        text-align: left;
        overflow-y: scroll;
        .block_box{
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
          .part_img{
            width: 100%;
            height: auto;
            img{
              width: 160px;
              height: 160px;
              padding: 20px;
            }
          }
          .part_t_n{
            width: calc(100% - 20px);
            height: auto;
            padding: 5px 10px 10px;
            p{
              width: calc(100% - 20px);
              font-size: 16px;
              color: #000;
              text-align: left;
              font-weight: bold;
            }
            .part_num{
              text-align: right;
            }
          }
        }
        .part_title{
          margin: 30px 0 15px 25px;
        }
      }
    }
  }
}
</style>