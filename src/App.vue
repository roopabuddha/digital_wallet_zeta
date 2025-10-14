<template>
  <div id="app" class="app-container">
    <!-- Animated route transitions -->
    <transition name="page-fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script setup>
// No script needed — purely structural
</script>

<style>
@import "@/assets/styles/global.css";
@import "@/assets/styles/theme.css";
@import "@/assets/styles/animations.css";

.app-container {
  min-height: 100vh;
  background: var(--bg-gradient);
  color: var(--text-light);
  font-family: 'Inter', system-ui, sans-serif;
  overflow-x: hidden;
}

/* Route transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
