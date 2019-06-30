<template>
  <el-card>
    <div slot="header">
      <span>素材管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>
      <el-button type="primary">上传图片</el-button>
    </div>
    <el-row :gutter="20">
    <el-col :span="7" v-for="item in images" :key="item.id">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="item.url" class="image" style="max-width: 100%;">
        <!-- <div style="padding: 10px; display: flex; justify-content: center;"> -->
        <el-button
          type="primary"
          :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
          circle
          plain
        ></el-button>
        <el-button type="primary" icon="el-icon-delete" circle plain></el-button>
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
    async loadImages() {
      this.$http({
        method: "GET",
        url: "/user/images"
      }).then(data => {
        this.images = data.results;
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
