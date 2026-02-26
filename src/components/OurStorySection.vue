<template>
  <section id="historia" class="py-20 md:py-32 bg-background">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-16">
        <p
          class="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body mb-3"
        >
          Como tudo começou
        </p>

        <h2 class="font-heading text-4xl md:text-5xl text-foreground italic">
          Nossa História
        </h2>

        <div class="divider-ornament max-w-xs mx-auto mt-6">
          <span class="text-accent text-lg">♥</span>
        </div>
      </div>

      <!-- Timeline -->
      <div class="max-w-2xl mx-auto relative">
        <!-- Vertical line -->
        <div
          class="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px"
        />

        <div
          v-for="(item, i) in timeline"
          :key="item.year"
          :class="[
            'relative flex items-start mb-12 last:mb-0',
            i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
          ]"
        >
          <!-- Dot -->
          <div
            class="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-background z-10 mt-2"
          />

          <!-- Content -->
          <div
            :class="[
              'ml-14 md:ml-0 md:w-1/2',
              i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12',
            ]"
          >
            <span class="text-accent font-heading text-lg">
              {{ item.year }}
            </span>

            <h3 class="font-heading text-xl text-foreground mt-1 mb-2">
              {{ item.title }}
            </h3>

            <p class="text-muted-foreground font-body text-sm leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>

        <!-- End heart -->
        <div class="absolute left-6 md:left-1/2 -translate-x-1/2 -bottom-4">
          <Heart class="w-5 h-5 text-accent fill-accent" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Heart } from "lucide-vue-next";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const timeline: TimelineItem[] = [
  {
    year: "2018",
    title: "O Primeiro Encontro",
    description:
      "Em um café aconchegante no centro da cidade, Flávio e Gabriella se encontraram pela primeira vez. O que seria um encontro rápido se transformou em horas de conversa e risadas.",
  },
  {
    year: "2019",
    title: "Início do Namoro",
    description:
      "Depois de meses de amizade e encontros cada vez mais frequentes, Flávio tomou coragem e pediu Gabriella em namoro em um pôr do sol inesquecível.",
  },
  {
    year: "2021",
    title: "Mudando Juntos",
    description:
      "Com a certeza de que eram feitos um para o outro, decidiram dividir o mesmo teto e construir juntos um lar cheio de amor e cumplicidade.",
  },
  {
    year: "2024",
    title: "O Pedido",
    description:
      "Em uma viagem especial, Flávio surpreendeu Gabriella com o pedido de casamento mais emocionante. Entre lágrimas de felicidade, ela disse SIM!",
  },
  {
    year: "2025",
    title: "O Grande Dia",
    description:
      "Finalmente chegou o momento de celebrar nosso amor com todos que amamos. Estamos ansiosos para compartilhar essa data tão especial com vocês!",
  },
];
</script>
