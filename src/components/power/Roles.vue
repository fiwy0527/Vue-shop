<template>
  <div class="roles-container">
    <!-- 面包屑导航 -->
    <breadcrumb :message="breadcrumb"></breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
        <el-col>
          <el-table
            ref="singleTable"
            highlight-current-row
            style="width: 100%"
            :data="rolesList"
            border
            :stripe="true"
          >
            <el-table-column width="50" type="expand">
              <template slot-scope="scope">
                <el-row
                  v-for="(item1, index1) in scope.row.children"
                  :key="item1.id"
                  :class="['dpbottom', index1 === 0 ? 'dptop' : '', 'vcenter']"
                >
                  <!--渲染一级权限 -->
                  <el-col :span="5"
                    ><el-tag
                      type="primary"
                      closable
                      @close="removeRightById(scope.row, item1.id)"
                      >{{ item1.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染二级权限 -->
                  <el-col :span="19">
                    <el-row
                      v-for="(item2, index2) in item1.children"
                      :key="item2.id"
                      :class="[index2 === 0 ? '' : 'dptop', 'vcenter']"
                    >
                      <el-col :span="6">
                        <el-tag
                          type="success"
                          closable
                          @close="removeRightById(scope.row, item2.id)"
                          >{{ item2.authName }}</el-tag
                        >
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 渲染三级权限 -->
                      <el-col :span="18">
                        <el-tag
                          type="warning"
                          v-for="item3 in item2.children"
                          :key="item3.id"
                          closable
                          @close="removeRightById(scope.row, item3.id)"
                          >{{ item3.authName }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
              label="#"
            ></el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="425">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="425">
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click=";(editDialogVisible = true), geteditform(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeRoleById('roles',scope.row.id)"
                  >删除</el-button
                >
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-paperclip"
                  @click="showSetdialogVisible(scope.row)"
                  >分配权限</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          :current-page="pagenum"
          :page-sizes="[100, 5, 10, 20, 30]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加用户 -->
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewUser(addForm)">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑用户 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="editForm"
        :rules="addFromrules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="ID" prop="id">
          <el-input v-model="editForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser(editForm)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightdialogVisible"
      width="50%"
      @close="setRightClose"
    >
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="TreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import removeById from '../../assets/js/remeById.js'
import breadcrumb from '../subcompoents/Breadcrumb.vue'
export default {
  data() {
    return {
      rolesList: [],
      // 添加用户对话框
      addDialogVisible: false,
      // 用户列表
      addForm: {},
      addFromrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '角色名称在3-12个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            min: 3,
            max: 12,
            message: '角色描述在3-12个字符之间',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      // 显示当前页码
      pagenum: 1,
      total: 0,
      pagesize: 1,
      // 控制分配权限对话框
      setRightdialogVisible: false,
      // 分配权限数据
      rightlist: [],
      // 树形控件属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中已经有的权限节点
      defKeys: [],
      // 操作的角色id
      roleId: '',
      // 面包屑导航数据
      breadcrumb: {
        first: '权限管理',
        secend: '角色管理',
        url: '/roles'
      }
    }
  },
  components: { breadcrumb },
  created() {
    this.getList()
  },
  methods: {
    // 获取role数据
    async getList() {
      const { data: res } = await this.axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户失败')
      }
      this.rolesList = res.data
      // console.log(this.rolesList)
      this.total = res.data.length
    },
    // 控制添加用户对话框关闭后清除内容
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 拿到编辑用的信息
    geteditform(edituser) {
      this.editForm = edituser
    },
    // 添加用户
    addNewUser(addform) {
      this.$refs.addFormRef.validate(async validate => {
        if (!validate) return
        const { data: res } = await this.axios.post('/roles', addform)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.addDialogVisible = false
        this.$message.success('添加成功')
        this.getList()
      })
    },
    // 编辑用户提交
    editUser(edituser) {
      this.$refs.editFormRef.validate(validate => {
        if (!validate) return
        this.axios.put(`roles/${edituser.id}`, edituser).then(res => {
          res = res.data
          if (res.meta.status !== 200) return this.$message.error('请求失败')
          this.$message.success('更新状态成功')
          this.editDialogVisible = false
          this.getList()
        })
      })
    },
    // 当前页面显示条数改变
    handleSizeChange(newsize) {
      this.pagenum = Math.ceil(this.rolesList.length / newsize)
    },
    // tag标签删除
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.axios.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')

      // 调用获取用户列表方法会重新刷新整个页面
      role.children = res.data
    },
    // 分配权限对话框
    async showSetdialogVisible(role) {
      // 保存角色的id
      this.roleId = role.id
      const { data: res } = await this.axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightlist = res.data
      // 通过递归获取三级节点id
      this.getLeafKeys(role, this.defKeys)
      // console.log(this.defKeys)
      this.setRightdialogVisible = true
    },
    // 递归获取角色下所有三级权限的id，并保存到数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        // console.log(item)
        this.getLeafKeys(item, arr)
      })
    },
    // 关闭时清空数组
    setRightClose() {
      this.defKeys = []
    },
    // 新增权限分配
    async allotRights() {
      const keys = [
        ...this.$refs.TreeRef.getCheckedKeys(),
        ...this.$refs.TreeRef.getHalfCheckedNodes()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.axios.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('添加失败')
      }
      this.$message.success('添加权限成功')
      this.getList()
      this.setRightdialogVisible = false
    },
    // 根据id删除
    removeRoleById(roles, id) {
      const that = this
      removeById(roles, id, that)
    }
  }
}
</script>

<style lang="css" scoped>
.el-tag {
  margin: 7px !important;
}
.dptop {
  border-top: 1px solid #eee;
}
.dpbottom {
  border-bottom: 1px solid #eee;
}
/* 纵向平铺 */
.vcenter {
  display: flex;
  align-items: center;
}
</style>
