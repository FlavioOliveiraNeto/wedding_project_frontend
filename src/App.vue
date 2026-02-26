<template>
  <ToasterComponent />
  <Sonner />
  <router-view />
</template>

<script setup lang="ts">
import ToasterComponent from "./components/ui/ToasterComponent.vue";
import Sonner from "@/components/ui/sonner/Sonner.vue";
</script>
