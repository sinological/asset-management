<template>
  <div class="home">
    <h2>按自编号搜索</h2>

    <div class="search-bar">
      <input
        v-model="q"
        placeholder="输入自编号"
        @keyup.enter="search(1)"
      />
      <button @click="search(1)">查询</button>
    </div>

    <p v-if="loading">正在搜索...</p>
    <p v-else-if="searched && list.length === 0">未找到匹配数据</p>

    <!-- 桌面端表格 -->
    <table v-if="list.length" class="table">
      <thead>
        <tr>
          <th>编号</th>
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

    <!-- 手机端卡片 -->
    <div class="cards">
      <div class="card" v-for="item in list" :key="item.asset_no">
        <div><strong>编号：</strong>{{ item.asset_no }}</div>
        <div><strong>名称：</strong>{{ item.name }}</div>
        <div><strong>型号：</strong>{{ item.model }}</div>
        <div><strong>责任人：</strong>{{ item.owner }}</div>
        <div><strong>部门：</strong>{{ item.department }}</div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pager">
      <button @click="search(page - 1)" :disabled="page <= 1">上一页</button>
      <span>第 {{ page }} / {{ totalPages }} 页（共 {{ total }} 条）</span>
      <button @click="search(page + 1)" :disabled="page >= totalPages">下一页</button>
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
      totalPages: 0,
      total: 0
    };
  },
  methods: {
    async search(p) {
      if (!this.q.trim()) return;

      this.loading = true;
      this.searched = true;
      this.page = p;

      try {
        const r = await searchAssets({
          q: this.q,
          page: this.page,
          per_page: 20
        });
        this.list = r.data;
        this.totalPages = r.totalPages;
        this.total = r.total;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ccc;
  padding: 6px;
}

.cards {
  display: none;
}

.card {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 6px;
  background: #fafafa;
}

.pager {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
}

@media (max-width: 768px) {
  .table {
    display: none;
  }
  .cards {
    display: grid;
    gap: 12px;
  }
}
</style>

