<template>
  <div
    class="app"
    :data-build="import.meta.env.VITE_BUILD_TIME || 'dev'"
  >
    <header class="header">
      <h1 class="title">
        <span class="word"><i>S</i>zmg</span>
        <span class="word"><i>T</i>echnical</span>
        <span class="word"><i>E</i>nterprise</span>
        <span class="word"><i>A</i>sset</span>
        <span class="word"><i>M</i>anagement</span>
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

/* 标题（响应式） */
.title {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: clamp(18px, 4vw, 28px);
  line-height: 1.2;
  margin: 0;
}

/* 单词整体 */
.word {
  white-space: nowrap;
  color: #ffffcd;
}

/* 首字母高亮 */
.word i {
  color: #FAFAD2;
  font-style: normal;
  font-weight: inherit;
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

/* 超小屏进一步优化 */
@media (max-width: 480px) {
  .title {
    font-size: 18px;
    gap: 4px;
  }

  .nav a {
    font-size: 13px;
  }
}
</style>
