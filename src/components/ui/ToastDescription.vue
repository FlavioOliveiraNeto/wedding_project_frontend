<template>
  <ToastDescription :class="cn('text-sm opacity-90', $props.class)">
    <slot />
  </ToastDescription>
</template>

<script setup lang="ts">
import { ToastDescription } from "radix-vue";
import { cn } from "@/lib/utils";

defineProps<{ class?: string }>();
</script>
