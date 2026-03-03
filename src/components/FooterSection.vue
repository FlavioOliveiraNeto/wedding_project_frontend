<template>
  <footer class="py-12 bg-card border-t border-border">
    <div class="container mx-auto px-4 text-center">
      <h3 class="font-heading text-2xl italic text-foreground mb-2">
        Flávio & Gabriella
      </h3>

      <p class="text-muted-foreground font-body text-sm mb-4">
        04 de Abril de 2026
      </p>

      <div
        class="flex items-center justify-center gap-1 text-muted-foreground text-xs font-body"
      >
        <span>Feito com</span>

        <Heart class="w-3 h-3 fill-secondary text-secondary" />

        <span>para o nosso grande dia</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Heart } from "lucide-vue-next";
</script>
