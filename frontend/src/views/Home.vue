<template>
  <div>
    <h2>按编号模糊查询</h2>

    <input
      v-model="assetNo"
      placeholder="输入自编号（支持模糊搜索，大小写不敏感）"
    />
    <button @click="query">查询</button>

    <table v-if="assets.length">
      <thead>
        <tr>
          <th>自编号</th>
          <th>名称</th>
          <th>型号</th>
          <th>品牌</th>
          <th>序列号</th>
          <th>责任人</th>
          <th>部门</th>
          <th>启用日期</th>
          <th>价格</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in assets" :key="item.asset_no">
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

    <p v-if="searched && !assets.length">未找到匹配数据</p>
  </div>
</template>

<script>
import { searchAssets } from '../api';

export default {
  data() {
    return {
      assetNo: '',
      assets: [],
      searched: false
    };
  },
  methods: {
    async query() {
      this.searched = true;
      this.assets = [];

      if (!this.assetNo.trim()) return;

      this.assets = await searchAssets({
        asset_no: this.assetNo
      });
    }
  }
};
</script>

