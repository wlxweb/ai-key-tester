<script setup lang="ts">
import ApiTester from '@/pages/ApiTester.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <main class="container mx-auto px-4 py-8 max-w-6xl">
      <ApiTester />
    </main>
    <footer class="border-t py-4 text-center text-xs text-muted-foreground">
      AI Key Tester &mdash; 纯本地测试，无任何数据上传
    </footer>
  </div>
</template>
