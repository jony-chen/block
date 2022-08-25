<template>
  <div class="main">
    <section class="main_body">
      <header
        class="head d-flex align-items-center justify-content-space-between"
      >
        <router-link to="/admin">
          <div class="logo d-flex align-items-center">
            <i class="logo_img">
              <img src="../assets/images/logo.svg" />
            </i>
            <h2 class="logo_t">3dblockstar后台管理系统</h2>
          </div>
        </router-link>
        <div class="head_name d-flex align-items-center justify-content-space-between ">
          <dl>欢迎您，</dl>
          <dd>{{adminName}}</dd>
          <p @click="exit">退出</p>
        </div>
      </header>
      <div class="select_box">
        <el-input v-model="orderNum" class="select_input" placeholder="请输入查询的订单号或手机号码"></el-input>
        <el-button type="primary" class="select_btn" @click="select(orderNum)">查询</el-button>
        <!-- <el-button v-if="orderShow" class="select_btn" @click="back()"></el-button> -->
        <el-button class="select_btn" @click="back()">{{orderShow?'返回':'刷新'}}</el-button>
      </div>
      <div class="all_order" v-if="!orderShow">
        <div class="all_order_select d-flex align-items-center">
          <p>订单状态：</p>
          <el-select v-model="selectValue" @change="selectStatus(selectValue)" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
           </el-option>
          </el-select>
        </div>
        <div class="ao_list_box">
          <div class="ao_list" v-for="(res, index) in this.orderAll" :key="index">
            <div class="ao_row d-flex align-items-center justify-content-space-between ">
              <p style="width:90px;">
                NO.<span>{{index + 1}}</span>
              </p>
              <el-tooltip class="tooltip" :content="partname(index)" placement="bottom" effect="light">
              <p style="width:300px;">
                订单编号：<span style="cursor: pointer;text-decoration: underline;" @click="select(res.orderCode)">{{res.orderCode}}</span>
              </p>
              </el-tooltip>
              <p style="width:280px;">
                用户名：<span>{{res.username}}</span>
              </p>
              <p style="width:280px;">
                收货人姓名：<span>{{res.deliveryname}}</span>
              </p>
              <p style="width:220px;">
                手机号码：<span>{{res.deliveryphone}}</span>
              </p>
              <p class="now_order_status">
                订单状态：
                <span v-if="res.status == 1" style="background:#ff0000">待付款</span>
                <span v-if="res.status == 2" style="background:#ffd600">待收货</span>
                <span v-if="res.status == 3" style="background:#17ff00">已完成</span>
              </p>
              <p>
                下单时间：<span>{{res.time}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="body_box" v-if="orderShow">
        <div class="box_title d-flex align-items-center justify-content-space-between">
          <p>当前订单：<span>{{batchPart.orderCode}}</span></p>
          <el-button style="margin-right:15px;" type="success" @click="output">导出</el-button>
        </div>
        <div class="box_body_b">
          <div class="order_box">
            <div class="order_title d-flex align-items-center justify-content-space-between">
              <div class="order_no">订单编号：<span>{{batchPart.orderCode}}</span></div>
              <div class="order_time">{{batchPart.time}}</div>
            </div>
            <div class="box_part_title d-flex align-items-center justify-content-space-between">
              <p class="box_part_title_name">零件名</p>
              <p class="box_part_title_num">单价</p>
              <p class="box_part_title_price">数量</p>
              <p class="box_part_title_total">小计</p>
            </div>
            <div class="box_body_b box_body_box_s" v-for="(res, index) in this.batchPart.batchPart" :key="index">
              <div class="box_body_box_b d-flex align-items-center justify-content-normal">
                <span class="box_img_box">
                  <img src="../assets/images/bulkCartList.png" alt="" class="flex_pic" />
                </span>
                <div class=" part_box_t d-block text-left">
                  <h3>{{res[0].partname}}</h3>
                  <p>合计：{{res[1].partlist.length}} 种零件,<span>{{ (totalSumAll(index)) }}</span> pcs</p>
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
                <span v-if="batchPart.status == 1">待付款</span>
                <span v-if="batchPart.status == 2">待收货</span>
                <span v-if="batchPart.status == 3">已完成</span>
              </dd>
              <div class="logistics" v-if="batchPart.status != 1">
                <dd>物流信息：<span>{{batchPart.logistics}}</span></dd>
              </div>
              <div class="logistics">
                <dd>备注：<span>{{batchPart.info}}</span></dd>
              </div>
              <div class="btn_box">
                <el-button type="primary" @click="dialogForm = true">更改订单状态</el-button>
                <el-dialog title="更改订单状态" :visible.sync="dialogForm" width="30%">
                  <el-form ref="statusFormref" :model="statusForm" label-position="top" label-width="80px">
                    <el-form-item label="订单状态：">
                      <el-radio-group v-model="statusForm.status">
                        <el-radio :label="1">待付款</el-radio>
                        <el-radio :label="2">待收货</el-radio>
                        <el-radio :label="3">已完成</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="statusForm.status != 1 " label="物流信息：">
                      <el-input v-model="statusForm.logistics"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：（选填）">
                      <el-input type="textarea" v-model="statusForm.info"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit">提交</el-button>
                      <el-button @click="dialogForm = false">取消</el-button>
                    </el-form-item>
                  </el-form>
                </el-dialog>
              </div>
            </div>
            <div class="d-block">
              <dd>( 运费：￥10)</dd>
              <dd>*偏远地区￥30</dd>
              <!-- <dd>共：{{batchPart.pcs}} pcs</dd> -->
              <dl>品牌商品邮费另外计算</dl>
              <p>合计：
                <span class="allprice">￥ {{ batchPart.total }}</span>
                <span>(不含邮费)</span>
              </p>
            </div>
          </div>
          <div class="info">
            <div class="box_body_bd  d-flex align-items-center">
              <div class="delivery">
                <p><span>收件人姓名：</span>{{batchPart.deliveryname}}</p>
                <p><span>收件人手机号：</span>{{batchPart.deliveryphone}}</p>
                <p><span>收件地址：</span>{{batchPart.deliveryaddress}}</p>
              </div>
              <el-button type="primary" @click="dialogFormVisible = true" >修改收件信息</el-button>
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
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitAdd()">确 定</el-button>
                  </div>
                </el-dialog>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
    <!-- <foot></foot> -->
  </div>
</template>
<script>
import Home from "../service/home";
import foot from "../../src/components/foot";
import { Loading } from "element-ui";
import table2excel from 'js-table2excel';
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
      orderShow: false,
      orderNum: '',
      allPart: [],
      options:[
        {
          label: "全部订单",
          value: 0
        },
        {
          label: "待付款",
          value: 1
        },
        {
          label: "待收货",
          value: 2
        },
        {
          label: "已完成",
          value: 3
        }
      ],
      selectValue: 0,
      pendingpay: [],
      pendingget: [],
      complete:[],
      batchPart: [],
      activeName: "allorder",
      showAdd: false,
      adminName: '',
      username: '',
      totalAll: 0,
      dialogForm: false,
      timeToken: 0,
      statusForm: {
        status: 1,
        logistics: "",
        info: "",
      },
      orderAll:"",
      dialogFormVisible: false,
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
    };
  },
  components: {
    foot: foot,
  },
  mounted() {
    // this.order();
  },
  computed:{
    totalSumAll(){
      return function (data){
      let totalSumAll = 0;
      if(this.batchPart.batchPart.length != 0){
        // for(let i = 0; i < this.batchPart.batchPart.length; i++) {
          for(let j = 0; j < this.batchPart.batchPart[data][1].partlist.length; j++) {
            totalSumAll += parseInt(this.batchPart.batchPart[data][1].partlist[j].Quantity);
          }
        // }        
      } else {
        return 0
      }
      if(isNaN(totalSumAll)){
        return 0
      }
      this.AllPCS = totalSumAll;
      return totalSumAll;
      }
    },
    partname(){
      return function (data){
      let totalSumAll = '';
      if(this.orderAll.length != 0){
        for(let j = 0; j < this.orderAll[data].batchPart.length; j++) {
          totalSumAll += this.orderAll[data].batchPart[j][0].partname;
          if(j != this.orderAll[data].batchPart.length - 1) {
            totalSumAll += "、";
          }
        }        
      } else {
        return 
      }
      return totalSumAll;
      }
    },
  },
  created: function () {
    this.order();
  },
  watch: {
  },
  methods: {
    //图片损毁时触发
    defaultSrc(event) {
      const img = event.srcElement; // 刚开始是以参数的形式定义的，但是默认的图片一直不能使用，遂改为此方式
      img.src = require("../assets/images/default.png"); // 默认一张图片。若是public中的图片，直接 ./ 就可以
      img.οnerrοr = null; // 若默认的图片地址亦无法正常使用，添加此可控制不一直跳动
    },
    async order() {
      this.adminName = localStorage.getItem("adminName");
      let timeToken = localStorage.getItem("adminLastTime");
      let data = Date.parse(new Date()) / 1000  - timeToken ;
      let datares =  await Home.admin('selectAll','','','','');
      this.orderAll = datares.data.data;
      if(data > 86400) {
        localStorage.setItem("isAdminLogin", JSON.stringify(false));
        localStorage.removeItem("adminName");
        this.$router.push({ path:'/adminlogin'});
        // this.reload();
      } 
    }, 
    exit() {
      this.$confirm("您确认要退出登录吗", "提示信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          this.$message({
            type: "success",
            message: "退出成功",
          });
          localStorage.setItem("isAdminLogin", JSON.stringify(false));
          localStorage.removeItem("adminName");
          this.$router.push({ path:'/adminlogin'});
          this.reload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已经取消退出",
          });
          return;
        });
    },
    async select(data) {
      var thisLoading = Loading.service({
        lock: true,
        text: "loading",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.7)",
      });
      if(data == ''){
        this.$message.error('请输入查询的订单号或手机号码');
      } else {
        let res = await Home.admin('select','','','',data);
        if(res.status == 200) {
          thisLoading.close();
          if(data.length == 19){
            if(res.data.data.length == 0) {
              this.$message.error('查询不到此订单！');
            } else {
              this.orderShow = true;
              this.orderNum = data;
              this.batchPart = res.data.data[0];
              this.statusForm.status = res.data.data[0].status;
              this.statusForm.logistics = res.data.data[0].logistics;
              this.form.name = this.batchPart.deliveryname;
              this.form.phone = this.batchPart.deliveryphone;
              this.form.address = this.batchPart.deliveryaddress;
              this.username = this.batchPart.username;
            }
          } else {
            this.selectValue = 0;
            this.orderAll= res.data.data;
          }
        } else {
          this.$message.error('网络连接错误');
        }
      }
    },
    async selectStatus(data){
      // console.log(data);
      let datares = await Home.admin('selectAll','','','',data);
      this.orderAll = datares.data.data;
      this.orderNum = '';
      // let phone = this.orderNum;
      // if(phone != ''){
      //   if(phone.length != 19) {
      //     let res = await Home.admin('selectAll','','',phone,data);
      //     this.orderAll = res.data.data;
      //   }
      // }
    },
    onSubmit() {
      if(this.statusForm.status == 2 && this.statusForm.logistics == "") {
        this.$message.error('物流信息不能为空！');
        return;
      }
      if(this.statusForm.status == "") {
        this.$message.error('订单状态不能为空！');
      } else {
        this.$confirm('此操作将改变订单状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let res = await Home.admin('change','','',this.orderNum,this.statusForm);
          if(res.data) {
            this.$message.success('状态更改成功!');
            this.dialogForm = false;
            // this.reload();
            this.select(res.data);
          }
        }).catch(() => {
          this.$message({type: 'info',message: '已取消'});          
          this.dialogForm = false;
        });
      }
    },
    output() {
      const column = [
        { title: 'Part',key: 'Part',type: 'text' },
        { title: 'Images',key: 'images',type: 'image',width: 80,height: 80 },
        { title: 'Color',key: 'Color',type: 'text' },
        { title: 'Quantity',key: 'Quantity',type: 'text' }
      ];
      let tableData = [];
      let batchPartArr = this.batchPart;
      for(var j = 0; j < batchPartArr.batchPart.length; j++) {
        // tableData.push(batchPartArr.batchPart[j][1].partlist);
        for(var i = 0; i < batchPartArr.batchPart[j][1].partlist.length; i++){
          let img = 'https://pic-1302893429.cos.ap-nanjing.myqcloud.com/items/' + batchPartArr.batchPart[j][1].partlist[i].Color + '/' + batchPartArr.batchPart[j][1].partlist[i].Part + '_' + batchPartArr.batchPart[j][1].partlist[i].Color + '.png';
          batchPartArr.batchPart[j][1].partlist[i]['images'] = img;
          tableData.push(batchPartArr.batchPart[j][1].partlist[i]);
        }
        let titlename = {
          Part: '以上是' + batchPartArr.batchPart[j][0].partname + '的零件',Images: '',Color: '',Quantity: '共：'+ batchPartArr.batchPart[j][1].partlist.length + '种零件'
        }
        tableData.push(titlename);
      }
      
      let delivery = {
          Part: '收件人姓名：' + batchPartArr.deliveryname + '           ' +'收件人号码：' + batchPartArr.deliveryphone, Images: '', Color: '收件人地址：'+ batchPartArr.deliveryaddress, Quantity: '合计：' + batchPartArr.total + '元(不含邮费)'
        }
      tableData.push(delivery);
      let tableDatas = JSON.parse(JSON.stringify(tableData));
      table2excel(column, tableDatas, '订单'+ batchPartArr.orderCode +'零件表');
    },
    submitAdd(){
      if(this.form.name == '') {
        this.$message.error('收件人姓名不能为空！');
      } else if(this.form.phone == '') {
        this.$message.error('手机号不能为空！');
      } else if(this.form.address == '') {
        this.$message.error('收件地址不能为空！');
      } else{
        this.$confirm('此操作将改变收件信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          let res = await Home.admin('address','','',this.orderNum,this.form);
          if(res.data) {
            this.$message.success('地址更改成功!');
            this.dialogFormVisible = false;
            // this.reload();
            this.select(res.data);
          }
        }).catch(() => {
          this.$message({type: 'info',message: '已取消'});          
          this.dialogFormVisible = false;
        });
      }
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
    },
    back(){
      this.reload();
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
      }
      .box_body_bd {
        width: 100%;
        height: auto;
        margin: 10px auto;
        text-align: left;
        .delivery{
          text-align: left;
          margin: 20px 0;
          width: auto;
          height: auto;
          overflow: hidden;
          p{
            font-size: 18px;
            font-weight: bold;
            max-width: 800px;
            min-width: 800px;
            word-break:break-all;
            margin: 0 10px;
            span{
              width: 120px;
              display: inline-block;
              text-align: left  ;
              font-size: 16px;
              color: #000;
              font-weight: normal;
              margin: 5px 10px 5px 0;
            }
            
          }
          .change_btn{
            margin-right: 50px;
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
            max-width: 800px;
          }
          .btn_box{
            text-align: left;
            margin: 20px 15px;
          }
        }
        .dialog{
          text-align: center;
        }
      }
    }
    .select_box{
      padding: 20px 0;
      width: 100%;
      height: auto;
      margin: 0 auto;
      .select_input{
        margin: 30px auto;
        width: 500px;
      }
    }
    .all_order{
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid #eee;
      -webkit-box-shadow: 0 0 10px 0 rgb(8 1 3 / 20%);
      box-shadow: 0 0 10px 0 rgb(8 1 3 / 20%);
      padding: 20px 10px;
      width: 100%;
      .all_order_select{
        margin-bottom: 20px;
        padding: 0 10px;
      }
      .ao_list_box{
        height: 1000px;
        overflow-x: hidden;
        overflow-y: scroll;
      }
      .ao_list{
        margin: 0 auto;
        padding: 10px;
        border-bottom: 1px dashed #c0c0c0;
        min-width: 1900px;
        &:hover{
          background: #f0f0f0;
          cursor: pointer;
        }
        p{
          text-align: left;
          width: auto;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .now_order_status{
          span{
            width: 80px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            display: inline-block;
            color: #fff;
            font-weight: bold;
            font-size: 14px;
            border-radius: 5px;
          }
        }
      }
    }
    .head_name{
      width: auto;
      height: 40px;
      color: #fff;
      margin-right: 20px;
      dl{
        height: 40px;
        line-height: 40px;
      }
      dd{
        height: 40px;
        line-height: 40px;
        margin: 0 10px 0 5px;
      }
      p{
        height: 40px;
        line-height: 40px;
        margin: 0 10px 0 5px;
        cursor: pointer;
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
