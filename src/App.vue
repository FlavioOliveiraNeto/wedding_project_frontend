<template>
  <ToasterComponent />
  <Sonner />
  <router-view />
  <MusicPlayer />
</template>

<script setup lang="ts">
import ToasterComponent from "./components/ui/ToasterComponent.vue";
import Sonner from "@/components/ui/sonner/Sonner.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";
</script>
