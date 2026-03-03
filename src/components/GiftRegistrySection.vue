<template>
  <section id="presentes" class="py-20 md:py-32 bg-background">
    <div class="container mx-auto px-4">
      <!-- HEADER -->
      <div class="text-center mb-12">
        <p
          class="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body mb-3"
        >
          Sugestões com carinho
        </p>

        <h2 class="font-heading text-4xl md:text-5xl text-foreground italic">
          Lista de Presentes
        </h2>

        <div class="divider-ornament max-w-xs mx-auto mt-6">
          <span class="text-accent text-lg">♥</span>
        </div>

        <p
          class="text-muted-foreground font-body mt-6 max-w-lg mx-auto text-sm leading-relaxed"
        >
          Sua presença é o nosso maior presente! Mas se quiser nos presentear,
          preparamos algumas sugestões com muito carinho.
        </p>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="text-center py-12 text-muted-foreground font-body">
        Carregando presentes...
      </div>

      <!-- ERROR -->
      <div v-else-if="loadError" class="text-center py-12 text-muted-foreground font-body">
        Não foi possível carregar a lista de presentes.
      </div>

      <template v-else>
        <!-- FILTROS DE CATEGORIA -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button
            @click="activeCategory = null"
            :class="[
              'px-4 py-1.5 rounded-full text-xs font-body tracking-wider uppercase transition-all duration-200',
              activeCategory === null
                ? 'bg-accent text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/70',
            ]"
          >
            Todos
          </button>

          <button
            v-for="cat in availableCategories"
            :key="cat.value"
            @click="activeCategory = cat.value"
            :class="[
              'px-4 py-1.5 rounded-full text-xs font-body tracking-wider uppercase transition-all duration-200',
              activeCategory === cat.value
                ? 'bg-accent text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/70',
            ]"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- CONTADOR -->
        <p class="text-center text-xs text-muted-foreground font-body mb-6">
          {{ filteredGifts.length }}
          {{ filteredGifts.length === 1 ? "presente" : "presentes" }}
          <template v-if="activeCategory">na categoria <strong>{{ activeCategoryLabel }}</strong></template>
        </p>

        <!-- GRID -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          <div
            v-for="gift in filteredGifts"
            :key="gift.id"
            :class="[
              'rounded-lg border p-5 text-center transition-all duration-300 flex flex-col',
              gift.selected
                ? 'bg-muted/50 border-border opacity-60'
                : 'bg-card border-border hover:border-accent/50 hover:shadow-md',
            ]"
          >
            <!-- Badge de categoria -->
            <span
              class="inline-block self-center mb-3 px-2.5 py-0.5 rounded-full text-[10px] font-body tracking-widest uppercase"
              :class="categoryBadgeClass(gift.category)"
            >
              {{ gift.category_label }}
            </span>

            <h3 class="font-heading text-base text-foreground mb-1">
              {{ gift.name }}
            </h3>

            <p v-if="gift.value" class="text-accent font-body text-sm font-medium mb-1">
              R$ {{ formatValue(gift.value) }}
            </p>

            <p v-if="gift.description" class="text-muted-foreground font-body text-xs mb-4 leading-relaxed">
              {{ gift.description }}
            </p>

            <div v-else class="mb-4" />

            <div class="mt-auto">
              <template v-if="gift.selected">
                <span
                  class="inline-flex items-center gap-1 text-xs text-muted-foreground font-body"
                >
                  <Heart class="w-3 h-3 fill-secondary text-secondary" />
                  Escolhido por {{ gift.selected_by }}
                </span>
              </template>

              <template v-else>
                <Button
                  variant="outline"
                  size="sm"
                  @click="selectedGift = gift"
                  class="font-body text-xs tracking-wider uppercase"
                >
                  <GiftIcon class="w-3 h-3 mr-1" />
                  Quero presentear
                </Button>
              </template>
            </div>
          </div>
        </div>

        <!-- VAZIO -->
        <p
          v-if="filteredGifts.length === 0"
          class="text-center text-muted-foreground font-body text-sm py-8"
        >
          Nenhum presente nesta categoria.
        </p>
      </template>
    </div>

    <!-- DIALOG -->
    <Dialog :open="isDialogOpen" @update:open="(val) => !val && closeDialog()">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="font-heading text-xl italic text-foreground">
            Presentear o casal
          </DialogTitle>

          <DialogDescription class="font-body text-muted-foreground">
            Você escolheu
            <strong class="text-foreground">{{ selectedGift?.name }}</strong
            ><template v-if="selectedGift?.value">
              (R$ {{ formatValue(selectedGift.value) }})</template
            >. Informe seu nome para confirmar.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 pt-2">
          <div class="space-y-2">
            <Label for="giver-name" class="font-body text-sm tracking-wide">
              Seu nome completo *
            </Label>

            <Input
              id="giver-name"
              v-model="giverName"
              placeholder="Digite seu nome completo"
              class="bg-background"
              autofocus
            />
          </div>

          <Button
            @click="handleConfirm"
            :disabled="confirming"
            class="w-full font-body tracking-widest uppercase text-sm py-5"
          >
            {{ confirming ? 'Confirmando...' : 'Confirmar presente' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Gift as GiftIcon, Heart } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useToast } from "@/composables/useToast";

const { toast } = useToast();

interface GiftItem {
  id: number;
  name: string;
  description: string | null;
  value: number | null;
  category: string;
  category_label: string;
  selected: boolean;
  selected_by: string | null;
}

// Mapeamento de cores por categoria
const CATEGORY_COLORS: Record<string, string> = {
  quarto:     "bg-blue-100 text-blue-700",
  cozinha:    "bg-orange-100 text-orange-700",
  sala:       "bg-purple-100 text-purple-700",
  banheiro:   "bg-cyan-100 text-cyan-700",
  jardim:     "bg-green-100 text-green-700",
  escritorio: "bg-yellow-100 text-yellow-700",
  decoracao:  "bg-pink-100 text-pink-700",
  eletronico: "bg-indigo-100 text-indigo-700",
  outro:      "bg-muted text-muted-foreground",
};

const gifts = ref<GiftItem[]>([]);
const loading = ref(true);
const loadError = ref(false);
const selectedGift = ref<GiftItem | null>(null);
const giverName = ref("");
const confirming = ref(false);
const activeCategory = ref<string | null>(null);

const isDialogOpen = computed(() => !!selectedGift.value);

// Categorias presentes na lista atual, em ordem de aparecimento
const availableCategories = computed(() => {
  const seen = new Map<string, string>();
  for (const gift of gifts.value) {
    if (!seen.has(gift.category)) {
      seen.set(gift.category, gift.category_label);
    }
  }
  return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
});

const filteredGifts = computed(() =>
  activeCategory.value
    ? gifts.value.filter((g) => g.category === activeCategory.value)
    : gifts.value
);

const activeCategoryLabel = computed(() => {
  if (!activeCategory.value) return "";
  return availableCategories.value.find((c) => c.value === activeCategory.value)?.label ?? "";
});

const categoryBadgeClass = (category: string) =>
  CATEGORY_COLORS[category] ?? CATEGORY_COLORS["outro"];

const formatValue = (value: number | null) => {
  if (value === null) return "";
  return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
};

const fetchGifts = async () => {
  loading.value = true;
  loadError.value = false;
  try {
    const response = await fetch("/api/v1/gifts");
    if (!response.ok) throw new Error("Erro ao buscar presentes");
    gifts.value = await response.json();
  } catch {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchGifts);

const handleConfirm = async () => {
  if (!giverName.value.trim() || !selectedGift.value) {
    toast({ title: "Por favor, preencha seu nome completo.", variant: "destructive" });
    return;
  }

  confirming.value = true;

  try {
    const response = await fetch(`/api/v1/gifts/${selectedGift.value.id}/select`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gift_selection: { full_name: giverName.value.trim() } }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast({ title: data.error || "Erro ao confirmar presente.", variant: "destructive" });
      return;
    }

    toast({
      title: "Presente escolhido! 🎁",
      description: `Obrigado, ${giverName.value.trim()}! O casal ficará muito feliz com "${selectedGift.value.name}".`,
    });

    await fetchGifts();
    closeDialog();
  } catch {
    toast({ title: "Erro de conexão. Tente novamente.", variant: "destructive" });
  } finally {
    confirming.value = false;
  }
};

const closeDialog = () => {
  selectedGift.value = null;
  giverName.value = "";
};
</script>
