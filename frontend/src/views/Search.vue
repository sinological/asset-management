<template>
  <div>
    <h2>高级搜索（支持多字段模糊）</h2>

    <div>
      <input v-model="owner" placeholder="责任人（模糊）" />
      <input v-model="name" placeholder="设备名称（模糊）" />
      <input v-model="model" placeholder="型号（模糊）" />
      <button @click="search">搜索</button>
    </div>

    <pre v-if="result">{{ JSON.stringify(result, null, 2) }}</pre>
  </div>
</template>

<script>
import { searchAssets } from '../api';

export default {
  data() {
    return {
      owner: '',
      name: '',
      model: '',
      result: null
    };
  },
  methods: {
    async search() {
      const params = {};

      if (this.owner) params.owner = this.owner;
      if (this.name) params.name = this.name;
      if (this.model) params.model = this.model;

      this.result = await searchAssets(params);
    }
  }
};
</script>

