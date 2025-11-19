<template>
  <div>
    <header style="padding:12px; background:#2d89ff; color:white;">
      <h1>资产管理系统</h1>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/search">Search</router-link> |
        <router-link to="/admin/login">Admin</router-link>
      </nav>
    </header>
    <main style="padding:20px;">
      <router-view />
    </main>
  </div>
</template>
