<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
  >
    <div class="container mx-auto flex items-center justify-between py-4 px-4">
      <!-- Logo -->
      <button
        @click="scrollTo('#home')"
        class="font-heading text-xl tracking-wide text-foreground"
      >
        F & G
      </button>

      <!-- Desktop -->
      <ul class="hidden md:flex gap-8">
        <li v-for="item in navItems" :key="item.href">
          <button
            @click="scrollTo(item.href)"
            class="text-sm font-body tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>

      <!-- Mobile toggle -->
      <button class="md:hidden text-foreground" @click="open = !open">
        <component :is="open ? X : Menu" :size="24" />
      </button>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="open"
      class="md:hidden bg-background border-b border-border pb-4"
    >
      <ul class="flex flex-col items-center gap-4">
        <li v-for="item in navItems" :key="item.href">
          <button
            @click="scrollTo(item.href)"
            class="text-sm font-body tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Menu, X } from "lucide-vue-next";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Início", href: "#home" },
  { label: "Nossa História", href: "#historia" },
  //{ label: "Nossas Fotinhas", href: "#fotos" },
  //{ label: "Lista de Presença", href: "#presenca" },
  { label: "Lista de Presentes", href: "#presentes" },
];

const open = ref(false);

const scrollTo = (href: string) => {
  open.value = false;
  const el = document.querySelector(href);
  el?.scrollIntoView({ behavior: "smooth" });
};
</script>
