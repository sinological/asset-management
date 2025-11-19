<template>
  <div>
    <h2>高级搜索</h2>
    <input v-model="q" placeholder="设备名称 / 责任人 / 部门" />
    <button @click="search">搜索</button>
    <pre v-if="result">{{ JSON.stringify(result, null, 2) }}</pre>
  </div>
</template>

<script>
import { searchAssets } from '../api';
export default {
  data(){ return { q: '', result: null } },
  methods: {
    async search(){ this.result = await searchAssets(this.q); }
  }
}
</script>
