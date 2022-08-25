<template>
  <div id="upload">
    <input
      id="pic"
      type="file"
      accept="image/png,image/jpg,image/jpeg"
      name="pic"
    />
    +
  </div>
  <div id="summit" @click="upload">上传</div>
  <div id="preview"></div>
</template>
<script>
import cloudbase from "@cloudbase/js-sdk";

export default {
  data() {
    return {};
  },
  mounted() {
    var fileinput = document.getElementById("pic"),
      preview = document.getElementById("preview"); // 获取对象
    fileinput.addEventListener("change", function () {
      //监听 input 的 change事件
      if (!fileinput.value) {
        // 判断当前是否有文件
        console.log("no pic");
        return;
      } else {
        console.log("success");
      }
      var file = fileinput.files[0]; //如果有，则获取到文件
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg"
      ) {
        //判断文件是否符合img
        alert("仅支持jpeg和png");
        fileinput.value = ""; //如不符合则清空value以及backgroundImage
        preview.style.backgroundImage = "url(#)";
        return;
      } else {
        var reader = new FileReader();
        reader.onload = function (e) {
          var data = e.target.result;
          preview.style.backgroundImage = "url(" + data + ")";
        };
        reader.readAsDataURL(file);
        console.log(file.name);
      }
    });
  },
  methods: {
    upload() {
      const app = cloudbase.init({
        region: "ap-guangzhou",
        env: "demo1-8g8eqigqa29e496c",
      });

      app.uploadFile({
          // 云端路径
          cloudPath: document.getElementById("pic").files[0].name,
          // 需要上传的文件，File 类型
          filePath: document.getElementById("pic").files[0],
        })
        .then((res) => {
          // 返回文件 ID
          console.log(res.fileID);
          console.log("上传成功");
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
