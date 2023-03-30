<template>
  <el-card class="box-card" style="margin-top: 10px">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容  -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容  -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMoon">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          class="date"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row>
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div v-show="activeName=='sale'">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">157,347</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>麦当劳</span>
                <span class="rvalue">142,258</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>必胜客</span>
                <span class="rvalue">108,651</span>
              </li>
              <li>
                <span class="rindex2">4</span>
                <span>汉堡王</span>
                <span class="rvalue">101,183</span>
              </li>
              <li>
                <span class="rindex2">5</span>
                <span>麦肯姆</span>
                <span class="rvalue">963,49</span>
              </li>
              <li>
                <span class="rindex2">6</span>
                <span>美莱克</span>
                <span class="rvalue">901,28</span>
              <li>
                <span class="rindex2">7</span>
                <span>麦肯姆</span>
                <span class="rvalue">812,31</span>
              </li>
            </ul>
          </div>
          <div v-show="activeName=='visite'">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">713,649,897</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>麦当劳</span>
                <span class="rvalue">704,074,336</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>必胜客</span>
                <span class="rvalue">681,601,752</span>
              </li>
              <li>
                <span class="rindex2">4</span>
                <span>汉堡王</span>
                <span class="rvalue">677,711,082</span>
              </li>
              <li>
                <span class="rindex2">5</span>
                <span>麦肯姆</span>
                <span class="rvalue">659,700,369</span>
              </li>
              <li>
                <span class="rindex2">6</span>
                <span>美莱克</span>
                <span class="rvalue">637,704,159</span>
              <li>
                <span class="rindex2">7</span>
                <span>麦肯姆</span>
                <span class="rvalue">610,753,743</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
import dayjs from 'dayjs'

export default {
  name: '',
  data() {
    return {
      activeName: 'sale',
      mycharts: null,
      date: []
    }
  },
  computed: {
    title() {
      return this.activeName == 'sale' ? '销售量' : '访问量'
    }
  },
  methods: {
    //本天
    setDay() {
      //获取当天的日期
      const day = dayjs().format('YYYY-MM-DD') //format格式
      this.date = [day, day]
    },
    //本周
    setWeek() {
      //获取这个星期的星期一和星期天的日期
      const start = dayjs().day(0).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    //本月
    setMoon() {
      //获取本月的第一天
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      //获取本月的最后一天
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    //本年
    setYear() {
      //获取本年的第一天和最后一天
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      //获取本年的最后一天
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  },
  watch: {
    activeName() {
      if (this.activeName == 'sale') {
        //初始化echarts实例
        this.mycharts = echarts.init(this.$refs.charts)
        //配置数据
        this.mycharts.setOption({
          title: {
            text: this.title + '趋势'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十一月', '十二月'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'Direct',
              type: 'bar',
              barWidth: '40%',
              data: [10, 52, 200, 334, 390, 330, 220, 441, 231, 81, 66]
            }
          ]
        })
      } else {
        //重新修改图标的配置数据
        //图标配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
        this.mycharts.setOption({
          title: {
            text: this.title + '趋势'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十一月', '十二月'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'Direct',
              type: 'bar',
              barWidth: '40%',
              data: [120, 380, 180, 104, 300, 370, 420, 301, 121, 91, 412]
            }
          ]
        })
      }

    }
  },
  mounted() {
    //初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts)
    //配置数据
    this.mycharts.setOption({
      title: {
        text: this.title + '趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '40%',
          data: [10, 52, 200, 334, 390, 330, 220, 441, 231, 81, 66]
        }
      ]
    })
  }
}
</script>

<style scoped>
.right {
  position: absolute;
  right: 0;
}

.tab {
  width: 100%;
}

.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.date {
  width: 215px;
  margin: 0px 10px;
}

.right span {
  margin: 0px 10px;
}

.charts {
  width: 100%;
  height: 300px;
}

ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}

ul li {
  height: 8%;
  margin: 10px 0px;
}

.rindex {
  float: left;
  width: 15px;
  height: 18px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}

.rindex2 {
  float: left;
  width: 15px;
  height: 18px;
  text-align: center;
}

ul li span {
  margin: 0px 10px;
}

.rvalue {
  float: right;
}
</style>
