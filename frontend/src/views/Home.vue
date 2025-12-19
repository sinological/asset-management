<template>
  <div class="home">
    <h2>按自编号查询</h2>

    <div class="search-bar">
      <input
        v-model="q"
        placeholder="输入自编号(支持模糊搜索)"
        @keyup.enter="query(1)"
      />
      <button @click="query(1)">查询</button>
    </div>

    <p v-if="loading">正在搜索...</p>
    <p v-else-if="searched && list.length === 0">未找到匹配数据</p>

    <!-- 表格 -->
    <div class="table-wrapper" v-if="list.length > 0">
      <table>
        <thead>
          <tr>
            <th>自编号</th>
            <th>名称</th>
            <th>型号</th>
            <th>厂家</th>
            <th>责任人</th>
            <th>部门</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.asset_no">
            <td>{{ item.asset_no }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.manufacturer }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.department }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="list.length > 0">
      <button :disabled="page === 1" @click="query(page - 1)">上一页</button>
      <span>第 {{ page }} 页</span>
      <button @click="query(page + 1)">下一页</button>
    </div>
  </div>
</template>

<script>
import { searchAssets } from '../api';

export default {
  data() {
    return {
      q: '',
      list: [],
      loading: false,
      searched: false,
      page: 1,
      perPage: 20
    };
  },
  methods: {
    async query(p) {
      if (!this.q.trim()) return;

      this.loading = true;
      this.searched = true;
      this.page = p;

      const res = await searchAssets({
        q: this.q,
        page: this.page,
        per_page: this.perPage
      });

      this.list = res.data || [];
      this.loading = false;
    }
  }
};
</script>

<style>
.home {
  max-width: 100%;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.search-bar input {
  flex: 1;
  min-width: 200px;
  padding: 6px;
}

/* 表格响应式 */
.table-wrapper {
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ccc;
  padding: 6px;
  font-size: 14px;
}

/* 分页 */
.pagination {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

.pagination button {
  padding: 6px 12px;
}
</style>

