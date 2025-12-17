<template>
  <div>
    <h2>按自编号模糊查询</h2>

    <input
      v-model="q"
      placeholder="输入自编号（支持模糊搜索）"
    />
    <button @click="query">查询</button>

    <div v-if="searched && list.length === 0">
      未找到匹配数据
    </div>

    <table v-if="list.length > 0" border="1">
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
  </div>
</template>

<script>
import { searchAssets } from '../api';

export default {
  data() {
    return {
      q: '',
      list: [],
      searched: false
    };
  },
  methods: {
    async query() {
      this.searched = true;
      const r = await searchAssets({ q: this.q });
      this.list = r.data;
    }
  }
};
</script>

