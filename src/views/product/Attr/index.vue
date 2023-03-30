<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :isShowTable="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="isShowTable = false">添加属性
        </el-button>
        <!--      表格：展示平台属性-->
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="address" label="属性值列表" width="width">
            <template v-slot="{ row, $index }">
              <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id"
                style="margin: 0px 15px">
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值
        </el-button>

        <el-table style="width: 100%; margin: 20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag"
                @blur="toLook(row, $index)" @keyup.native.enter="row.flag = false" :ref="$index"></el-input>
              <span v-else @click="toEdit(row, $index);" style="display: block">{{
                  row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框，确认是否删除 -->
              <el-popconfirm :title="`您确定要删除${row.valueName}？`" @confirm="deleteAttrValue(row, $index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference" :disabled="row.flag">
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="addAttr">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接受平台属性的数据
      attrList: [],
      //这个属性控制table表格显示与隐藏的
      isShowTable: true,
      //收集新增属性或修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId、valueName
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 0, //因为服务器也需要区分几级id
      },
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId(categoryId) {
      //区分三级分类相应的id，以及父组件进行储存
      if (categoryId.category1Id) {
        this.category1Id = categoryId.category1Id;
      } else if (categoryId.category2Id) {
        this.category2Id = categoryId.category2Id;
      } else {
        //代表三级分类的id有了
        this.category3Id = categoryId.category3Id;
        //发请求获取平台的属性数据
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的回调
    addAttrValue() {
      //向属性值的数组里面添加元素
      //attrId是你相应的属性的id，目前我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id）
        valueName: "",
        flag: true, //flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处：每一个属性值可以控制自己的模式切换
      });
      //自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    //添加属性按钮的回调
    addAttr() {
      this.isShowTable = true;
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId、valueName
        ],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 0, //因为服务器也需要区分几级id
      };
    },
    //修改某一个属性
    updateAttr(row) {
      this.isShowTable = false;
      //由于数据结构当中存在对象里面嵌套数组，数组里面有套对象，因此需要使用深拷贝解决这类问题
      this.attrInfo = JSON.parse(JSON.stringify(row));
      //在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach((item) => {
        //注意：添加的是响应式数据，有get和set的，不能直接添加，直接添加的没有响应式数据，也就是没有set
        this.$set(item, 'flag', false)
      })
    },
    //失却焦点的事件--切换为查看模式，展示span
    toLook(row, index) {
      //如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() == '') { //trim() 方法用于删除字符串的头尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。
        this.attrInfo.attrValueList.splice(index, 1)
      }
      //新增属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {//some() 方法用于检测数组中的元素是否满足指定条件，满足返回true，不满足返回false
        if (row !== item) return row.valueName.trim() == item.valueName
      })
      if (isRepat === true) {
        this.$message.warning('请不要输入重复的属性值')
        this.attrInfo.attrValueList.splice(index, 1)
      }
      row.flag = false;
    },
    //点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true
      //自动获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    //气泡确认框确定按钮的回调
    deleteAttrValue(row, index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    //
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        delete item.flag
        return true
      })
      try {
        let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        if (result.code === 200) {
          this.getAttrList()
          this.isShowTable = true
          this.$message.success('保存成功')
        }
      } catch (error) {

      }
    }
  },
};
</script>

<style scoped>
</style>
