<template>
  <el-card class="image-card">
    <div slot="header">
      <span>素材管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active">
        <el-radio-button label="全部" @click.native="loadImages(false)"></el-radio-button>
        <el-radio-button label="收藏" @click.native="loadImages(true)"></el-radio-button>
      </el-radio-group>
      <!-- <el-button type="primary">上传图片</el-button> -->
      <!--
        on-success 是一个prop参数
        prop绑定的是一个表达式，它会将表达式的计算结果绑定到这里
        {{函数}}
        {{函数}}
        v-bind中的语法和{{}}中的一致
      -->
        <el-upload
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
        name="image"
        v-bind:on-success="handleUploadSuccess"
        :show-file-list="false"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-row :gutter="20">
      <el-col :span="5" v-for="item in images" :key="item.id">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" style="max-width: 100%;">
          <!-- <div style="padding: 10px; display: flex; justify-content: center;"> -->
          <el-button
            type="primary"
            :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle
            plain
            @click="handleCollect(item)"
          ></el-button>
          <el-button type="primary" icon="el-icon-delete" circle plain @click="handleDelete(item)"></el-button>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "ImgList",
  data() {
    return {
      active: "全部",
      images: []
    };
  },
  created() {
    this.loadImages();
  },
  methods: {
    // 当上传组件上传文件成功的时候会调用
    handleUploadSuccess() {
      this.loadImages(false)
    },
    async loadImages(collect = false) {
      this.$http({
        method: "GET",
        url: "/user/images",
        params:{
          collect // true:收藏图片 false:全部图片
        }
      }).then(data => {
        this.images = data.results;
      });
    },
    // 收藏图片素材
    handleCollect(item) {
      const collect = !item.is_collected;
      this.$http({
        method: "PUT",
        url: `/user/images/${item.id}`,
        data: {
          collect: !item.is_collected
        }
      })
        .then(data => {
          item.is_collected = collect;
          this.$message({
            type: "success",
            message: `${collect ? "" : "取消"}收藏成功`
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error(`${collect ? "" : "取消"}收藏失败`);
        });
    },
    // 删除图片素材
    handleDelete(item) {
      this.$http({
        method: 'DELETE',
        url: `/user/images/${item.id}`
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          // 删除之后刷新数据列表
          this.loadImages()
        })
        .catch(err => {
          console.log(err);
          this.$message.error("删除失败");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.image-card {
  .action {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
