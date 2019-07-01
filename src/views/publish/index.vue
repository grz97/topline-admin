<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>{{isEdit?'编辑文章':'发布文章'}}</span>
      <div>
        <el-button
          type="success"
          @click="handlePublish(false)"
          :loading="this.publishLoading"
        >{{isEdit?'更新': '发布'}}</el-button>
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
          <el-radio-group v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
         </el-radio-group>
         <!--根据不同的type 遍历显示上传图片组件 -->
       <template v-if="articleForm.cover.type > 0">
          <el-row>
            <el-col :span="6" v-for="n in articleForm.cover.type" :key="n">
              <UploadImage></UploadImage>
            </el-col>
          </el-row>
        </template>
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
// 封面上传图片组件
import UploadImage from './components/upload-image'
/**
 * 如果是更新，则在第1次更新数据之后开启监视
 * 如果是添加，则一上来就开启监视
 * 如果是从更新页面导航到发布页面，则清空表单数据
 * 如果是从发布页面导航到更新页面，则重新加载编辑页面的数据
 */

export default {
  name: "APPPublish",
  components: {
    ArticleChannel,
    quillEditor,
    UploadImage
  },
  data() {
    return {
      articleForm: {
        title: "", // 标题
        content: "", // 内容
        cover: {
          // 封面
          type: 1, // 封面类型 -1自动 0无图 1-1张 3-3张
          images: [] // 图片链接
        },
        channel_id: "" // 频道列表
      },
      editorOption: {}, // 富文本编辑器相关选项
      editLoading: false,
      publishLoading:false,
      formDirty:false
    };
  },
  /**
   * 监视器，我们可以监视组件实例中的成员
   * 当成员发生改变的时候，监视函数会被调用
   * 注意：这里配置的监视会无法取消，会重复监视
   *       如果需要有一个可以取消的监视，则需要通过 this.$watch 的方式进行监视了
   */
  // watch:{
  //   articleForm:{
  //     handler() {
  //        this.formDirty = true
  //     }, // 当被监视数据发生改变的时候会被调用
  //      deep:true // 对象，数组类型需要配置深度监视 如果是普通数据不需要
  //    // immediate: true或false // 默认只有当被监视成员发生改变的时候才会调用监视函数，如果希望初始的时候就调用一次，则可以配置该值为 true
  //   }
  // },
  watch:{
    $route(to,from) {
        // 如果是从更新页面导航到发布页面，则清空表单数据
        if (from.name==='publish-edit') {
           // 清空表单数据  重置表单中的内容
           this.articleForm= {
           title: "", // 标题
        content: "", // 内容
        cover: {
          // 封面
          type: 0, // 封面类型 -1自动 0无图 1-1张 3-3张
          images: [] // 图片链接
        },
        channel_id: "" // 频道列表
      }
     }
    }
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
    // 如果是发布页面 则直接开启监视
    if (this.$route.name==="publish") {
      // 开启监视
       this.watchForm()
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
          // 如果此时去操作上面数据驱动视图的更新，此时拿到的Dom是更新前的
          // 如果需要在数据驱动影响视图更新之后做一些Dom操作，可以把代码写到this.$nextTick()中

          // 数据的修改并不是立即触发视图的更新的
          // 这个监视器的监视先于真正的数据修改执行
          // vue提供了这样一个API 简单理解就是延时调用
          this.$nextTick(() => {
           // 更新数据加载好以后，开启监视
            this.watchForm()
          })
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
          // 编辑页面，修改表单数据，动态加载表单内容
          // 这个数据的修改也会触发对表单数据的监视
          // 这个数据非用户修改的数据，所以不要让其变脏
          this.$message({
            type: "success",
            message: "修改成功"
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error("修改失败");
        });
    },
    // 手动监视
    watchForm() {
      const unWatch = this.$watch('articleForm',function() {
          this.formDirty=true
          // 关闭监视器
          unWatch()
       },{
         deep:true
       })
    }
  },
  /**
   * 当要从当前导航到另一个路由的时候被触发
   * 我们可以在这里控制路由离开的行为
   * 例如当前页面如果有未保存的数据，我们就提示用户
   * to 要去哪里
   * from 来自哪里
   * next 就是允许通过的方法
   */
   beforeRouteLeave(to, from, next) {
    // 如果表单没有被用户修改过，则让导航直接通过
    if (!this.formDirty) {
      return next()
    }
    const answer = window.confirm('当前有未保存的数据，确认离开吗？')
    if (answer) {
      // 正常往后进行导航
      next()
    } else {
      // 取消当前导航
      next(false)
    }
  }
}

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
