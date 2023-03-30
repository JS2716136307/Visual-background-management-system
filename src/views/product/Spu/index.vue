<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :isShowTable="scene!=0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部这里将来是三部分进行切换 -->
      <div v-show="scene===0">
        <!-- 展示spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width:100%" border :data="records">
          <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column label="操作" width="width">
            <template v-slot="{row,$index}">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"
              ></HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu"
                          @click="updateSpu(row)"
              ></HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"
                          @click="handler(row)"
              ></HintButton>
              <el-popconfirm title="这是一段内容确定删除吗？" @confirm="deleteSpu(row)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 4, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene===1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene===2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <!-- table展示sku列表-->
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from '@/views/product/Spu/SkuForm'
import SpuForm from '@/views/product/Spu/SpuForm'

export default {
  components: { SkuForm, SpuForm },
  name: 'Spu',
  data() {
    return {
      //分别是分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      //控制三级联动的可操作性
      isShowTable: true,
      page: 1,//分页器当前第几页
      limit: 3,//每一页展示多少条数据
      total: 0,//分页器一共需要展示数据的条数
      records: [],//spu列表的数据
      scene: 0,//0代表展示spu列表数据    1添加spu|修改spu  2添加sku
      //控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [], //存储的是SKU列表的数据
      loading: true
    }
  },
  methods: {
    //三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    getCategoryId(categoryId) {
      //categoryId：获取到一、二、三级分类的id，并且区分是几级id
      if (categoryId.category1Id) {
        this.category1Id = categoryId.category1Id
        //清楚二、三级分类的id
        this.category2Id = ''
        this.category3Id = ''
      } else if (categoryId.category2Id) {
        this.category2Id = categoryId.category2Id
        //清楚三级分类的id
        this.category3Id = ''
      } else {
        this.category3Id = categoryId.category3Id
        //获取spu列表数据进行展示
        this.getSpuList()
      }
    },
    //获取spu列表数据的方法
    async getSpuList() {
      const { page, limit, category3Id } = this
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },

    //点击分页器的第几页按钮的回调
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList()
    },
    //当分页器的展示数据条数发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },

    //添加spu按钮的回调
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData(this.category3Id)
    },
    //修改某一个spu
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    //自定义事件的回调
    changeScene({ scene, flag }) {
      //flag这个形参为了区分保存按钮是添加还是修改
      //切换结构（场景）
      if (flag == '修改') {
        this.scene = scene
        this.getSpuList()
        this.handleCurrentChange(this.page)
      } else {
        this.scene = scene
        this.getSpuList()
        this.handleCurrentChange(1)
      }
    },
    //删除SPU的回调
    async deleteSpu(row, $index) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message.success('删除成功')
        await this.getSpuList()
        this.handleCurrentChange(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    //添加SKU按钮的回调
    addSku(row) {
      //切换场景为2
      this.scene = 2
      //父组件调用子组件的方法，让子组件发请求------三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    //skuform通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene
    },
    //查看SKU的按钮的回调
    async handler(spu) {
      //点击这个按钮的时候，对话框可见的
      this.dialogTableVisible = true
      //保存spu信息
      this.spu = spu
      //获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code == 200) {
        this.skuList = result.data
        //loading隐藏
        this.loading = false
      }
    },
    //关闭对话框的回调
    close(done) {
      //loading属性再次变为真
      this.loading = true
      //清除sku列表的数据
      this.skuList = []
      //管理对话框
      done()
    }
  }
}
</script>

<style scoped>
</style>
