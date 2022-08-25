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
        <router-link to="/shopcart" class="back">返回购物车</router-link>
      </header>
      <div class="body_box">
        <div class="box_title d-flex align-items-center justify-content-space-between">
          <p>订单列表</p>
        </div>
        <div class="box_body_b" >
          <div class="select_box">
            <div class="select_body d-flex align-items-center">
              <dd @click="select(0)" :style="this.nowselect == 0?'color:#409eff;border-bottom:2px solid #409eff;':'color:#000'">全部订单</dd>
              <dd @click="select(1)" :style="this.nowselect == 1?'color:#409eff;border-bottom:2px solid #409eff;':'color:#000'">待付款</dd>
              <dd @click="select(2)" :style="this.nowselect == 2?'color:#409eff;border-bottom:2px solid #409eff;':'color:#000'">待收货</dd>
              <dd @click="select(3)" :style="this.nowselect == 3?'color:#409eff;border-bottom:2px solid #409eff;':'color:#000'">已完成</dd>
            </div>
          </div>
          <div class="no_data d-flex align-items-center justify-content-center" v-if="this.batchPart.length <= 0">
            <p>No Data</p>
          </div>
          <div class="order_box" v-for="(data, key) in this.batchPart" :key="key" v-else>
            <div class="order_title d-flex align-items-center justify-content-space-between">
              <div class="order_no">订单编号：<span>{{data.orderCode}}</span></div>
              <div class="order_time">{{data.time}}</div>
            </div>
            <div class="box_part_title d-flex align-items-center justify-content-space-between">
              <p class="box_part_title_name">零件名</p>
              <p class="box_part_title_num">单价</p>
              <p class="box_part_title_price">数量</p>
              <p class="box_part_title_total">小计</p>
            </div>
            <div class="box_body_b box_body_box_s" v-for="(res, index) in data.batchPart" :key="index">
              <div class="box_body_box_b d-flex align-items-center justify-content-normal">
                <span class="box_img_box">
                  <img src="../assets/images/bulkCartList.png" alt="" class="flex_pic" />
                </span>
                <div class=" part_box_t d-block text-left">
                  <h3>{{res[0].partname}}</h3>
                  <p>合计：{{res[1].partlist.length}} 种零件,<span>{{data.pcs}}</span> pcs</p>
                </div>
              </div>
              <div class="part_box_arr">
                <div class="box_body_c" v-for="(item, id) in res[1].partlist" :key="id">
                  <p class="part_name">
                    <span class="img_box">
                      <img :src="'https://pic-1302893429.cos.ap-nanjing.myqcloud.com/items/' + item.Color + '/' + item.Part + '_' + item.Color + '.png' " @error="defaultSrc"/>
                    </span>
                    <span class="isLong">{{ item.Part }}</span>
                  </p>
                  <p class="part_price">{{item.partPrice}}</p>
                  <p class="part_num">{{item.Quantity}}</p>
                  <p class="part_price">{{ item.Quantity * item.partPrice }}</p>
                </div>
              </div>
            </div>
          <!-- </div> -->
          <div class="order d-flex align-items-center justify-content-space-between">
            <div class="order_status d-block">
              <dd>订单状态：
                <span v-if="data.status == 1">待付款</span>
                <span v-if="data.status == 2">待收货</span>
                <span v-if="data.status == 3">已完成</span>
              </dd>
              <div class="logistics" v-if="data.status == 2">
                <dd>物流信息：<span>{{data.logistics}}</span></dd>
              </div>
              <div class="logistics" v-if="data.info != null">
                <dd>备注：<span>{{data.info}}</span></dd>
              </div>
            </div>
            <div class="d-block">
              <dd>( 运费：￥10)</dd>
              <dd>*偏远地区￥30</dd>
              <dl>品牌商品邮费另外计算</dl>
              <p>合计：
                <span class="allprice">￥ {{ data.total }}</span>
                <span>(不含邮费)</span>
              </p>
              <el-button type="primary" v-if="data.status == 1" @click="dialogForm = true">付款</el-button>
              <!-- <el-button v-if="data.status == 1" @click="cancel(data.orderCode)">取消订单</el-button> -->
              <div class="dialog">
                <el-dialog title="付款信息" :visible.sync="dialogForm" width="30%">
                  <img src="../assets/images/wechat.jpg">
                  <p>请添加微信，提供订单号向客服支付！</p>
                </el-dialog>
              </div>
            </div>
          </div>
          <div class="info">
            <div class="box_body_bd  d-flex align-items-center">
              <div class="delivery">
                <h3>收件信息</h3>
                <p><span>收件人姓名：</span>{{data.deliveryname}}</p>
                <p><span>收件人手机号：</span>{{data.deliveryphone}}</p>
                <p><span>收件地址：</span>{{data.deliveryaddress}}</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
    <foot></foot>
  </div>
</template>
<script>
import Home from "../service/home";
import { Loading } from 'element-ui';
import foot from "../../src/components/foot";
export default {
  inject: ["reload"],
  data() {
    return {
      allPart: [],
      pendingpay: [],
      pendingget: [],
      complete:[],
      batchPart: [],
      activeName: "allorder",
      showAdd: false,
      username: '',
      totalAll: 0,
      nowselect: 1,
      dialogForm: false
    };
  },
  components: {
    foot: foot,
  },
  mounted() {},
  computed:{
  },
  created: function () {
    this.order();
  },
  methods: {
    //图片损毁时触发
    defaultSrc(event) {
      const img = event.srcElement; // 刚开始是以参数的形式定义的，但是默认的图片一直不能使用，遂改为此方式
      img.src = require("../assets/images/default.png"); // 默认一张图片。若是public中的图片，直接 ./ 就可以
      img.οnerrοr = null; // 若默认的图片地址亦无法正常使用，添加此可控制不一直跳动
    },
    async order() {
      var thisLoading = Loading.service({
        lock: true,
        text: "loading",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)",
      });
      this.username = localStorage.getItem("username");
      let add = await Home.myorder(this.username, 0);
      var res = add.data.data;
      if(!res) {
        this.batchPart = [];
      } else {
        if(res.length > 0) {
          for(var i = 0; i < res.length; i++) {
            if(res[i].status == 1){
              this.pendingpay.push(res[i]);
            } else if(res[i].status == 2){
              this.pendingget.push(res[i]);
            } else if(res[i].status == 3){
              this.complete.push(res[i]);
            }
            this.allPart.push(res[i]);
          }
        this.batchPart = this.pendingpay;
        }
      }
      thisLoading.close();      
    },
    async select(id) {
      this.nowselect = id;
      if(id == 0) {
        this.batchPart = this.allPart;
      } else if(id == 1) {
        this.batchPart = this.pendingpay;
      } else if(id == 2) {
        this.batchPart = this.pendingget;
      } else if(id == 3) {
        this.batchPart = this.complete;
      } else {
        console.log(id);
      }
      // let add = await Home.myorder(this.username,this.nowselect);
      // var res = add.data.data;
      // this.batchPart = res;
    },
    cancel(num) {
      console.log(num);

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
        .part_box_t{
          h3{
            margin: 5px auto;
          }
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
        .dialog{
          width: 800px;
        }
        .select_box{
          width: 100%;
          .select_body{
            width: auto;
            margin: 0 5px;
            border-bottom: 1px solid #f0f0f0;
            dd{
              border: 1px solid #f0f0f0;
              padding: 10px;
              &:hover{
                color: #409eff;
                cursor: pointer;
              }
            }
          }
        }
        .order_box{
          width: auto;
          height: auto;
          margin: 20px 15px 40px;
          -webkit-box-shadow: 0 0 5px #c0c0c0;
          box-shadow: 0 0 5px #c0c0c0;
          .order_title {
            margin: 0 10px;
            padding: 10px 0;
            width: auto;
            height: auto;
            color: #000;
            font-weight: normal;
            font-size: 14px;
            span{
              font-size: 16px;
              font-weight: bold;
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
      .box_body_bd {
        width: 100%;
        height: auto;
        margin: 10px auto;
        .delivery{
          text-align: left;
          margin: 10px 0;
          width: auto;
          height: auto;
          overflow: hidden;
          p{
            font-size: 18px;
            font-weight: bold;
            max-width: 800px;
            word-break:break-all;
            margin: 0 auto;
            span{
              width: 120px;
              display: inline-block;
              text-align: left;
              font-size: 16px;
              color: #000;
              font-weight: normal;
              margin: 5px 10px 5px 0;
            }
            
          }
        }
      }
      .info{
        border-top: 1px solid #f0f0f0;
        padding: 0 15px 50px;
      }
      .box_body_box_b{
        border-bottom: 1px solid #f0f0f0;
      }
      .part_box_arr{
        width: auto;
        height: 400px;
        overflow-x: hidden;
        overflow-y: scroll;
      }
      .order{
        text-align: right;
        margin-right: 100px;
        width: auto;
        padding-bottom: 20px;
        height: auto;
        p{
          padding-bottom: 20px;
          color: #000;
          font-size: 20px;
          font-weight: bold;
          .allprice{
            color: #ff0000;
            font-size: 24px;
            margin-right: 10px;
          }
          span{
            color: #000;
            font-weight: normal;
            font-size: 14px;
          }
        }
        dl{
          color: #ff0000;
          margin: 10px 0 20px;
        }
        .order_status{
          dd{
            margin: 0 15px;
            font-size: 16px;
            font-weight: bold;
            text-align: left;
          }
          .logistics{
            text-align: left;
            margin-top: 10px;
          }
        }
        .dialog{
          text-align: center;
        }
      }
    }
  }
}
</style>
