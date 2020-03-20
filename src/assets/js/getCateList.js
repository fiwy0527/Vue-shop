function getCateList() {
  this.axios.get('categories')
    .then((res) => {
      res = res.data
      this.CateList = res.data
    })
    .catch(err => this.$message.error('获取列表失败' + err))
}

export default getCateList
