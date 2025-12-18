<template>
  <div>
    <header class="app-header">
      <h1 class="title">
        <span><i>S</i>zmg</span>
        <span><i>T</i>echnical</span>
        <span><i>E</i>nterprise</span>
        <span><i>A</i>sset</span>
        <span><i>M</i>anagement</span>
      </h1>

      <nav class="nav">
        <router-link to="/">Home</router-link>
        <span class="sep">|</span>
        <router-link to="/search">Search</router-link>
        <span class="sep">|</span>
        <router-link to="/admin/login">Admin</router-link>
      </nav>
    </header>

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* 顶部整体样式 */
.app-header {
  padding: 12px;
  background: #C71585; /* ✅ 新背景色 */
  color: white;
}

/* 标题样式 */
.title {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
}

/* 单词间距 */
.title span {
  margin-right: 6px;
}

/* 每个单词首字母 */
.title i {
  color: #FFFFCD; /* ✅ 首字母颜色 */
  font-style: normal;
}

/* 导航栏 */
.nav {
  margin-top: 6px;
}

.nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.nav a:hover {
  text-decoration: underline;
}

.sep {
  margin: 0 6px;
  color: rgba(255, 255, 255, 0.6);
}

/* 主内容区域 */
.main {
  padding: 20px;
}
</style>

