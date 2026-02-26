<template>
  <ToastAction
    :class="
      cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        $props.class,
      )
    "
  >
    <slot />
  </ToastAction>
</template>

<script setup lang="ts">
import { ToastAction } from "radix-vue";
import { cn } from "@/lib/utils";

defineProps<{ class?: string }>();
</script>
