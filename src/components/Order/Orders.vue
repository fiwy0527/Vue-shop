<template>
  <div>
    <breadcrumb :message="breadcrumb"></breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="keywords"
            @keyup.enter.native="searchKey(keywords)"
            :clearable="true"
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchKey(keywords)"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table
        :data="orderList"
        border
        stripe
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 编辑对话框 -->

    <el-dialog
      title="收货地址"
      :visible.sync="editVisible"
      width="50%"
      @close="clearValues"
    >
      <el-form
        :model="editform"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="editform.address1"
            expandtrigger="hover"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editform.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '../subcompoents/Breadcrumb.vue'
import cityData from '../../assets/js/citydata.js'
export default {
  data() {
    return {
      breadcrumb: {
        first: '订单管理',
        secend: '订单列表',
        url: '/orders'
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      editVisible: false,
      editform: {
        address1: [],
        address2: ''
      },
      editFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      keywords: ''
    }
  },
  components: { breadcrumb },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.axios.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 分页改变现实条数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    // 当前分页页码改变
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    showEditDialog() {
      this.editVisible = true
    },
    clearValues() {
      this.editform = ''
    },
    // 搜索功能
    searchKey(keywords) {
      const newList = this.orderList.filter(item => {
        if (item.order_number.indexOf(keywords) !== -1) {
          return item
        }
      })
      this.orderList = newList
    }
  }
}
</script>

<style lang="css" scoped></style>
