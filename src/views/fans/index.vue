<template>
  <div>
    <p>粉丝概况</p>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 600px; height: 400px;"></div>
    <br>
    <!-- <EChartsBar></EChartsBar> -->
  </div>
</template>

<script>
// 1 npm i echarts 安装
// 2 在使用的组件中加载echarts文件
// 3  在绘图前我们需要为 ECharts 准备一个具备高宽的 DOM 容器。
// 4. 基于 DOM 容器初始化 echarts
import echarts from "echarts";
// 引进EChartsBar图表组件
// import EChartsBar from './components/echarts-bar'
export default {
  name: "FansOverview",
  // components:{
  //   EChartsBar
  // },
  data() {
    return {};
  },
  mounted() {
    // 因为echarts初始化要操作Dom 所以代码写到mounted中
     // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    // 绘制图表
    myChart.setOption({
      title: {
        text: "ECharts 入门示例"
      },
      tooltip: {},
      xAxis: {
        // X 轴的数据
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {}, // y 轴配置项
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    });
  }
};
</script>

<style lang="less" scoped>
</style>
