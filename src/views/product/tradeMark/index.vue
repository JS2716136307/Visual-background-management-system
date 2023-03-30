<template>
  <div>
    <!--  按钮  -->
    <el-button type="primary" icon="el-icom-plus" style="margin: 10px" @click="showDialog">添加</el-button>
    <!--
    表格组件
    data：表格组件将来需要展示的数据-----数据类型
    border：是给表格添加边框
    column属性
    label：显示标题
    width：对应列的宽度
    align：标题的对齐方式
    注意1：elementUI当中的table组件
      -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type=index label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center">
      </el-table-column>
      <el-table-column label="品牌LOGO" width="width" align="center">
        <template v-slot="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <!--row是品牌的信息：id，logoUrl，tmName什么的-->
        <template v-slot="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
    分页器
    当前第几页、数据总条数、每一页展示条数、连续页码数
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"

    current-page：代表的是当前第几页
    total：代表分页器一共需要展示数据条数
    page-size：代表的是每一页需要展示多少条数据
    page-sizes：代表可以设置每一页展示多少条数据
    layout：可以实现分页器的布局
    page-count：页码按钮的数量
       -->
    <el-pagination
      style="margin-top: 20px;text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-count="7"
      :page-sizes="[3,5,10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!--
    对话框
    :visible.sync：控制对话框显示与隐藏用的
    Form组件提供了表单验证的功能，只需要通过rules属性传入约定的验证规则，并将Form-Item的prop属性设置为需校验的字段名即可
       -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单  :model属性：这个属性的作用是，把表单的数据收集到那个对象的身上，将来表单验证，也需要这个属性   -->
      <el-form style="width: 80% " :rules="rules" :model="tmForm" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- 这里收集数据：不能使用v-model，因为不是表单元素
               action：设置图片上传的地址
               :on-success：可以检测到图片上传成功，当图片上传成功，会执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',
  data() {
    return {
      //代表的分页器第几页
      page: 3,
      //当前页数展示数据条数
      limit: 3,
      //总共数据条数
      total: 0,
      //列表展示的数据
      list: [],
      //对话框显示与隐藏的属性
      dialogFormVisible: false,
      //手机品牌的信息：对象身上的属性，不能瞎写，需要看文档的
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        //品牌名称的验证规则
        //require：必须要校验字段（前面五角星有关系）  message提示信息  trigger：用户行为设置（事件的设置：blur，change）
        tmName: [
          {required: true, message: '请输入品牌名称', trigger: 'change'},
          //品牌名称长度2-10
          {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change'}
        ],
        logoUrl: [
          {required: true, message: '请选择品牌logo'}
        ],
      }
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    //获取品牌列表的数据
    async getPageList() {
      let result = await this.$API.trademark.reqTradeMarkList(this.page, this.limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    //当分页器某一页需要展示数据条数发生变化的时候会触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //点击添加品牌的按钮
    showDialog() {
      this.dialogFormVisible = true;
      this.tmForm = {tmName: '', logoUrl: ''};
    },
    //修改某一个品牌
    updateTradeMark(row) {
      //row：当前用户选中这个品牌信息
      this.tmForm = {...row};
      this.dialogFormVisible = true;
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      //res：上传成功之后返回前端数据
      //file：上传成功之后服务器返回前端数据
      //收集品牌图片数据，因为将来需要带给服务器
      this.tmForm.logoUrl = URL.createObjectURL(file.raw);
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //添加按钮（添加品牌或者修改品牌）
    addOrUpdateTradeMark() {
      //当前部验证字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (valid) => {
        //如果全部字段符合条件
        if (valid) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
          if (result.code === 200) {
            //弹出信息：添加品牌成功、修改品牌成功
            this.$message.success(this.tmForm.id ? '修改品牌成功' : '添加品牌成功');
            //添加或者修改品牌成功以后，需要再次获取品牌列表进行展示
            this.handleCurrentChange(this.tmForm.id ? this.page : 1);
          }
        } else {
          return false;
        }
      });
    },
    //删除品牌的按钮
    deleteTradeMark(row) {
      //弹窗
      this.$confirm(`您确定删除${row.tmName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getPageList(this.list.length>1?this.page:this.page-1);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
