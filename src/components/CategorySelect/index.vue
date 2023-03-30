<template>
  <div>
    <!--  inline：代表的是行内表单，代表一行可以放置多个表单元素  -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id" :disabled="isShowTable"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :disabled="isShowTable"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :disabled="isShowTable"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props:['isShowTable'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      }
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    //获取一级分类数据的方法
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code === 200) {
        this.list1 = result.data;
      }
    },
    //一级分类的select事件回调（当一级分类的option发生变化的时候获取相应二级分类的数据）
    async handler1() {
      if (this.cForm.category2Id !== '' && this.cForm.category3Id !== '') {
        this.cForm.category2Id = '';
        this.cForm.category3Id = '';
        this.list2 = [];
        this.list3 = [];
      }
      const {category1Id} = this.cForm;
      this.$emit('getCategoryId', {category1Id});
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code === 200) {
        this.list2 = result.data;
      }
    },
    //二级分类的select事件回调（当二级分类的option发生变化的时候获取相应三级分类的数据）
    async handler2() {
      if (this.cForm.category3Id !== '') {
        this.cForm.category3Id = '';
        this.list3 = [];
      }
      const {category2Id} = this.cForm;
      this.$emit('getCategoryId', {category2Id});
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code === 200) {
        this.list3 = result.data;
      }
    },
    //三级分类的事件回调
    handler3() {
      const {category3Id} = this.cForm;
      this.$emit('getCategoryId', {category3Id});
    }
  }
};
</script>

<style scoped>

</style>
