<template>
  <div>
    <h2>CSV 导入</h2>

    <input type="file" @change="onFile" />
    <select v-model="strategy">
      <option value="upsert">Upsert</option>
      <option value="replace">Replace（清空后导入）</option>
      <option value="append">Append</option>
    </select>

    <button @click="upload">上传</button>

    <div v-if="loading">导入中... {{ progressMsg }}</div>

    <p v-if="msg">{{ msg }}</p>
  </div>
</template>

<script>
import { uploadCsv } from '../api';

export default {
  data() {
    return {
      file: null,
      strategy: 'upsert',
      loading: false,
      progressMsg: '',
      msg: ''
    };
  },
  methods: {
    onFile(e) {
      this.file = e.target.files[0];
    },
    async upload() {
      const token = localStorage.getItem('token');
      if (!token) return this.msg = '请先登录';

      this.loading = true;
      this.progressMsg = '处理中...';

      try {
        const r = await uploadCsv(this.file, token, this.strategy);
        this.msg = `导入成功，共导入 ${r.imported} 条`;
      } catch (e) {
        this.msg = '导入失败：' + (e.response?.data?.error || e.message);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

