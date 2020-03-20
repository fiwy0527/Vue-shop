<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-logo">
        <img
          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
          alt=""
        />
      </div>
      <div class="header-content"><h1>后台管理系统</h1></div>
      <el-button type="info" @click="logout" class="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="isCollapse = !isCollapse">| | |</div>
        <transition name="el-fade-in">
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="rgb(97,163,191)"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            class="transition-box"
            :router="true"
            :default-active="activePath"
          >
            <!-- 一级菜单模板区域 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + subItem.path + ''"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="updateActive('/' + subItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template></el-menu-item
              >
            </el-submenu>
          </el-menu>
        </transition>
      </el-aside>
      <!-- 主页 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMeauList() {
      // axios异步返回的是一个promise对象 data是里面的数据
      // this.axios.get('menus').then(ret => {
      //   console.log(ret.data.data)
      // })
      const { data: res } = await this.axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.message)
      this.menulist = res.data
    },
    updateActive(activepath) {
      window.sessionStorage.setItem('activepath', activepath)
      this.activePath = activepath
    }
  },
  created() {
    this.getMeauList()
    this.activePath = window.sessionStorage.getItem('activepath')
  }
}
</script>

<style lang="css" scoped>
.home_container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #373d47;
  display: flex;
  justify-content: space-between;
  color: #fff;
}
.el-header .logout {
  margin-top: 10px;
  width: 100px;
  height: 35px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
  height: 100%;
}
.header-logo {
  margin-top: 5px;
  width: 50px;
  height: 50px;
  border: 1px solid seashell;
  border-radius: 50%;
  box-sizing: border-box;
}
.header-logo img {
  width: 100%;
  border-radius: 50%;
  height: 100%;
}
.iconfont {
  margin-right: 7px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  letter-spacing: 0.2em;
  cursor: pointer;
  text-align: center;
  line-height: 25px;
}
.transition-box {
  border-radius: 4px;
  background-color: #409eff;
  color: #fff;
  box-sizing: border-box;
}
</style>
