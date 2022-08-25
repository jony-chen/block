<template>
<div>
<iframe name="iframe" id="iframe" src="http://192.168.0.105:8848/threejs_module/ldr/index.html" width="800px" height="450px"></iframe> 
<!-- <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-change="loadTextFromFile"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload> -->
 <div>
   <input type="text" v-model="message" v-text="message"><button class="btn" @click="post">post</button> 
    <!-- <el-button @click="txtbtn">插入文本</el-button> -->
    <input type="file" @change="loadTextFromFile" id="txt"  />
    <!-- 文件格式ldr -->
  </div>
</div>
</template>
<script>
// import Home from "../service/home";
//  import wxlogin from 'vue-wxlogin';
export default {
  data() {
    return {
      txtTitle: "",
      message: "",
      content: "",
      textInfo: "",
      fileList: []
    };
  },
  components: {
  },
methods:{
  // txt文本
    // txtbtn() {
    //   document.getElementById("txt").click();
    // },
    loadTextFromFile(e) {
      const file = e.target.files[0];
      let name = file.name.split(".").splice(-1).toString();
      if (name !== "ldr") {
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
    dealNum(item) {
      this.txtTitle = item.trim().split('\r')[0].toString();  //获取标题
      // alert(item.trim().split('\r').length);
      let index = item.indexOf('\r');
      this.content = item.substring(index + 2, item.length); //获取内容
      // console.log(this.content);
    },
    post() {   
      let that = this;
      let keyStr = 'bmw6KwrUwnlleBVZl12r0peD4R3Ycnm4';//加密标题密钥key
      let ivStr = 'bmw6KwrUwnlleBVZ';//加密标题密钥key
      if(that.txtTitle != '') {
        let txtcon = that.txtTitle;//获取标题
        let nowdate = (Date.parse(new Date()) / 1000).toString(); //当前时间精确到秒
        let word = txtcon + '(' + nowdate;//标题部分加盐
        let str = this.encrypt(word,keyStr,ivStr); //标题加密后的结果
        let sec_key = this.getkey(str); //获取内容的key
        let sec_iv = sec_key.substring(0, 16);//加密内容iv
        // console.log(sec_key);
        // console.log(sec_iv);
        let sec_word = that.content;//获取内容部分
        let sec_str = this.encrypt(sec_word,sec_key,sec_iv);//内容部分加密
        that.message = str + '&' + sec_str;//标题加内容
      } 
      // let word = '';
      // this.decrypt(word);
      let iframe = document.getElementById('iframe');
      iframe.contentWindow.postMessage( this.message, "http://192.168.0.105:8848"); 
    },
    //获取内容的key
    getkey(str) {
        //这里的str是标题加密后的结果
        let num = str.replace(/[^0-9]/ig,""); //取纯数字部分
        let fir_leng = num.substr(num.length-1 ,1); //取纯数字部分最后一位
        let _frist = str.substring(0,fir_leng); //加密内容密钥第一部分
        let sec_leng = str.length - (32 - _frist.length);
        let _second = str.substring(sec_leng, str.length); //加密内容密钥第二部分
        let sec_key = _frist + _second;//加密内容密钥key
        return sec_key;
    },
    //加密
    encrypt(word,keyStr,ivStr) {
        keyStr = keyStr ? keyStr : "bmw6KwrUwnlleBVZl12r0peD4R3Ycnm4";
        ivStr = ivStr ? ivStr : "bmw6KwrUwnlleBVZ";
        let key = this.$CryptoJS.enc.Utf8.parse(keyStr);
        let iv = this.$CryptoJS.enc.Utf8.parse(ivStr);
        let srcs = this.$CryptoJS.enc.Utf8.parse(word);
        let encrypted = this.$CryptoJS.AES.encrypt(srcs, key, {
            iv,
            mode: this.$CryptoJS.mode.CBC,
            padding: this.$CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString();
    },
    //解密
    decrypt(word, keyStr, ivStr) {
        let that = this;
        word = word.toString();
        keyStr = keyStr ? keyStr : "bmw6KwrUwnlleBVZl12r0peD4R3Ycnm4";
        ivStr = ivStr ? ivStr : "bmw6KwrUwnlleBVZ";
        let key = this.$CryptoJS.enc.Utf8.parse(keyStr);
        let iv = this.$CryptoJS.enc.Utf8.parse(ivStr);
        let data = that.$CryptoJS.enc.Hex.parse(word);
        let srcs = that.$CryptoJS.enc.Base64.stringify(data);
        var decrypt = that.$CryptoJS.AES.decrypt(srcs, key, {
          iv: iv,
          mode: that.$CryptoJS.mode.CBC,
          padding: that.$CryptoJS.pad.Pkcs7
      });
        return that.$CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
  },
};
</script>
<style scoped>
input{
  width: 300px;
  height: 50px;
}
.btn {
  height: 50px;
  width: 100px;
  text-align: center;
  font-size: 16px;
}
</style>