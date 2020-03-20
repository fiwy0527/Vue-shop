<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb :message="breadcrumb"></breadcrumb>

    <!-- 卡片布局 -->
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getList"
            :clearable="true"
            @clear="getList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table
        style="width: 100%"
        :data="userlist"
        highlight-current-row
        border
        stripe
      >
        <el-table-column type="index" width="50" label="ID"> </el-table-column>
        <el-table-column label="姓名" width="180" prop="username">
        </el-table-column>
        <el-table-column
          label="EMAIL"
          width="180"
          prop="email"
        ></el-table-column>
        <el-table-column
          label="PHONE"
          width="180"
          prop="mobile"
        ></el-table-column>
        <el-table-column label="职能" width="180" prop="role_name">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="301.2">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="pushEditForm(scope.row), (editDialogVisible = true)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById('users', scope.row.id)"
            ></el-button>
            <!-- 侧边栏弹出文本 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="right-start"
              :enterable="false"
            >
              <!-- 分配角色按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="SetRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 添加用户对话框 -->
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
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="mobile" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewUser(addForm)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹出框 -->

    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容主题区域 -->
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFromrules"
        label-width="80px"
      >
        <el-form-item label="username" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="mobile" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormUpdate(editForm)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="SetRoledialogVisible"
      width="50%"
      @close="closeSetRole"
    >
      <div>
        <p>用户名:{{ setRoleUserinfo.username }}</p>
        <p>职务:{{ setRoleUserinfo.role_name }}</p>
        <p>
          请选择:
          <el-select v-model="setRoleVal" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SetRoleUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '../subcompoents/Breadcrumb.vue'
import removeUserById from '../../assets/js/remeById.js'
export default {
  data() {
    // 自定义验证邮箱有效规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      Keyword: '',
      // 控制用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {},
      // 表单验证规则
      addFromrules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 18,
            message: '用户名长度在6~18个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '密码长度在6~18个字符之间',
            trigger: 'blur'
          }
        ],
        mobile: [{ required: true, message: '请输入手机', trigger: 'blur' }]
      },
      editFromrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [{ required: true, message: '请输入手机', trigger: 'blur' }]
      },
      // 编辑用户数据
      editForm: {},
      // 用户编辑状态弹出框控制
      editDialogVisible: false,
      // 分配角色弹出框
      SetRoledialogVisible: false,
      // 分配角色的信息
      setRoleUserinfo: '',
      // 权限列表
      roleList: {},
      setRoleVal: '',
      // 父组件传值
      breadcrumb: {
        first: '用户管理',
        secend: '用户列表',
        url: '/users'
      }
    }
  },
  components: { breadcrumb },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data: res } = await this.axios.get('users', {
        params: this.queryInfo
      })
      // console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getList()
      console.log(newPage)
    },
    // 选中最新的分页,当获取当最新的当前页面显示条数时重新发送获取数据请求
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    async userStateChange(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.axios.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        // 因为失败不改变数据库的值
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('请求失败')
      }
      this.$message.success('更新状态成功')
    },
    // 添加用户
    addNewUser(addform) {
      // console.log(addform)
      // 添加表单预验证
      this.$refs.addFormRef.validate(validate => {
        // console.log(validate)
        if (!validate) return
        this.axios.post('users', addform).then(res => {
          res = res.data
          if (res.meta.status !== 201) {
            return this.$message.error('添加数据失败')
          }
          this.$message.success('更新状态成功')
          this.getList()
          this.addDialogVisible = false
        })
      })
    },
    // 从插槽中拿到用户信息
    pushEditForm(userinfo) {
      this.editForm = userinfo
    },
    // 编辑用户信息提交
    editFormUpdate(editform) {
      this.$refs.editFormRef.validate(validate => {
        if (!validate) return
        this.axios
          .put(`users/${editform.id}`, {
            id: editform.id,
            email: editform.email,
            mobile: editform.mobile
          })
          .then(res => {
            res = res.data
            if (res.meta.status !== 200) return this.$message.error('请求失败')
            this.$message.success('更新状态成功')
            this.editDialogVisible = false
            this.getList()
          })
      })
    },
    // 添加用户表单关闭后清空
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 根据id删除商品
    removeUserById(users, id) {
      const that = this
      removeUserById(users, id, that)
    },
    // 关闭分配角色对话框清空数据
    closeSetRole() {
      this.setRoleVal = ''
    },
    // 获取分配角色
    async SetRoles(userinfo) {
      this.setRoleUserinfo = userinfo
      const { data: res } = await this.axios.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.roleList = res.data
      this.SetRoledialogVisible = true
    },
    // 分配角色
    async SetRoleUser() {
      if (!this.setRoleVal) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.axios.put(
        `users/${this.setRoleUserinfo.id}/role`,
        {
          rid: this.setRoleVal
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更改失败')
      }
      this.$message.success('更新成功')
      this.SetRoledialogVisible = false
      this.getList()
    }
  }
}
</script>

<style lang="css" scoped></style>
