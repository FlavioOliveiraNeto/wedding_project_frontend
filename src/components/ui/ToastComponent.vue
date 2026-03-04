<template>
  <ToastRoot
    :open="open"
    :duration="duration"
    :class="cn(toastVariants({ variant: props.variant }), props.class)"
    @update:open="onOpenChange?.($event)"
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
  open?: boolean;
  duration?: number;
  onOpenChange?: (open: boolean) => void;
}

const props = defineProps<Props>();
</script>
