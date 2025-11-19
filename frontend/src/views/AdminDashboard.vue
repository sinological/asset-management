<template>
  <div>
    <h2>管理后台</h2>
    <p>已登录管理员: {{ user }}</p>
    <p><router-link to="/admin/upload">CSV 导入</router-link></p>
    <p><button @click="logout">退出</button></p>
  </div>
</template>

<script>
export default {
  computed: { user(){ return localStorage.getItem('admin_user') || 'admin'; } },
  methods: {
    logout(){ localStorage.removeItem('token'); localStorage.removeItem('admin_user'); this.$router.push('/admin/login'); }
  }
}
</script>
