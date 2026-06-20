<script setup lang="ts">
import ApiTester from '@/pages/ApiTester.vue'
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Multi-blob Clay Background -->
    <div class="bg-blobs">
      <div class="blob blob-1" />
      <div class="blob blob-2" />
      <div class="blob blob-3" />
      <div class="blob blob-4" />
    </div>

    <!-- Content -->
    <main class="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
      <ApiTester />
    </main>

    <footer class="relative z-10 border-t border-[#E4DEF0]/50 py-4 text-center text-sm text-[#6E6A78]">
      AI Key Tester · 纯本地测试，无任何数据上传
    </footer>
  </div>
</template>
