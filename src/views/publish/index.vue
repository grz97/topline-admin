<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>{{isEdit?'编辑文章':'发布文章'}}</span>
      <div>
        <el-button type="success" @click="handlePublish(false)" :loading="this.publishLoading">{{isEdit?'更新': '发布'}}</el-button>
        <el-button type="primary" @click="handlePublish(true)" :loading="this.publishLoading">存入草稿</el-button>
      </div>
    </div>
    <!--如果是编辑并且加载中  isEdit是封装的判断是否是发布还是编辑的方法 在这里直接使用-->
    <el-form v-loading="this.isEdit && editLoading">
      <el-form-item>
        <el-input type="text" v-model="articleForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item>
        <!--富文本编辑器 -->
        <quill-editor v-model="articleForm.content" ref="myQuillEditor" :options="editorOption"></quill-editor>
      </el-form-item>
      <el-form-item label="封面">
        <!-- 封面后面讲-->
      </el-form-item>
      <el-form-item label="频道">
        <!-- 自己封装频道列表组件
         需要组件通信：
         父传子：porps Down
         子传父：Events up
        -->
        <!-- <article-channel
        :value="acticleForm.channel_id"
        @input="articleForm.channel_id=$event"
        ></article-channel>-->
        <!--
          v-model就是
        :value="acticleForm.channel_id"
        @input="articleForm.channel_id=$event"
        的简写
        -->
        <article-channel v-model="articleForm.channel_id"></article-channel>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import ArticleChannel from "@/components/article-channel";
// 加载富文本编辑器相关资源
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  name: "APPPublish",
  components: {
    ArticleChannel,
    quillEditor
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
        channel_id: "" // 频道列表
      },
      editorOption: {}, // 富文本编辑器相关选项
      editLoading: false,
      publishLoading:false
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }, // 把判断是否是编辑还是属性封装到一个方法中 然后可以直接使用
    isEdit() {
      // 使用计算属性 多次使用只调一次
      return this.$route.name === "publish-edit";
    },
    articleId() { // 使用计算属性
      return this.$route.params.id
    }
  },
  created() {
    // 判断是发布还是编辑 如果是编辑就发布请求编辑 route不是router
    if (this.isEdit) {
      this.loadArticle();
    }
  },
  mounted() {
    console.log("this is current quill instance object", this.editor);
  },
  methods: {
    loadArticle() {
      this.editLoading = true;
      // 发请求 拿数据
      this.$http({
        method: "GET",
        url: `/articles/${this.articleId}`
      })
        .then(data => {
          console.log(data);
          // 点击的当前修改的内容
          this.articleForm = data;
          this.editLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("加载文章详情失败");
        });
    },
    // 添加文章
    handlePublish(draft = false) {
      this.publishLoading=true
      if (this.isEdit) {
        // 如果是编辑就执行编辑操作
        this.submitEdit(draft).then(() => {
          this.publishLoading=false
        })
      } else {
        // 如果是添加就执行添加操作
        this.submitAdd(draft).then(() => {
          this.publishLoading=false
        })
      }
    },
    // 添加文章
    submitAdd(draft) {
     return this.$http({
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
    },
    // 编辑文章
    submitEdit(draft) {
      return this.$http({
        method: "PUT",
        url: `/articles/${this.articleId}`,
        data: this.articleForm,
        // 存入草稿参数
        params: {
          draft
        }
      })
        .then(data => {
          this.$message({
            type: "success",
            message: "修改成功"
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error("修改失败");
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
