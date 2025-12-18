<template>
  <div class="app">
    <header class="header">
      <h1 class="title">
        <span>Szmg</span>
        <span>Technical</span>
        <span>Enterprise</span>
        <span>Asset</span>
        <span>Management</span>
      </h1>

      <nav class="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/search">Search</router-link>
        <router-link to="/admin/login">Admin</router-link>
      </nav>
    </header>

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style>
/* 整体 */
.app {
  font-family: Arial, Helvetica, sans-serif;
}

/* 顶部栏 */
.header {
  background: #c71585;
  color: white;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 标题：响应式关键 */
.title {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  font-size: clamp(18px, 4vw, 28px); /* 自动缩放 */
  line-height: 1.2;
  margin: 0;
}

.title span {
  color: #ffffcd;
  white-space: nowrap;
}

/* 导航 */
.nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.nav a {
  color: white;
  text-decoration: none;
  font-size: 14px;
}

.nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}

/* 内容区 */
.main {
  padding: 16px;
}

/* 手机特殊优化 */
@media (max-width: 480px) {
  .nav {
    font-size: 13px;
  }
}
</style>

