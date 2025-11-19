<template>
  <div>
    <h2>CSV 导入</h2>
    <input type="file" @change="onFile" />
    <select v-model="strategy">
      <option value="upsert">Upsert</option>
      <option value="replace">Replace (truncate then import)</option>
      <option value="append">Append</option>
    </select>
    <button @click="upload">上传</button>
    <p v-if="msg">{{ msg }}</p>
  </div>
</template>

<script>
import { uploadCsv } from '../api';
export default {
  data(){ return { file: null, msg:'', strategy:'upsert' } },
  methods: {
    onFile(e){ this.file = e.target.files[0]; },
    async upload(){
      const token = localStorage.getItem('token');
      if (!token) return this.msg = '请先登录';
      try {
        await uploadCsv(this.file, token, this.strategy);
        this.msg = '上传成功';
      } catch(e){ this.msg = '上传失败: ' + (e.response?.data?.error || e.message); }
    }
  }
}
</script>
