<template>
<!--
  el-select 组件
  value属性，用来绑定同步的属性 单向数据流
  change事件：当选中项发生改变被触发 回调参数就是选中项的value
-->
  <el-select :value="value" @change="handleChange">
    <el-option
    label="全部"
    value=""></el-option>
    <el-option
    v-for="item in channels"
    :key="item.id"
    :label="item.name"
    :value="item.id"></el-option>
  </el-select>
</template>
<script>
export default {
  name: "ArticleChannel",
  props:{
    value:{
      type:[String,Number], // 传的类型必须是字符串或者数字
      required:true
    }
  },
  data() {
    return {
      channels:[]
    };
  },
  created() { // 一上来就加载频道列表
    this.loadChannels() // 加载频道列表
  },
  methods:{
    // change中的选中项改变事件 选中项发生改变时被触发
    handleChange(val) {
      // 发布自定义事件 val 就是选中的项
      this.$emit('input',val)
    },
   loadChannels() {
      this.$http({
        method: "GET",
        url: "/channels"
      }).then(data => {
        this.channels = data.channels;
      }).catch(err => {
        console.log(err)
        this.$message.error('加载频道列表失败')
      })
    }
  }
};
</script>

<style lang="less" scoped>
</style>
