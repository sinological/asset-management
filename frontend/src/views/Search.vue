<template>
  <div>
    <h2>高级搜索（支持多字段模糊）</h2>

    <!-- 搜索条件 -->
    <div class="search-bar">
      <input v-model="owner" placeholder="责任人（模糊）" />
      <input v-model="name" placeholder="设备名称（模糊）" />
      <input v-model="model" placeholder="型号（模糊）" />
      <button @click="search(1)">搜索</button>
    </div>

    <!-- 无数据提示 -->
    <div v-if="searched && list.length === 0">
      未找到匹配数据
    </div>

    <!-- 结果表格 -->
    <table v-if="list.length > 0" border="1" cellpadding="6">
      <thead>
        <tr>
          <th>自编号</th>
          <th>名称</th>
          <th>型号</th>
          <th>厂家</th>
          <th>序列号</th>
          <th>责任人</th>
          <th>部门</th>
          <th>启用日期</th>
          <th>价格</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.asset_no }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.model }}</td>
          <td>{{ item.manufacturer }}</td>
          <td>{{ item.serial_number }}</td>
          <td>{{ item.owner }}</td>
          <td>{{ item.department }}</td>
          <td>{{ item.start_date }}</td>
          <td>{{ item.price }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pager">
      <button
        :disabled="page === 1"
        @click="search(page - 1)"
      >
        上一页
      </button>

      <span>
        第 {{ page }} / {{ totalPages }} 页（共 {{ total }} 条）
      </span>

      <button
        :disabled="page === totalPages"
        @click="search(page + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script>
import { searchAssets } from '../api'

export default {
  data() {
    return {
      owner: '',
      name: '',
      model: '',

      list: [],
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,

      searched: false
    }
  },

  methods: {
    async search(p) {
      this.page = p
      this.searched = true

      const params = {
        page: this.page,
        pageSize: this.pageSize
      }

      if (this.owner) params.owner = this.owner
      if (this.name) params.name = this.name
      if (this.model) params.model = this.model

      const r = await searchAssets(params)

      this.list = r.list
      this.total = r.total
      this.totalPages = r.totalPages
    }
  }
}
</script>

<style>
.search-bar {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pager {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>

