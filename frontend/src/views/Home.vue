<template>
  <div>
    <h2>按自编号模糊查询</h2>

    <input
      v-model="q"
      placeholder="输入自编号（支持模糊搜索）"
      @keyup.enter="query"
    />
    <button @click="query">查询</button>

    <!-- 加载状态 -->
    <p v-if="loading">🔍 正在搜索...</p>

    <!-- 无关键词提示 -->
    <p v-else-if="!searched">请输入关键词进行搜索</p>

    <!-- 未找到 -->
    <p v-else-if="list.length === 0">
      未找到匹配数据
    </p>

    <!-- 查询结果表格 -->
    <table v-if="list.length > 0" border="1" style="margin-top: 10px;">
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
        <tr v-for="item in list" :key="item.asset_no">
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
  </div>
</template>

<script>
import { searchAssets } from '../api';

export default {
  data() {
    return {
      q: '',
      list: [],
      searched: false,
      loading: false
    };
  },
  methods: {
    async query() {
      if (!this.q.trim()) return;

      this.loading = true;
      this.searched = true;
      this.list = []; // 清空旧数据

      try {
        const result = await searchAssets({ q: this.q });

        // ✅ 安全处理两种可能的返回格式
        if (Array.isArray(result)) {
          this.list = result;
        } else if (result && Array.isArray(result.data)) {
          this.list = result.data;
        } else {
          this.list = [];
        }
      } catch (err) {
        console.error('搜索失败:', err);
        this.list = [];
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
