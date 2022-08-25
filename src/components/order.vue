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
          <p>地址管理</p>
        </div>
        <div class="box_body_bd  d-flex align-items-center" v-if="showAdd">
          <div class="delivery">
            <p><span>收件人姓名：</span>{{this.form.name}}</p>
            <p><span>收件人手机号：</span>{{this.form.phone}}</p>
            <p><span>收件地址：</span>{{this.form.address}}</p>
          </div>
          <el-button type="text" @click="dialogFormVisible = true" v-if="showAdd" >  修改地址</el-button>
        </div>
        <div class="box_body_bd">
          <el-button type="text" @click="dialogFormVisible = true" v-if="!showAdd">+ 添加新地址</el-button>
          <div  class="dialog">
            <el-dialog title="收货地址" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="30%">
              <el-form :model="form" :rules="formRules" class="nowfrom">
                <div class="d-flex align-items-center justify-content-space-between">
                  <el-form-item label="收件人姓名" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="地址" prop="address">
                  <v-region-selects @change="regionChange" :town="true" />
                  <el-input type="textarea" :rows="5" v-model="form.address"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="exit()">取 消</el-button>
                <el-button type="primary" @click="submitAdd()">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </div>
        <div class="box_title d-flex align-items-center justify-content-space-between">
          <p>商品列表</p>
        </div>
        <div class="box_body_b" >
          <div class="box_part_title d-flex align-items-center justify-content-space-between">
            <p class="box_part_title_name">零件名</p>
            <p class="box_part_title_num">单价</p>
            <p class="box_part_title_price">数量</p>
            <p class="box_part_title_total">小计</p>
          </div>
          <div class="box_body_b box_body_box_s" v-for="(res, index) in this.batchPart" :key="index">
            <div class="box_body_box_b d-flex align-items-center justify-content-normal">
              <span class="box_img_box">
                <img src="../assets/images/bulkCartList.png" alt="" class="flex_pic" />
              </span>
              <div class=" part_box_t d-block text-left">
                <h3>{{res[0].partname}}</h3>
                <p>合计：{{res[1].partlist.length}} 种零件,<span>{{totalSumAll}}</span> pcs</p>
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
                <p class="part_price">{{ item.partPrice }}</p>
                <p class="part_num">{{item.Quantity}}</p>
                <p class="part_price">{{ item.Quantity * item.partPrice }}</p>
              </div>
            </div>
          </div>
          <div class="order">
            <div class="d-block">
              <p>合计：
                <span class="allprice">￥ {{ totalSumAllPrice }}</span>
                <span>(不含邮费)</span>
              </p>
              <dd>( 运费：￥10)</dd>
              <dd>*偏远地区￥30</dd>
              <dl>品牌商品邮费另外计算</dl>
              <el-button type="primary" @click="submit()">提交订单</el-button>
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
    </section>
    <foot></foot>
  </div>
</template>
<script>
import Home from "../service/home";
import { Loading } from "element-ui";
import AddJson from "../service/address";
import foot from "../../src/components/foot";
export default {
  inject: ["reload"],
  data() {
    // 验证收件人姓名是否合法
    var checkName = (rules, value, callback) => {
      const regMobile = /^((?!\\|\/|:|\*|\?|<|>|\||'|%).){1,10}$/;
      if (regMobile.test(value) == true) {
        return callback();
      } else {
        callback(new Error("收件人姓名不大于16 位，不能包含特殊符号！"));
      }
    };
    // 验证手机号是否合法
    var checkMobile = (rules, value, callback) => {
      const regMobile = /^(0|86)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value) == true) {
        return callback();
      } else {
        callback(new Error("请输入合法的手机号"));
      }
    };
    return {
      // 验证规则
      formRules: {
        name: [
          { required: true,message: "请输入您的收件人姓名", trigger: "blur" },
          { validator: checkName, trigger: "blur" },
        ],
        phone: [
          { required: true,message: "请输入您的手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        address: [
          { required: true,message: "请输入您的收货地址", trigger: "blur" },
        ]
      },
      batchPart: [],
      dialogFormVisible: false,
      form: {
        name: '',
        phone: '',
        address: ''
      },
      showAdd: false,
      username: '',
      AllPCS: 0,
      totalAllPrice: 0,
      selectAdd: '',
      addjson: AddJson.data

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
            totalSumAll += parseInt(this.batchPart[i][1].partlist[j].Quantity);
          }
        }        
      } else {
        return 0
      }
      if(isNaN(totalSumAll)){
        return 0
      }
      this.AllPCS = totalSumAll;
      return totalSumAll;
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
      this.totalAllPrice = totalSumAll;
      return totalSumAll;
    },
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
      let batchPartarr = localStorage.getItem("uploadcartlist");
      this.username = localStorage.getItem("username");
      let add = await Home.getAddress('getadd',this.username);
      // console.log(add.data[0].deliveryname);
      if(add.data[0].deliveryname) {
        this.showAdd = true;
        this.form.name = add.data[0].deliveryname;
        this.form.phone = add.data[0].deliveryphone;
        this.form.address = add.data[0].deliveryaddress;
      } else {
        this.showAdd = false;
      }
      if(batchPartarr) {
        batchPartarr = JSON.parse(batchPartarr);
        this.batchPart = batchPartarr;
        // console.log(this.batchPart);
      } else {
        this.batchPart = [];
      }
      thisLoading.close();
    },
    async submitAdd(){
      if(this.form.name == '') {
        this.$message.error('收件人姓名不能为空！');
      } else if(this.form.phone == '') {
        this.$message.error('手机号不能为空！');
      } else if(this.form.address == '') {
        this.$message.error('收件地址不能为空！');
      } else{
        await Home.getAddress('addadd',this.username,this.form.name,this.form.phone,this.form.address);
        this.$message.success('操作成功');
        // console.log(add);
      }
      this.reload();
    },
    exit() {
      this.reload();
      this.dialogFormVisible = false;
    },
    async submit(){
      let pcs = this.AllPCS;
      let total = this.totalAllPrice;
      if(this.form.name == '' || this.form.phone == '' || this.form.address == '') {
        this.$message.error('请完善您的收货信息');
      } else if(this.batchPart == '') {
        this.$message.error('您还没添加任何产品');
      } else{
        let res = await Home.order(this.username,this.form.name,this.form.phone,this.form.address,this.batchPart, pcs, total);
        if(res.data.code == 8840) {
          this.$message.success('提交成功！');
          localStorage.setItem("onepartlist", '');
          localStorage.setItem("uploadcartlist", '');
          this.$router.push({ path:'/myorder'});
        } else if(res.data.code == 8841){
          this.$message.success('提交失败！');
        } else {
          console.log(res);
        }
      }
      // console.log(res);
    },
    regionChange(add){
      if(add.province){
        this.form.address = add.province.value;
      }
      if(add.city){
        this.form.address = add.province.value + add.city.value;
      }
      if(add.area){
        this.form.address = add.province.value + add.city.value + add.area.value ;
      }
      if(add.town){
        this.form.address =  add.province.value + add.city.value + add.area.value + add.town.value;
      }
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
      }
      .box_body_bd {
        width: 100%;
        height: auto;
        margin: 10px auto;
        .delivery{
          text-align: left;
          margin: 50px ;
          width: auto;
          height: auto;
          overflow: hidden;
          p{
            font-size: 18px;
            font-weight: bold;
            max-width: 800px;
            word-break:break-all;
            margin: 0 10px;
            span{
              width: 120px;
              display: inline-block;
              text-align: right;
              font-size: 16px;
              color: #000;
              font-weight: normal;
              margin: 5px 10px 5px 0;
            }
            
          }
        }
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
        height: auto;
        p{
          margin-bottom: 20px;
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
      }
    }
  }
}
</style>
