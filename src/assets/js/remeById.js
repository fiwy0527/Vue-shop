function removeById(url, id, that) {
  that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      that.axios.delete(`/${url}/${id}`).then(res => {
        res = res.data
        if (res.meta.status !== 200) {
          that.$message.error('删除失败')
        }
        that.getList()
        that.$message.success('删除成功')
      })
    })
    .catch(() => {
      that.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
}
export default removeById
