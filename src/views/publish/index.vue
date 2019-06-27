<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>发布文章</span>
      <div>
        <el-button type="success" @click="handlePublish(false)">发布</el-button>
        <el-button type="primary" @click="handlePublish(true)">存入草稿</el-button>
      </div>
    </div>
    <el-form>
      <el-form-item label="标题">
        <el-input type="text" v-model="articleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea" v-model="articleForm.content"></el-input>
      </el-form-item>
      <el-form-item label="封面"></el-form-item>
      <el-form-item label="频道">
        <!-- 自己封装频道列表组件
         需要组件通信：
         父传子：porps Down
         子传父：Events up
        -->
        <!-- <article-channel
        :value="acticleForm.channel_id"
        @input="articleForm.channel_id=$event"
        ></article-channel> -->
        <!--
          v-model就是
        :value="acticleForm.channel_id"
        @input="articleForm.channel_id=$event"
        的简写
        -->
           <article-channel
        v-model="articleForm.channel_id"
        ></article-channel>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import ArticleChannel from "@/components/article-channel"
export default {
  name: "APPPublish",
  components: {
    ArticleChannel
  },
  data() {
    return {
      articleForm: {
        title: "", // 标题
        content: "", // 内容
        cover: {
          // 封面
          type: 0, // 封面类型 -1自动 0无图 1-1张 3-3张
          images: [] // 图片链接
        },
        channel_id: "3" // 频道列表
      }
    };
  },
  methods: {
    // 添加文章
    handlePublish(draft = false) {
      this.$http({
        method: "POST",
        url: "/articles",
        data: this.articleForm,
        // 存入草稿参数
        params: {
          draft
        }
      })
        .then(data => {
          this.$message({
            type: "success",
            message: "发布成功"
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error("发布失败");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.publish-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
