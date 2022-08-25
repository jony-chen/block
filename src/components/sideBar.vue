<template>
  <div class="main">
    <section class="main_body">
      <el-popover placement="left" title="" width="500" trigger="click" @show="UploadData()" class="icon_box" content="">
        <div class="shopcar">
          <div class="partbox">
            <div class="box_title d-flex align-items-center justify-content-space-between">
              <p>零件名</p>
              <p>数量</p>
              <p>单价</p>
            </div>
            <div class="box_body">
              <!-- <div class="box_body_b">
                <div class="box_body_t"><span>单选零件</span> <span>------ (合计{{}}件）</span></div>
                <div class="box_body_c">
                  <p class="part_name">
                    <span class="img_box">
                      <img src="https://image.gobricks.cn/newproducts/010/1264.png" alt="" class="flex_pic">
                    </span>
                    <span class="isLong">滑轮</span> 
                    <img src="../assets/images/delete.png" alt="" class="del" style="vertical-align: middle;">
                  </p>
                  <p class="part_num">
                    <el-input-number v-model="num" size="mini" :min="1" label=""></el-input-number>
                  </p>
                  <p  class="part_price">{{totalSum(id)}}</p>
                </div>
              </div>
              <p v-if="this.onePart.length != 0 && this.batchPart.length != 0" style="border:1px solid #f0f0f0"></p> -->
              <div class="box_body_b" v-if="this.batchPart.length != 0" >
                <div class="box_body_t"><span>批量选件</span> <span>------ (合计{{this.batchPart.length}}件）</span></div>
                <div class="box_body_c" v-for="(item,id) in this.batchPart" :key="id">
                  <p class="part_name">
                    <span class="img_box">
                      <img src="../assets/images/bulkCartList.png" alt="" class="flex_pic">
                    </span>
                    <span class="isLong">{{item[0].partname}}</span> 
                    <img src="../assets/images/delete.png" alt="" class="del" @click="batchPartDelect(id)" style="vertical-align: middle;cursor: pointer;">
                  </p>
                  <p class="part_num">1</p>
                  <p  class="part_price">{{totalSum(id)}}</p>
                </div>
              </div>
            </div>
            <div class="box_bottom d-flex align-items-center justify-content-space-between">
              <div class="all_price">
                合计：
                <span>{{totalSumAllPrice}}</span>
              </div>
              <div class="btn-box">
                <router-link to="/shopcart" class="back">
                  <el-button type='primary' >去购物车</el-button>
                </router-link>
                <router-link to="/order" class="back">
                  <el-button type='primary'>结算下单</el-button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <el-button slot="reference">
          <el-badge :value="batchPartNum" class="item">
            <img class="icon_btn" src="../assets/images/shopcar_icon.png" />
          </el-badge>
        </el-button>
      </el-popover>
      <el-popover placement="left" title="" width="200" trigger="hover" class="icon_box" content="">
        <img class="iimg" src="../assets/images/wechat.jpg" />
        <el-button slot="reference"><img class="icon_btn" src="../assets/images/wechat_icon.png" /></el-button>
      </el-popover>
      <el-popover placement="left" title="" width="200" trigger="hover" class="icon_box"  content="">
        <img class="iimg" src="../assets/images/wechat.jpg" />
        <el-button slot="reference"><img class="icon_btn" src="../assets/images/qq_icon.png" /></el-button>
      </el-popover>
    </section>
  </div>
</template>
<script>
export default {
  inject: ["reload"],
  data() {
    return {
      list: [],
      num: 1,
      batchPartNum: 0,
      onePart: [],//单选零件
      batchPart: []//批量选件
    };
  },
  computed:{
    // totalSumAll(){
    //   let totalSumAll = 0;
    //   if(this.batchPart.length != 0){
    //     for(let i = 0; i < this.batchPart.length; i++) {
    //       for(let j = 0; j < this.batchPart[i][1].partlist.length; j++) {
    //         totalSumAll += this.batchPart[i][1].partlist[j].Quantity;
    //       }
    //     }        
    //   } else {
    //     return 0
    //   }
    //   if(isNaN(totalSumAll)){
    //     return 0
    //   }
    //   return totalSumAll;
    // },
    totalSum(){
      return function(id) {
        let totalSum = 0;
        if(this.batchPart.length != 0){
          for(let j = 0; j < this.batchPart[id][1].partlist.length; j++) {
            totalSum += this.batchPart[id][1].partlist[j].Quantity * this.batchPart[id][1].partlist[j].partPrice;
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
  // computed: {
  //   getUploadData() {
  //     let uplist = localStorage.getItem('uploadcartlist');
  //     return uplist;
  //   }
  // },
  // watch: {
  //   getUploadData(newValue, oldValue) {
  //     console.log(newValue);
  //     this.list = newValue;
  //   }
  // },
  created: function () {
    this.shopcart();
  },
  methods: {
    shopcart() {
      let uplist = localStorage.getItem('uploadcartlist');
      if(uplist) {
      this.batchPart = JSON.parse(uplist);
      } else {
        this.batchPart = [];
      }
      this.batchPartNum = this.batchPart.length;
    },
    UploadData() {
      let uplist = localStorage.getItem('uploadcartlist');
      // console.log(uplist);
      // uplist = JSON.parse(uplist);
      if(uplist) {
      this.batchPart = JSON.parse(uplist);
      } else {
        this.batchPart = [];
      }
      // console.log(this.batchPart);
    },
    batchPartDelect(id) {
      let res = this.batchPart;
      res.splice(id,1);
      // console.log(res);
      res = JSON.stringify(res);
      localStorage.setItem("uploadcartlist", res);
      this.reload();
    },
    shopcar(){
      // console.log(this.batchPart);
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
  position: relative;
  margin: 0 auto;
  .main_body {
    width: 100px;
    margin: 0 auto;
    position: fixed;
    right: 50px;
    bottom: 150px;
  }
}
.shopcar{
      width: auto;
      height: 530px;
      margin: 0 auto;
      .partbox{
        width: auto;
        height: auto;
        margin: 0 auto;
        padding: 0 10px;
        .box_title{
          height: 48px;
          line-height: 48px;
          width: calc(100% - 20px);
          border-bottom: 1px solid #f0f0f0;
          p{
            &:first-child{
              width: 280px;
              text-align: left;
              // padding-left: 5%;
            }
            &:nth-child(2){
              width: 70px;
              text-align: center;
            }
            &:last-child{
              width: 120px;
              text-align: center;
            }
          }
        }
        .box_body{
          width: 100%;
          height: 400px;
          overflow-y: scroll;
          .box_body_b{
            width: 100%;
            height: auto;
            .box_body_t{
              width: 100%;
              height: auto;
              margin: 10px auto;
            }
            .box_body_c{
              width: 100%;
              height: 50px;
              line-height: 50px;
              margin: 0 auto 10px;
              p{
                vertical-align: top;
                display: inline-block;
                height: 50px;
                line-height: 50px;
              }
              .part_name{
                width: 270px;
                text-align: left;
                font-weight: 400;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                span{
                  height: 50px;
                  line-height: 50px;
                  display: inline-block;
                  max-width: 155px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  padding-right: 10px;
                  vertical-align: middle;
                  img{
                    height: 50px;
                    width: 50px;
                  }
                }
                .isLong {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              .part_num{
                width: 70px;
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
                width: 110px;
                height: auto;
                margin: 0 auto;
                text-align: center;
              }
            }
          }
        }
        .box_bottom{
          width: 100%;
          height: auto;
          margin: 0 auto;
          padding: 30px 0 10px;
          .all_price{
            color: #000;
            font-size: 16px;
            font-weight: bold;
            span{
              color: #0097fc;
              font-size: 20px;
            }
          }
        }
      }
    }
// .el-input-number--mini{
//   width: 80%;
// }
.item{
}
.icon_btn{
  width: 45px;
  height: 45px;
}
.icon_box{
  margin: 20px 0;
  display: block;
}
.iimg {
  width: 200px;
  height: 200px;
}
</style>
<stylelang="scss" type="text/css">
@import "../../static/css/_app.scss";

.el-input-number--mini .el-input__inner{
  padding-left: 28px !important;
  padding-right: 28px !important;
}
.el-input-number--mini .el-input-number__decrease, .el-input-number--mini .el-input-number__increase{
  width: 25px  !important;
  }
  </style>
