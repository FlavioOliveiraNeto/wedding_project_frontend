<template>
  <ToastTitle :class="cn('text-sm font-semibold', $props.class)">
    <slot />
  </ToastTitle>
</template>

<script setup lang="ts">
import { ToastTitle } from "radix-vue";
import { cn } from "@/lib/utils";

defineProps<{ class?: string }>();
</script>
