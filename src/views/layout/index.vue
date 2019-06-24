<template>
  <!-- 这里的内容是home 例如发布文章，评论管理...-->
  <el-container>
    <el-aside width="200px">
      <AppAside/>
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader/>
      </el-header>
      <el-main>
        <!--layout组件的路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from "./components/AppAside"
import AppHeader from "./components/AppHeader"
export default {
  name: "AppLayout",
  components: {
    AppAside,
    AppHeader
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #d0dce7;
}
.el-header {
  // background-color:#aec0d1;
  background-color: #fff;
}
.el-main {
  background-color: #ddd;
}
</style>
