<template>
  <div>
    <h2>按编号查询</h2>
    <input v-model="assetNo" placeholder="输入自编号" />
    <button @click="query">查询</button>
    <pre v-if="asset">{{ JSON.stringify(asset, null, 2) }}</pre>
  </div>
</template>

<script>
import { getAsset } from '../api';
export default {
  data(){ return { assetNo: '', asset: null } },
  methods: {
    async query() {
      try { this.asset = await getAsset(this.assetNo); }
      catch(e){ this.asset = { error: '未找到' }; }
    }
  }
}
</script>
