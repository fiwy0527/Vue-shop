<template>
  <div>
    <breadcrumb :message="breadcrumb"></breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col
          ><el-alert
            title="添加商品"
            type="info"
            center
            show-icon
            :closable="false"
          >
          </el-alert
        ></el-col>
      </el-row>

      <el-row>
        <el-steps :space="200" :active="activeIndex - 0" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </el-row>
      <!-- 侧边栏 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRuleFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforechangeTabs"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="addForm.goods_price"
              ></el-input> </el-form-item
            ><el-form-item label="商品重量" prop="goods_price">
              <el-input
                v-model="addForm.goods_weight"
                type="number"
              ></el-input> </el-form-item
            ><el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="CateList"
                expandTrigger="hover"
                :props="cateProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyCateList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="itemcb"
                  v-for="(itemcb, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyCateList"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="UploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerToken"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本 编辑器-->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnadd" @click="addgoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewURL" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import getCateList from '../../assets/js/getCateList.js'
import breadcrumb from '../subcompoents/Breadcrumb.vue'
import _ from 'lodash'
export default {
  data() {
    return {
      breadcrumb: {
        first: '商品列表',
        secend: '添加商品',
        url: 'add'
      },
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 上传图片的路径
        pics: [],
        // 富文本编辑器绑定
        goods_introduce: '',
        attrs: []
      },
      addRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      CateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyCateList: [],
      onlyCateList: [],
      // 上传图片的url
      UploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片的请求头
      headerToken: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览对话框控制符
      previewVisible: false,
      // 图片预览路径
      previewURL: ''
    }
  },
  components: { breadcrumb },
  created() {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    getCateList,
    // 级联选择器数据变化触发
    handleChange() {
      const length = this.addForm.goods_cat.length
      if (length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tabs改变页面事件
    beforechangeTabs(activename, oldactive) {
      if (oldactive === '0' && this.addForm.goods_cat.length === 0) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // tabs被选中时触发
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('动态参数获取失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyCateList = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        this.onlyCateList = res.data
      }
    },
    // 图片预览
    handlePreview(file) {
      const previewPath = file.response.data.url
      this.previewURL = previewPath
      this.previewVisible = true
    },
    // 删除图片
    handleRemove(file) {
      console.log(file)
      // 1.获取要删除图片的临时路径
      // 2.从pics数组中删除对应的索引
      // 3.数组的splice方法删除
      const filepath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pic === filepath)
      this.addForm.pics.splice(index, 1)
    },
    // 上传图像成功后
    handleSuccess(response) {
      console.log(response)
      // 拼接处一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 将图片对象追加到addform数组中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    addgoods() {
      this.$refs.addRuleFormRef.validate(async validate => {
        if (!validate) {
          return this.$message.error('请填写必要信息')
        }
        // 循环处理动态参数
        this.manyCateList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 循环处理静态参数
        this.onlyCateList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        // 发起数据请求
        const { data: res } = await this.axios.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="css" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnadd {
  margin-top: 15px;
}
</style>
