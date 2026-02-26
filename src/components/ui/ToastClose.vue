<template>
  <ToastClose
    :class="
      cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        $props.class,
      )
    "
  >
    <X class="h-4 w-4" />
  </ToastClose>
</template>

<script setup lang="ts">
import { ToastClose } from "radix-vue";
import { X } from "lucide-vue-next";
import { cn } from "@/lib/utils";

defineProps<{ class?: string }>();
</script>
