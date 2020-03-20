<template>
  <div>
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
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="goodsList"
        style="width: 100%"
        highlight-current-row
        border
        stripe
      >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          label="商品名称"
          width="620.4"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          width="106.4"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          width="80"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column label="创建时间" width="175" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodsById('goods', scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          :current-page="queryInfo.pagenum"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 100, 220, 330, 430]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import removeById from '../../assets/js/remeById.js'
import breadcrumb from '../subcompoents/Breadcrumb.vue'
export default {
  data() {
    return {
      breadcrumb: {
        first: '商品列表',
        secend: '商品详情',
        url: 'goods'
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表参数
      goodsList: [],
      // 商品总条数
      total: 0
    }
  },
  components: { breadcrumb },
  created() {
    this.getList()
  },
  methods: {
    // 获取商品列表参数
    async getList() {
      const { data: res } = await this.axios.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 分页显示条数改变
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getList()
    },
    // 当前页改变重新获取数据
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getList()
    },
    // 根据id删除对应的商品
    removeGoodsById(goods, id) {
      const that = this
      removeById(goods, id, that)
    },
    // 编程式导航跳转添加页面
    goAddPage() {
      this.$router.push('/goods/addgoods')
    }
  }
}
</script>
