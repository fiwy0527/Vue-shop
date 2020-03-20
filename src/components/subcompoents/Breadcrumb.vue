<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welecome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: message.url}">{{
        message.first
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{
        message.secend
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['message']
}
</script>
