<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
//引入echarts
import echarts from 'echarts'

export default {
  name: '',
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts)
    //配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        //最小值与最大值的设置
        min: 0,
        max: 100
      },
      yAxis: {
        //隐藏y轴
        show: false,
        //均分
        type: 'category'
      },
      //系列
      series: [
        {
          //图标形式-柱状图
          type: 'bar',
          data: [10],
          //柱状图的宽度
          barWidth: 20,
          color: 'cyan',
          //是否显示背景颜色
          showBackground: true,
          //设置背景颜色
          backgroundStyle: {
            color: '#eee'
          },
          //文本标签
          label: {
            show: true,
            //改变文本内容
            formatter: '|',
            //文本标签位置的调试
            position: 'right',
            //文本内容字体大小
            fontSize: 20
          }
        }
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
