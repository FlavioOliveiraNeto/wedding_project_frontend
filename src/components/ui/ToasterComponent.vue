<template>
  <ToastProvider>
    <Toast v-for="toast in toasts" :key="toast.id" v-bind="toast">
      <div class="grid gap-1">
        <ToastTitle v-if="toast.title">
          {{ toast.title }}
        </ToastTitle>

        <ToastDescription v-if="toast.description">
          {{ toast.description }}
        </ToastDescription>
      </div>

      <!-- Action slot (se existir) -->
      <component v-if="toast.action" :is="toast.action" />

      <ToastClose />
    </Toast>

    <ToastViewport />
  </ToastProvider>
</template>

<script setup lang="ts">
import { useToast } from "@/composables/useToast";

import Toast from "@/components/ui/ToastComponent.vue";
import ToastClose from "@/components/ui/ToastClose.vue";
import ToastDescription from "@/components/ui/ToastDescription.vue";
import ToastProvider from "@/components/ui/ToastProvider.vue";
import ToastTitle from "@/components/ui/ToastTitle.vue";
import ToastViewport from "@/components/ui/ToastViewport.vue";

const { toasts } = useToast();
</script>
