<template>
  <div class="rights_container">
    <!-- 面包屑导航 -->
    <breadcrumb :message="breadcrumb"></breadcrumb>
    <!-- 卡片布局 -->
    <el-card class="box-card">
      <el-table
        ref="singleTable"
        highlight-current-row
        style="width: 100%"
        :data="powerList"
        border
        :stripe="true"
      >
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="402">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="356">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          :current-page="1"
          :page-sizes="[2, 5, 10, 20, 30]"
          :page-size="2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="4"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import breadcrumb from '../subcompoents/Breadcrumb.vue'
export default {
  data() {
    return {
      powerList: [],
      breadcrumb: {
        first: '权限管理',
        secend: '权限列表',
        url: '/rights'
      }
    }
  },
  components: { breadcrumb },
  created() {
    this.getPowerList()
  },
  methods: {
    async getPowerList() {
      const { data: res } = await this.axios.get('/rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.powerList = res.data
    }
  }
}
</script>

<style lang="css" scoped></style>
