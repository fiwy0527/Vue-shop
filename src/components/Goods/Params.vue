<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb :message="breadcrumb"></breadcrumb>

    <!-- 卡片布局 -->
    <el-card>
      <el-alert
        title="注意：只允许第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>请选择参数: </span>
          <el-cascader
            v-model="selectedKeys"
            :options="CateList"
            expandTrigger="hover"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 第一页 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数 -->
          <el-button
            size="mini"
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeAttrVals(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <!-- 控制文本框和tag切换 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数列表"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 第二页 -->
        <el-tab-pane label="静态参数" name="only">
          <!-- 添加属性 -->
          <el-button
            size="mini"
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="removeAttrVals(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <!-- 控制文本框和tag切换 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '../subcompoents/Breadcrumb.vue'
import getCateList from '../../assets/js/getCateList.js'
export default {
  data() {
    return {
      breadcrumb: {
        first: '商品分类',
        secend: '商品列表',
        url: '/params'
      },
      CateList: [],
      selectedKeys: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      // 动态参数
      manyTableData: [],
      // 静态参数
      onlyTableData: [],
      // 添加用户对话框控制符
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加用户的表单
      addForm: { attr_name: '' },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数，不能为空', trigger: 'blur' }
        ]
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数，不能为空', trigger: 'blur' }
        ]
      },
      editForm: { attr_name: '' }
    }
  },
  computed: {
    // 监听按钮是否可点击
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 监听选择参数id 的改变
    CateId() {
      if (this.selectedKeys.length !== 3) {
        return null
      }
      return this.selectedKeys[2]
    },
    // 监听动态的添加标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态参数'
    }
  },
  components: { breadcrumb },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList,
    // 级联选择框中的改变函数
    handleChange() {
      // 调用函数获取参数
      this.getParamsDate()
      if (this.selectedKeys.length === 0) {
        this.manyTableData = []
        this.onlyTableData = []
        this.getCateList()
      }
    },
    // 切换tab页签
    handleTabClick() {
      // 调用获取参数的公共方法
      this.getParamsDate()
    },
    // 定义获取参数的公共方法
    async getParamsDate() {
      const length = this.selectedKeys.length
      if (length < 3) {
        return (this.selectedKeys = [])
      }
      const { data: res } = await this.axios.get(
        `categories/${this.CateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      // 处理参数列表下的属性
      res.data.forEach(item => {
        // 判断属性值是否为空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 为每个元素都添加自己的文本框控制符和值
        item.inputValue = ''
        item.inputVisible = false
      })
      // 需要判断参数的类型
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加商品参数
    addParams() {
      this.$refs.addFormRef.validate(validate => {
        if (!validate) return
        this.axios
          .post(`categories/${this.CateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          .then(res => {
            res = res.data
            if (res.meta.status !== 201) {
              return this.$message.error('添加失败')
            }
            this.$message.success('添加成功')
            this.addDialogVisible = false
            this.getParamsDate()
          })
      })
    },
    // 显示编辑对话框并接受数据
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.axios.get(
        `categories/${this.CateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editForm = res.data
    },
    // 点击提交修改参数
    editParams() {
      this.$refs.editFormRef.validate(async validate => {
        if (!validate) return
        const { data: res } = await this.axios.put(
          `categories/${this.CateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
        this.editDialogVisible = false
        this.getParamsDate()
      })
    },
    // 删除指定参数
    deleteParams(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .delete(`categories/${this.CateId}/attributes/${id}`)
            .then(res => {
              res = res.data
              if (res.meta.status !== 200) {
                return this.$message.error('删除失败')
              }
              this.getParamsDate()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 控制文本框的点击和键盘事件
    async handleInputConfirm(row) {
      // 判断输入文本框的字符是否有效
      if (row.inputValue.trim().length === 0) {
        return (row.inputValue = '')((row.inputVisible = false))
      }
      // 如果没有return做后续处理
      // 将文本框的数据保存到插槽中，然后发送请求
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      // 调用处理vals的公共方法
      this.saveAttrVals(row)
    },
    // 控制文本框按钮点击事件
    showInput(row) {
      row.inputVisible = true
      // 使文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除expand下列属性的方法
    removeAttrVals(row, index) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
      // console.log(index)
    },
    // 将操作 attr_vals的方法抽离
    async saveAttrVals(row) {
      // 发送数据请求保存数据
      const { data: res } = await this.axios.put(
        `categories/${this.CateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数项成功')
    }
  }
}
</script>

<style lang="css" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
/* tag文本框大小 */
.input-new-tag {
  width: 120px;
}
</style>
