<template>
  <div>
    <h2>管理员登录</h2>
    <input v-model="user" placeholder="用户名" />
    <input type="password" v-model="pass" placeholder="密码" />
    <button @click="doLogin">登录</button>
    <p v-if="msg">{{ msg }}</p>
  </div>
</template>

<script>
import { login } from '../api';
export default {
  data(){ return { user:'', pass:'', msg:'' } },
  methods: {
    async doLogin() {
      try {
        const r = await login(this.user, this.pass);
        localStorage.setItem('token', r.token);
        this.$router.push('/admin');
      } catch(e) { this.msg = '登录失败'; }
    }
  }
}
</script>
