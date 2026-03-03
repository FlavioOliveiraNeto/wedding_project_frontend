<template>
  <section id="fotos" class="py-20 md:py-32 bg-background">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <p
          class="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body mb-3"
        >
          Nossos momentos
        </p>

        <h2 class="font-heading text-4xl md:text-5xl text-foreground italic">
          Ensaio Fotográfico
        </h2>

        <div class="divider-ornament max-w-xs mx-auto mt-6">
          <span class="text-accent text-lg">♥</span>
        </div>
      </div>

      <!-- Grid -->
      <div
        class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto"
      >
        <button
          v-for="(photo, index) in photos"
          :key="index"
          @click="openPhoto(index)"
          class="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <img
            :src="photo.src"
            :alt="photo.alt"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div
            class="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300"
          />
        </button>
      </div>

      <!-- Dialog / Lightbox -->
      <Dialog :open="isOpen" @update:open="closePhoto">
        <DialogContent
          class="max-w-4xl w-[95vw] p-0 bg-background/95 backdrop-blur-sm border-border overflow-hidden"
        >
          <div
            v-if="selectedIndex !== null"
            class="relative flex items-center justify-center min-h-[50vh] max-h-[85vh]"
          >
            <img
              :src="photos[selectedIndex].src"
              :alt="photos[selectedIndex].alt"
              class="max-w-full max-h-[80vh] object-contain"
            />

            <!-- Prev -->
            <button
              @click="goPrev"
              class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background transition-colors"
              aria-label="Foto anterior"
            >
              <ChevronLeft class="w-5 h-5" />
            </button>

            <!-- Next -->
            <button
              @click="goNext"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background transition-colors"
              aria-label="Próxima foto"
            >
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

interface Photo {
  src: string;
  alt: string;
}

const photos: Photo[] = [
  { src: "/photos/ensaio-1.jpg", alt: "Ensaio fotográfico 1" },
  { src: "/photos/ensaio-2.jpg", alt: "Ensaio fotográfico 2" },
  { src: "/photos/ensaio-3.jpg", alt: "Ensaio fotográfico 3" },
  { src: "/photos/ensaio-4.jpg", alt: "Ensaio fotográfico 4" },
  { src: "/photos/ensaio-5.jpg", alt: "Ensaio fotográfico 5" },
  { src: "/photos/ensaio-6.jpg", alt: "Ensaio fotográfico 6" },
];

const selectedIndex = ref<number | null>(null);

const isOpen = computed(() => selectedIndex.value !== null);

const openPhoto = (index: number) => {
  selectedIndex.value = index;
};

const closePhoto = () => {
  selectedIndex.value = null;
};

const goNext = () => {
  if (selectedIndex.value !== null) {
    selectedIndex.value = (selectedIndex.value + 1) % photos.length;
  }
};

const goPrev = () => {
  if (selectedIndex.value !== null) {
    selectedIndex.value =
      (selectedIndex.value - 1 + photos.length) % photos.length;
  }
};
</script>
