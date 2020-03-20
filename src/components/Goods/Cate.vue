<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb :message="breadcrumb"></breadcrumb>

    <!-- 卡片布局 -->
    <el-card>
      <el-row>
        <el-row>
          <el-button type="primary" @click="showAddDialog">分类添加</el-button>
        </el-row>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template slot="isOK" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button icon="el-icon-edit" type="primary" size="mini"
            >编辑</el-button
          >
          <el-button icon="el-icon-delete" type="danger" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          :current-page="queryInfo.pagenum"
          @current-change="handleCurrentChange"
          :page-sizes="[2, 5, 10, 20, 30]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户弹出层 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addForm"
        :rules="addFromrules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="新增分类" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options指定数据源 -->
          <!-- props用来指定配置值对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '../subcompoents/Breadcrumb.vue'
export default {
  data() {
    return {
      // 查询提交的数据
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
        type: 3
      },
      // 获取的商品参数
      cateList: [],
      // 商品总数
      total: 0,
      // 表格列数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          // 模板名
          template: 'isOK'
        },
        {
          label: '排序',
          // 将当前列定义为模板列
          type: 'template',
          // 模板名
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列定义为模板列
          type: 'template',
          // 模板名
          template: 'opt'
        }
      ],
      // 添加弹出控制符
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加验证规则
      addFromrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 获取父级分类
      parentList: [],
      // 选中的父级分类的iD数组
      selectedKeys: [],
      // 指定级联选择框的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 面包屑导航父组件传值
      breadcrumb: {
        first: '商品分类',
        secend: '商品详情',
        url: '/categories'
      }
    }
  },
  components: { breadcrumb },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取列表数据
    async getCateList() {
      const { data: res } = await this.axios.get('/categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 改变显示条数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    // 改变当前页面
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    // 当前添加分类弹出框及操作
    showAddDialog() {
      // 在打开对话框之前获取父级数据
      this.getParentList()
      this.addDialogVisible = true
    },
    // 关闭添加弹出框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.selectedKeys = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 获取父级分类的数据
    async getParentList() {
      const { data: res } = await this.axios.get('/categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败')
      }
      this.parentList = res.data
    },
    // 当级联选择框数据变化时触发
    parentCateChanged() {
      // console.log(this.selectedKeys)
      // 如果 selectkeys数组的长度大于1，就说明已选中一个父级分类
      const length = this.selectedKeys.length
      if (length > 0) {
        // 父级分类的id
        this.addForm.cat_pid = this.selectedKeys[length - 1]
        this.addForm.cat_level = this.selectedKeys[length]
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    // 点击确定添加分类
    addCate() {
      this.$refs.addFormRef.validate(async validate => {
        if (!validate) return
        const { data: res } = await this.axios.post('categories', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getCateList()
      })
    }
  }
}
</script>

<style lang="css" scoped>
.tree-table {
  margin: 10px 0;
}
</style>
