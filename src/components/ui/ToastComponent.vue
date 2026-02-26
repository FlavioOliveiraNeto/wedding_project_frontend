<template>
  <ToastRoot
    :class="cn(toastVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </ToastRoot>
</template>

<script setup lang="ts">
import { ToastRoot } from "radix-vue";
import { cn } from "@/lib/utils";
import { toastVariants } from "./toast";

interface Props {
  variant?: "default" | "destructive";
  class?: string;
}

const props = defineProps<Props>();
</script>
