<template>
  <div>
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
      </div>
      <el-form ref="form"
       label-width="100px">
        <el-form-item label="状态：">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="" value="">全部</el-radio>
            <el-radio
            v-for="(item, index) in statTypes"
            :key="item.label"
            :label="index + ''"
            >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <!-- 自己封装的频道列表组件 可以调过来直接使用-->
         <article-channel v-model="filterParams.channel_id"></article-channel>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="begin_end_pubdate"
            @change="handleDateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
          type="primary"
          :loading="loading"
          @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>共找到<strong>{{totalPage}}</strong>条符合条件的内容</span>
      </div>
      <el-table :data="articles" v-loading="loading" style="width: 100%">
        <el-table-column label="封面" width="60">
          <template slot-scope="scope">
            <img width="50" :src="scope.row.cover.images[0]">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="pubdate" width="180" label="日期"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 字符串拼接 跳转到修改页面-->
            <el-button type="success" plain @click="$router.push(`/publish/${scope.row.id}`)">修改</el-button>
            <!-- <el-button plain type="success"
            @click="$router.push({name:'publish-edit',
            params:{
              id:scopr.row.id
            }})">修改</el-button> -->
            <el-button plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页
    current-page  当前页码 也就是高亮的页码
    total 总记录数
     -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChages"
      :disabled="loading"
      :current-page="page"
      :total="totalPage"
    ></el-pagination>
  </div>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
export default {
  name: "ArticlesList",
  components:{
    ArticleChannel
  },
  data() {
    return {
      articles: [], // 列表数据
      totalPage: 0,
      page: 1, // 当前页码
      loading: false, // 控制文档加载中的loading效果
      totalCount:0, // 总数据条数
      statTypes: [ // 文章状态
        {
          type: "info",
          label: "草稿"
        },
        {
          type: "",
          label: "待审核"
        },
        {
          type: "success",
          label: "审核通过"
        },
        {
          type: "warning",
          label: "审核失败"
        },
        {
          type: "danger",
          label: "已删除"
        }
      ],
      filterParams: {
        // 文章查询条件的参数
        status: "", // 文章状态
        channel_id: "", // 频道id
        begin_pubdate: "", // 开始时间
        end_pubdate: "" // 结束时间
      },
      begin_end_pubdate: [] // 存储日期选择器同步的开始时间和结束时间
    };
  },
  created() {
    this.loadArticles();
  },
  methods: {
    // 加载文章列表
    loadArticles(page = 1) {
      this.loading = true;
      // 过滤出有效的查询条件数据字段
      const filterData = {}
      for (let key in this.filterParams) {
         if (this.filterParams[key]) {
           filterData[key]=this.filterParams[key]
         }
      }
      this.$http({
        method: "GET",
        url: "/articles",
        params: {
          page, // 请求数据的页码，不传默认为1
          per_page: 10, // 请求每页的数据大小，不传默认为10
          // 将对象混入当前对象,就是对象拷贝
          ...filterData
        }
        // 这里用data就表示response.data.data
      }).then(data => {
        console.log(data);
        this.articles = data.results;
        this.totalPage = data.total_count;
        // this.totalCount = data.total_count;
        this.loading = false;
      });
    },
    onSubmit() {
     this.page=1 // 让分页组件的页码回到第一页
     this.loadArticles() // 加载第一页的数据
    },
    // 点击分页
    handleCurrentChages(page) {
      // 当点击页数的时候，将此时的page赋值给page
      this.page = page;
      // element-ui封装的页码改变事件，当页码发生改变的时候，就发送axios请求
      this.loadArticles(page);
    },
    // 删除功能
    handleDelete(articles) {
      this.$confirm("确认删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定执行
          // 发送删除请求
          this.$http({
            method: "DELETE",
            url: `/articles/${articles.id}`
          }).then(data => {
            // 提示删除成功
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            // 重新加载数据列表
            this.loadArticles(this.page);
          });
        })
        .catch(() => {
          // 取消执行
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 日期选择组件的改变事件
    handleDateChange(value) {
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    }
  }
};
</script>

<style lang="less" scoped>
</style>
