<template>
  <div class="main">
    <footer class="footer">
      <div class="footer_box">
        <h2 class="">关于我们</h2>
        <p>致力打造积木3D模型分享展示、玩家互动交流的新型平台。</p>
        <div class="code_box d-flex align-items-center justify-content-space-between">
          <div class="wechat_box d-block">
            <img src="../assets/images/wechat.jpg" />
            <h3>公众号</h3>
          </div>
          <div class="dou_box d-block">
            <img src="../assets/images/dou.png" />
            <h3>抖音</h3>
          </div>
        </div>
        <div class="remind_box">
          <a class="" href="#" >上传须知</a>
          <a class="" href="#" >用户协议</a>
          <a class="" href="#" >隐私协议</a>
          <a class="" href="#" >积木模型库声明</a>
        </div>
        <div class="icp_box">
          <div class="">© 2020-2030 3dblockstar.com 版权所有 ICP证:
            <a href="http://beian.miit.gov.cn" target="_black">桂ICP备2020007803号</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  inject: ["reload"],
  data() {
    return {
    };
  },
  components: {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/css" scoped>
@import "../../static/css/_app.scss";
.main{
  max-width: 2000px;
  width: 100%;
  height: auto;
  margin: 0 auto;
  .footer{
    background-color: #fff;
    text-align: center;
    padding: 45px 0 0;
    .footer_box{
      width: 100%;
      margin: 0 auto;
      h2{
        font-size: 30px;
        color: #4fb7de;
      }
      p{
        font-size: 14px;
      }
      .code_box{
        width: 100%;
        height: auto;
        margin: 10px auto;
        .wechat_box,.dou_box{
          height: auto;
          width: auto;
          img{
            width: 180px;
            height: 180px;
          }
          h3{
            font-size: 16px;
            color: #000;
          }
        }
      }
      .remind_box{
        width: 100%;
        height: auto;
        margin: 0 auto 10px;
        a{
          margin: 0 5px;
          color: #40a9ff;
        }
      }
      .icp_box{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 10px 0;
        border-top: 1px solid #ccc;
        a{
          margin: 0 5px;
          color: #40a9ff;
        }
      }
    }
  }
}

</style>
