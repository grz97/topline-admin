<template>
  <div>
    <el-card class="filter-card">
        <div slot="header" class="clearfix">
          <span>筛选条件</span>
        </div>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="文章状态：">
            <el-radio-group v-model="form.resource">
              <el-radio label="全部"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表">
            <el-select v-model="form.region" placeholder="请选择">
              <el-option label="开发者资讯" value="shanghai"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-date-picker
              v-model="form.value"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
    </el-card>
     <el-card class="filter-card">
        <div slot="header" class="clearfix">
          <span>共找到0条符合条件的内容</span>
        </div>
        <el-table
          :data="articles"
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            label="封面"
            width="60">
            <!-- <template slot-scope="scope"> -->
              <!-- <img width="50" :src="scope.row.cover.images[0]"> -->
            <!-- </template> -->
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="pubdate"
            width="180"
            label="日期">
          </el-table-column>
           <el-table-column
            prop="status"
            label="状态">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <el-button plain type="success">修改</el-button>
              <el-button plain type="success" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change = "handleCurrentChages"
      :disabled = "loading"
      :total="totalPage">
    </el-pagination>
  </div>

</template>

<script>
export default {
  name: 'ArticlesList',
  data() {
    return {
      articles: [],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        value: ''
      },
      totalPage: 0,
      page: 1,
      loading: false
    }
  },
  created() {
    this.loadArticles()
  },
  methods: {
    loadArticles(page = 1) {
      this.loading = true
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page,
          per_page: 10
        }
        // 这里用data就表示response.data.data
      }).then(data => {
        console.log(data)
        this.articles = data.results
        this.totalPage = data.total_count
        this.loading = false
      })
    },
    handleCurrentChages(page) {
      // 当点击页数的时候，将此时的page赋值给page
      this.page = page
      // element-ui封装的页码改变事件，当页码发生改变的时候，就发送axios请求
      this.loadArticles(page)
    },
    // 删除功能
    handleDelete(article) {
      this.$http({
        method: 'DELETE',
        url: `/articles/${article.id}`
      }).then(data => {
        // console.log(data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
