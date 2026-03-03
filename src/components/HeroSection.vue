<template>
  <section
    id="home"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <!-- Background image -->
    <div class="absolute inset-0">
      <img
        :src="heroImage"
        alt="Flores do casamento"
        class="w-full h-full object-cover object-[center_70%]"
      />
      <div class="absolute inset-0 bg-foreground/40" />
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-4 animate-fade-in">
      <p
        class="text-sm md:text-base tracking-[0.4em] uppercase text-primary-foreground/80 font-body mb-6"
      >
        Celebrem conosco
      </p>

      <h1
        class="font-heading text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-4 font-light italic"
      >
        Flávio & Gabriella
      </h1>

      <div class="divider-ornament max-w-xs mx-auto my-6">
        <span class="text-accent text-lg">♥</span>
      </div>

      <p
        class="text-lg md:text-xl text-primary-foreground/90 font-body font-light tracking-wide mb-10"
      >
        04 de Abril de 2026 · 12h
      </p>

      <!-- Countdown -->
      <div
        v-if="weddingHappened"
        class="text-primary-foreground/90 font-heading text-2xl md:text-3xl italic"
      >
        O grande dia chegou!
      </div>

      <div v-else class="flex justify-center gap-4 md:gap-8">
        <div
          v-for="(value, label) in timeLeft"
          :key="label"
          class="flex flex-col items-center"
        >
          <span
            class="text-3xl md:text-5xl font-heading text-primary-foreground"
          >
            {{ value }}
          </span>

          <span
            class="text-xs md:text-sm uppercase tracking-widest text-primary-foreground/70 font-body mt-1"
          >
            {{ label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import heroImage from "@/assets/images/teste_1.jpeg";

interface TimeLeft {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

const calculateTimeLeft = (): TimeLeft => {
  const weddingDate = new Date("2026-04-04T12:00:00");
  const now = new Date();
  const diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  }

  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  };
};

const weddingHappened = computed(
  () => new Date() >= new Date("2026-04-04T12:00:00"),
);

const timeLeft = ref<TimeLeft>(calculateTimeLeft());

let timer: number;

onMounted(() => {
  timer = window.setInterval(() => {
    timeLeft.value = calculateTimeLeft();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>
