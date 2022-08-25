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
            <h2 class="logo_t">3dblockstar</h2>
          </div>
        </router-link>
        <router-link to="/home" class="back">返回首页</router-link>
      </header>
      <div class="body_box" v-if="this.batchPart.length > 0">
        <div class="box_title d-flex align-items-center justify-content-space-between">
          <p>购物车</p>
          <p>批量选件</p>
        </div>
        <div class="box_body_b" >
          <!-- <div class="box_part_title d-flex align-items-center justify-content-space-between">
            <p class="box_part_title_name">零件名</p>
            <p class="box_part_title_num">单价</p>
            <p class="box_part_title_price">数量</p>
            <p class="box_part_title_total">小计</p>
          </div> -->
          <div class="box_body_b box_body_box_s" v-for="(res, index) in this.batchPart" :key="index">
            <div class="box_body_box_b d-flex align-items-center justify-content-normal">
              <span class="box_img_box">
                <img src="../assets/images/bulkCartList.png" alt="" class="flex_pic" />
              </span>
              <div class=" part_box_t d-block text-left">
                <h3>{{res[0].partname}}</h3>
                <p>共：<span>{{res[1].partlist.length}}</span> 种零件,<span>{{totalSum(index,0)}}</span> pcs</p>
                <p>小计：<span>{{totalSum(index,1)}}</span> 元</p>
              </div>
              <img src="../assets/images/delete.png" alt="" class="alldel" @click="batchPartAllDelect(index)" style="vertical-align: middle;">
            </div>

            <!-- <div class="part_box_arr">
              <div class="box_body_c" v-for="(item, id) in res[1].partlist" :key="id">
                <p class="part_name">
                  <span class="img_box">
                    <img :src="'https://pic-1302893429.cos.ap-nanjing.myqcloud.com/items/' + item.Color + '/' + item.Part + '_' + item.Color + '.png' " @error="defaultSrc"/>
                  </span>
                  <span class="isLong">{{ item.Part }}</span>
                  <img src="../assets/images/delete.png" alt="" class="del" @click="batchPartDelect(index,id)" style="vertical-align: middle"/>
                </p>
                <p class="part_price">{{item.partPrice}}</p>
                <p class="part_num">
                  <el-input-number v-model="item.Quantity" size="mini" :min="1" @change="handleChange" label=""></el-input-number>
                </p>
                <p class="part_total">{{item.Quantity * item.partPrice }}</p>
              </div>
            </div> -->

            <div class="part_box_arr">
            <div class="block_box" v-for="(item, id) in res[1].partlist" :key="id">
              <div class="d-flex align-items-center justify-content-space-between">
                <div class="part_no">{{id + 1}}</div>
                <img src="../assets/images/delete.png" alt="" class="del" @click="batchPartDelect(index,id)" style="vertical-align: middle;">
              </div>
              <div class="part_img">
                <img :src="'https://pic-1302893429.cos.ap-nanjing.myqcloud.com/items/' + item.Color + '/' + item.Part + '_' + item.Color + '.png' " @error="defaultSrc"/>
              </div>
              <div class="part_t_n d-block">
                <dd class="part_title">{{item.Part}}</dd>
                <dd class="d-flex align-items-center justify-content-space-between">
                  <p>单价：</p>
                  <p class="part_price">{{item.partPrice}}</p>
                </dd>
                <p class="part_num">
                  <el-input-number v-model="item.Quantity" size="mini" :min="1" @change="handleChange" label=""></el-input-number>
                </p>
                <dd class="d-flex align-items-center justify-content-space-between">
                  <p>小计：</p>
                  <p class="part_total">{{item.Quantity * item.partPrice }}</p>
                </dd>
              </div>
            </div>
            </div>
          </div>
          <div class="order">
            <div class="d-block">
              <p>合计：
                <span>￥ {{ totalSumAllPrice }}</span>
              </p>
              <dd>( 运费：￥10)</dd>
              <dd>*偏远地区￥30</dd>
              <dl>品牌商品邮费另外计算</dl>
              <el-button type="primary" @click="submit()">下单</el-button>
            </div>
          </div>
        </div>
        <!-- <div class="part_box">
          <div class="d-flex part_title">
            <p>可购零件 {{this.batchPart.length}}</p>
          </div>
          <div class="block_box" v-for="(item,id) in this.batchPart" :key="id">
            <div class="part_img">
              <img :src=" 'https://pic-1302893429.cos.ap-nanjing.myqcloud.com/items/' + item.Color + '/' + item.Part + '_' + item.Color + '.png'" @error="defaultSrc"/>
            </div>
            <div class="part_t_n d-flex align-items-center justify-content-space-between">
              <p class="part_title">{{item.Part}}</p>
            </div>
          </div>
        </div> -->
      </div>
      <div class="body_box no_data d-flex align-items-center justify-content-center" v-else>
        <p>No Data</p>
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
      batchPart: [],
    };
  },
  components: {
    foot: foot,
  },
  mounted() {},
  computed:{
    totalSumAll(){
      let totalSumAll = 0;
      if(this.batchPart.length != 0){
        for(let i = 0; i < this.batchPart.length; i++) {
          for(let j = 0; j < this.batchPart[i][1].partlist.length; j++) {
            totalSumAll += this.batchPart[i][1].partlist[j].Quantity;
          }
        }        
      } else {
        return 0
      }
      if(isNaN(totalSumAll)){
        return 0
      }
      return totalSumAll;
    },
    totalSum(){
      return function(id,index) {
        let totalSum = 0;
        if(this.batchPart.length != 0){
          if(index == 0){
            for(let j = 0; j < this.batchPart[id][1].partlist.length; j++) {
              totalSum += this.batchPart[id][1].partlist[j].Quantity;
            }
          } else if(index == 1) {
            for(let j = 0; j < this.batchPart[id][1].partlist.length; j++) {
              totalSum += this.batchPart[id][1].partlist[j].Quantity * this.batchPart[id][1].partlist[j].partPrice;
            }
          }
        } else {
          return 0
        }
        if(isNaN(totalSum)){
          return 0
        }
        return totalSum;
      }
    },
    totalSumAllPrice() {
      let totalSumAll = 0;
      if(this.batchPart.length != 0){
        for(let i = 0; i < this.batchPart.length; i++) {
          for(let j = 0; j < this.batchPart[i][1].partlist.length; j++) {
            totalSumAll += this.batchPart[i][1].partlist[j].Quantity * this.batchPart[i][1].partlist[j].partPrice;
          }
        }        
      } else {
        return 0
      }
      if(isNaN(totalSumAll)){
        return 0
      }
      return totalSumAll;
    }
  },
  created: function () {
    this.shopcart();
  },
  methods: {
    //图片损毁时触发
    defaultSrc(event) {
      const img = event.srcElement; // 刚开始是以参数的形式定义的，但是默认的图片一直不能使用，遂改为此方式
      img.src = require("../assets/images/default.png"); // 默认一张图片。若是public中的图片，直接 ./ 就可以
      img.οnerrοr = null; // 若默认的图片地址亦无法正常使用，添加此可控制不一直跳动
    },
    shopcart() {
      let batchPartarr = localStorage.getItem("uploadcartlist");
      if(batchPartarr) {
        batchPartarr = JSON.parse(batchPartarr);
        this.batchPart = batchPartarr;
        // console.log(this.batchPart);
      } else {
        this.batchPart = [];
      }
      // console.log(this.batchPart);
    },
    UploadData() {
      let uplist = localStorage.getItem("uploadcartlist");
      // console.log(uplist);
      // uplist = JSON.parse(uplist);
      if (uplist) {
        this.batchPart = JSON.parse(uplist);
      } else {
        this.batchPart = [];
      }
      // console.log(this.batchPart);
    },
    batchPartDelect(index,id) {
      let data = this.batchPart;
      // data = JSON.parse(data);
      let res = data[index][1].partlist;
      res.splice(id, 1);
      data = JSON.stringify(data);
      localStorage.setItem("uploadcartlist", data);
    },
    batchPartAllDelect(index) {
      let data = this.batchPart;
      // let res = data[index];
      data.splice(index, 1);
      data = JSON.stringify(data);
      localStorage.setItem("uploadcartlist", data);
    },
    submit() {
      let nowloginstatus = localStorage.getItem('isLogin');
      let tokenarr = localStorage.getItem('token');
      nowloginstatus = JSON.parse(nowloginstatus);
      if(nowloginstatus) {
        this.nowlogin = JSON.parse(nowloginstatus);
        tokenarr = JSON.parse(tokenarr);
        let nowtime = Date.parse(new Date()) / 1000;
        let nowtokne = parseInt(tokenarr.tokenExpired) - parseInt(nowtime);//判断登录是否过期
        if(tokenarr && nowtokne < 0) {
          this.$message.error('您的登录已经过期，请重新登录！');
          this.nowlogin = false;
          localStorage.setItem("isLogin", JSON.stringify(false));
          localStorage.setItem("token", '');
          this.$router.push({ path:'/login'});
        }
        this.nowlogin = nowloginstatus;
        this.uname = localStorage.getItem('username');
        let uplist = localStorage.getItem("uploadcartlist");
        this.$router.push({ path:'/order'});
      }
      if(!nowloginstatus || nowloginstatus == null) {
        this.nowlogin = false;
        localStorage.setItem("isLogin", JSON.stringify(false));
        localStorage.setItem("token", '');
        this.$message.error('请登录后再提交订单！');
        this.$router.push({ path:'/login'});
      }
    },
    handleChange() {
      let res = this.batchPart;
      res = JSON.stringify(res);
      localStorage.setItem("uploadcartlist", res);
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
      .back {
        font-size: 16px;
        color: #fff;
        margin-right: 20px;
        font-weight: bold;
      }
    }
    .body_box {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid #eee;
      -webkit-box-shadow: 0 0 10px 0 rgb(8 1 3 / 20%);
      box-shadow: 0 0 10px 0 rgb(8 1 3 / 20%);
      padding-bottom: 50px;
      width: calc(100% - 4px);
      .box_title {
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: #299dd4;
        margin: 20px auto 0;
        p {
          text-align: left;
          color: #fff;
          font-weight: bold;
          font-size: 16px;
          padding: 0  15px;
        }
      }
      .box_body_b {
        width: 100%;
        height: auto;
        padding-bottom: 80px;
        text-align: left;
        .part_box_t{
          h3{
            margin: 5px auto;
          }
          p{
            font-size: 14px;
            span{
              font-size: 16px;
              font-weight: bold;
              color: #000;
            }
          }
        }
        .alldel{
          margin-left: 50px;
          width: 15px;
          height: 15px;
          cursor: pointer;
        }
        .box_img_box{
          width: 80px;
          height: 80px;
          margin: 20px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .box_part_title{
          width: auto;
          height: auto;
          margin: 30px  60px;
          font-size: 16px;
          font-weight: bold;
          color: #000;
          text-align: left;
          .box_part_title_name{
            width: 40%;
            text-align: left;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
          }
          p{
            width: 20%;
            height: auto;
            margin: 0 auto;
            font-weight: bold;
            text-align: center;
          }
        }
        .box_body_t {
          width: 100%;
          height: auto;
          margin: 10px  20px;
          font-size: 16px;
          font-weight: bold;
          color: #000;
          text-align: left;
        }
        .box_body_c {
          width: auto;
          height: 80px;
          line-height: 80px;
          margin: 20px 60px;
          display: flex;
          align-items: center;
          p {
            vertical-align: top;
            display: inline-block;
            height: 80px;
            line-height: 80px;
          }
          .part_name {
            width: 40%;
            text-align: left;
            font-weight: 400;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            span {
              height: 80px;
              line-height: 80px;
              display: inline-block;
              max-width: 155px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding-right: 10px;
              vertical-align: middle;
              img {
                height: 80px;
                width: 80px;
              }
            }
            .isLong {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .del{
              cursor: pointer;
            }
          }
          .part_num {
            width: 20%;
            height: auto;
            margin: 0 auto;
            text-align: center;
            // span{
            //   font-size: 14px;
            //   line-height: 0;
            //   vertical-align: middle;
            //   cursor: pointer;
            //   &:nth-child(2){
            //     cursor: auto;
            //     display: inline-block;
            //     line-height: normal;
            //     width: calc(100% - 16px);
            //   }
            // }
            // img{
            //   vertical-align: middle;
            //   -webkit-transition: all .3s;
            //   transition: all .3s;
            //   opacity: 0;
            // }
          }
          .part_price{
            width: 20%;
          }
        }
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
          .part_no{
            margin: 10px 0 0 10px;
            color: #b0b0b0;
            font-size: 14px;
            font-weight: normal;
          }
          .del{
            margin: 10px 10px 0 0;
            color: #b0b0b0;
            font-size: 14px;
            font-weight: normal;
            cursor: pointer;
          }
          .part_img{
            width: 100%;
            height: auto;
            img{
              width: 160px;
              height: 160px;
              padding: 5px 20px;
            }
          }
          .part_t_n{
            width: calc(100% - 20px);
            height: auto;
            padding: 5px 10px 10px;
            dd{
              font-size: 14px;
              color: #000;
              text-align: left;
              font-weight: normal;
              margin: 0 auto;
            }
            .part_title{
              text-align: center;
              font-size: 18px;
              color: #000;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .part_price{
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              color: #000;
            }
            .part_num{
              text-align: center;
              margin: 10px auto;
            }
            .part_total{
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              color: #000;
            }
          }
        }
      }
      .box_body_box_b{
        border-bottom: 1px solid #f0f0f0;
      }
      .part_box_arr{
        width: auto;
        height: 720px;
        overflow-x: hidden;
        overflow-y: scroll;
      }
      .order{
        text-align: right;
        margin-right: 100px;
        width: auto;
        height: auto;
        p{
          margin-bottom: 20px;
          color: #000;
          font-size: 20px;
          font-weight: bold;
          span{
            color: #ff0000;
            font-size: 24px;
          }
        }
        dl{
          color: #ff0000;
          margin: 10px 0 20px;
        }
      }
    }
    .no_data{
      height: 500px;
      padding: 0;
      margin: 0 auto;
      p{
        font-size: 20px;
        color: #c0c0c0;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
    }
  }
}
</style>
