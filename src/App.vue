<script setup lang="ts">
import ApiTester from '@/pages/ApiTester.vue'
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Clay Background Blobs -->
    <div class="clay-bg" />

    <!-- Content -->
    <main class="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
      <ApiTester />
    </main>

    <footer class="relative z-10 border-t border-[#D8D0E8]/50 py-4 text-center text-sm text-[#635F69]">
      AI Key Tester &mdash; 纯本地测试，无任何数据上传
    </footer>
  </div>
</template>
