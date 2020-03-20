<template>
  <div class='login_container'>
    <div class='login_box'>
      <div class='avatar_box'>
        <img src='../assets/logo.png' alt='logo' />
      </div>
      <el-form
        label-width='0px'
        class='login_form'
        :model='loginForm'
        :rules='rules'
        ref='loginFormRef'
      >
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input
            prefix-icon='el-icon-user-solid'
            placeholder='username'
            v-model='loginForm.username'
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop='password' @keyup.enter='submitLogin'>
          <el-input
            prefix-icon='iconfont  icon-3702mima'
            placeholder='password'
            v-model='loginForm.password'
            type='password'
          ></el-input>
        </el-form-item>
        <!-- button -->
        <el-form-item class='btns'>
          <el-button type='primary' @click='submitLogin'>登陆</el-button>
          <el-button type='info' @click='resetLoginForm'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 前端校验数据
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '密码格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登陆表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    submitLogin () {
      this.$refs.loginFormRef.validate(async validata => {
        if (validata) {
          // validata 返回一个promise对象 true 或者false
          console.log(validata)
          // await 返回的也是一个promise对象
          const { data: res } = await this.axios.post('login', this.loginForm)
          if (res.meta.status !== 200) return this.$message.error('用户名或密码错误')
          this.$message.success('登陆成功')
          // 1.将登陆成功之后的token,保存到客户端 的sessionStorage中
          //  1.1 项目中除了登陆之外的其他API 接口,必须在登陆之后才能访问
          //  1.2 token 只应在当前王钊打开期间生效，所以将token 保存到 sessionStorage中
          // 2.通过编程式导航跳转到 后台主页，路由地址是 /home
          // console.log(res)
          window.sessionStorage.setItem('token', res.data.token)
          // this.$router.push(name:'home',params:{r})
          this.$router.push('/home')
        } else {
          window.alert('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='css' scoped>
.login_container {
  height: 100%;
  background-color: rgba(21, 52, 87, 0.932);
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
