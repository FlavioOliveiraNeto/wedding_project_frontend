<template>
  <section id="presentes" class="py-20 md:py-32 bg-background">
    <div class="container mx-auto px-4">
      <!-- HEADER -->
      <div class="text-center mb-12">
        <p
          class="text-lg tracking-[0.3em] uppercase text-muted-foreground font-body mb-3"
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
          class="text-muted-foreground font-body mt-6 max-w-lg mx-auto text-lg leading-relaxed"
        >
          Sua presença é o nosso maior presente! Mas se quiser nos presentear,
          preparamos algumas sugestões com muito carinho.
        </p>
      </div>

      <!-- LOADING -->
      <div
        v-if="loading"
        class="text-center py-12 text-muted-foreground font-body"
      >
        Carregando presentes...
      </div>

      <!-- ERROR -->
      <div
        v-else-if="loadError"
        class="text-center py-12 text-muted-foreground font-body"
      >
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

        <!-- CONTADOR 
        <p class="text-center text-xs text-muted-foreground font-body mb-6">
          {{ filteredGifts.length }}
          {{ filteredGifts.length === 1 ? "presente" : "presentes" }}
          <template v-if="activeCategory">na categoria <strong>{{ activeCategoryLabel }}</strong></template>
        </p>-->

        <!-- GRID -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          <div
            v-for="gift in paginatedGifts"
            :key="gift.id"
            :class="[
              'rounded-lg border p-5 text-center transition-all duration-300 flex flex-col',
              gift.sold_out
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

            <span class="text-sm text-gray-500">Clique na imagem abaixo para abrir o link</span>

            <a
              v-if="getGiftImage(gift.name)"
              :href="gift.purchase_url ?? undefined"
              :target="gift.purchase_url ? '_blank' : undefined"
              :rel="gift.purchase_url ? 'noopener noreferrer' : undefined"
              class="block my-3"
            >
              <img
                :src="getGiftImage(gift.name)!"
                :alt="gift.name"
                class="w-full h-36 object-contain rounded"
              />
            </a>
            <div v-else class="mt-3" />

            <p
              v-if="gift.description"
              class="text-muted-foreground font-body text-sm mb-4 leading-relaxed"
            >
              {{ gift.description }}
            </p>

            <div v-else class="mb-4" />

            <div class="mt-auto">
              <template v-if="gift.sold_out">
                <span
                  class="inline-flex items-center gap-1 text-sm text-muted-foreground font-body"
                >
                  <Heart class="w-3 h-3 fill-secondary text-secondary" />
                  <template v-if="gift.quantity === 1">
                    Escolhido por {{ gift.selected_by }}
                  </template>
                  <template v-else>
                    Todos os {{ gift.quantity }} foram escolhidos
                  </template>
                </span>
              </template>

              <template v-else>
                <p
                  v-if="gift.quantity > 1"
                  class="text-sm text-muted-foreground font-body mb-2"
                >
                  <span class="font-medium text-accent">{{
                    gift.remaining
                  }}</span>
                  de {{ gift.quantity }} disponíveis
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  @click="selectedGift = gift"
                  class="font-body text-sm tracking-wider uppercase"
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
          class="text-center text-muted-foreground font-body text-lg py-8"
        >
          Nenhum presente nesta categoria.
        </p>

        <!-- PAGINAÇÃO -->
        <div
          v-if="totalPages > 1"
          class="flex justify-center items-center gap-1 md:gap-2 mt-10"
        >
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-2 py-1.5 md:px-4 rounded-full text-xs font-body tracking-wider uppercase transition-all duration-200 bg-muted text-muted-foreground hover:bg-muted/70 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-8 h-8 rounded-full text-xs font-body transition-all duration-200',
              currentPage === page
                ? 'bg-accent text-white shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/70',
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-2 py-1.5 md:px-4 rounded-full text-xs font-body tracking-wider uppercase transition-all duration-200 bg-muted text-muted-foreground hover:bg-muted/70 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </template>
    </div>

    <!-- DIALOG -->
    <Dialog :open="isDialogOpen" @update:open="(val) => !val && closeDialog()">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle
            class="font-heading text-2xl italic text-foreground text-center mb-2"
          >
            Presentear o casal
          </DialogTitle>

          <DialogDescription class="text-md font-body text-muted-foreground">
            Você escolheu
            <strong class="text-foreground">{{ selectedGift?.name }}</strong
            >. Pesquise seu nome na lista de convidados para confirmar.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 pt-2">
          <div class="flex flex-col space-y-2">
            <Label class="font-body text-lg tracking-wide">
              Quem vai presentear?*
            </Label>

            <!-- Combobox de busca de convidados -->
            <div class="relative" ref="comboboxRef">
              <Input
                v-model="searchQuery"
                placeholder="Buscar nome na lista de convidados..."
                class="bg-background"
                autocomplete="off"
                @input="onSearchInput"
                @focus="onSearchFocus"
                @keydown.down.prevent="moveFocus(1)"
                @keydown.up.prevent="moveFocus(-1)"
                @keydown.enter.prevent="selectFocused"
                @keydown.escape="closeDropdown"
              />

              <!-- Dropdown de resultados -->
              <div
                v-if="
                  dropdownOpen &&
                  (filteredResults.length > 0 || searchLoading || noResults)
                "
                class="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md overflow-hidden"
              >
                <div
                  v-if="searchLoading"
                  class="px-3 py-2 text-sm text-muted-foreground font-body"
                >
                  Buscando...
                </div>

                <div
                  v-else-if="noResults"
                  class="px-3 py-2 text-sm text-muted-foreground font-body"
                >
                  Nenhum convidado encontrado.
                </div>

                <ul v-else>
                  <li
                    v-for="(guest, index) in filteredResults"
                    :key="guest.id"
                    :class="[
                      'px-3 py-2 text-sm font-body cursor-pointer transition-colors',
                      focusedIndex === index
                        ? 'bg-accent text-white'
                        : 'hover:bg-muted',
                    ]"
                    @mousedown.prevent="addGuest(guest)"
                    @mouseover="focusedIndex = index"
                  >
                    {{ guest.full_name }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Tags dos convidados já adicionados -->
            <div
              v-if="selectedGuests.length > 0"
              class="flex flex-wrap gap-1.5 mb-1"
            >
              <span
                v-for="guest in selectedGuests"
                :key="guest.id"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-sm font-body border border-accent/20"
              >
                <Heart class="w-3 h-3 fill-accent" />
                {{ guest.full_name }}
                <button
                  type="button"
                  @click="removeGuest(guest.id)"
                  class="ml-0.5 text-accent/60 hover:text-accent transition-colors"
                  aria-label="Remover"
                >
                  ✕
                </button>
              </span>
            </div>
          </div>

          <Button
            @click="handleConfirm"
            :disabled="confirming || selectedGuests.length === 0"
            class="w-full font-body tracking-widest uppercase text-lg py-5"
          >
            {{ confirming ? "Confirmando..." : "Confirmar presente" }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
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

const giftImages = import.meta.glob(
  "../assets/images/presentes/*.{jpg,jpeg,png,webp}",
  { eager: true },
) as Record<string, { default: string }>;

const slugify = (str: string): string =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const getGiftImage = (name: string): string | null => {
  const slug = slugify(name);
  for (const [path, mod] of Object.entries(giftImages)) {
    const filename = slugify(path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "");
    if (filename === slug) return mod.default;
  }
  return null;
};

interface GiftItem {
  id: number;
  name: string;
  description: string | null;
  category: string;
  category_label: string;
  quantity: number;
  remaining: number;
  sold_out: boolean;
  selected_by: string | null;
  purchase_url: string | null;
}

interface GuestResult {
  id: number;
  full_name: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  quarto: "bg-blue-100 text-blue-700",
  cozinha: "bg-orange-100 text-orange-700",
  sala: "bg-purple-100 text-purple-700",
  banheiro: "bg-cyan-100 text-cyan-700",
  jardim: "bg-green-100 text-green-700",
  escritorio: "bg-yellow-100 text-yellow-700",
  decoracao: "bg-pink-100 text-pink-700",
  eletronico: "bg-indigo-100 text-indigo-700",
  outro: "bg-muted text-muted-foreground",
};

const gifts = ref<GiftItem[]>([]);
const loading = ref(true);
const loadError = ref(false);
const selectedGift = ref<GiftItem | null>(null);
const confirming = ref(false);
const activeCategory = ref<string | null>(null);

const searchQuery = ref("");
const searchResults = ref<GuestResult[]>([]);
const selectedGuests = ref<GuestResult[]>([]);
const searchLoading = ref(false);
const dropdownOpen = ref(false);
const focusedIndex = ref(-1);
const noResults = ref(false);
const comboboxRef = ref<HTMLElement | null>(null);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const filteredResults = computed(() => {
  const ids = new Set(selectedGuests.value.map((g) => g.id));
  return searchResults.value.filter((g) => !ids.has(g.id));
});

const isDialogOpen = computed(() => !!selectedGift.value);

const availableCategories = computed(() => {
  const seen = new Map<string, string>();
  for (const gift of gifts.value) {
    if (!seen.has(gift.category)) {
      seen.set(gift.category, gift.category_label);
    }
  }
  return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
});

const PAGE_SIZE = 12;
const currentPage = ref(1);

const filteredGifts = computed(() =>
  activeCategory.value
    ? gifts.value.filter((g) => g.category === activeCategory.value)
    : gifts.value,
);

const totalPages = computed(() =>
  Math.ceil(filteredGifts.value.length / PAGE_SIZE),
);

const paginatedGifts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return filteredGifts.value.slice(start, start + PAGE_SIZE);
});

watch(activeCategory, () => {
  currentPage.value = 1;
});

const activeCategoryLabel = computed(() => {
  if (!activeCategory.value) return "";
  return (
    availableCategories.value.find((c) => c.value === activeCategory.value)
      ?.label ?? ""
  );
});

const categoryBadgeClass = (category: string) =>
  CATEGORY_COLORS[category] ?? CATEGORY_COLORS["outro"];

const fetchGifts = async () => {
  loading.value = true;
  loadError.value = false;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/gifts`);
    if (!response.ok) throw new Error("Erro ao buscar presentes");
    gifts.value = await response.json();
  } catch {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGifts();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {
  if (comboboxRef.value && !comboboxRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

const onSearchInput = () => {
  noResults.value = false;
  focusedIndex.value = -1;

  if (searchTimeout) clearTimeout(searchTimeout);

  if (searchQuery.value.trim().length < 2) {
    searchResults.value = [];
    dropdownOpen.value = false;
    return;
  }

  searchTimeout = setTimeout(() => searchGuests(), 300);
};

const onSearchFocus = () => {
  if (filteredResults.value.length > 0) {
    dropdownOpen.value = true;
  }
};

const searchGuests = async () => {
  searchLoading.value = true;
  dropdownOpen.value = true;
  try {
    const response = await fetch(
      `/api/v1/guests/search?q=${encodeURIComponent(searchQuery.value.trim())}`,
    );
    const data: GuestResult[] = await response.json();
    searchResults.value = data;
    noResults.value = data.length === 0;
  } catch {
    searchResults.value = [];
    noResults.value = true;
  } finally {
    searchLoading.value = false;
  }
};

const addGuest = (guest: GuestResult) => {
  if (!selectedGuests.value.find((g) => g.id === guest.id)) {
    selectedGuests.value.push(guest);
  }
  searchQuery.value = "";
  searchResults.value = [];
  dropdownOpen.value = false;
  noResults.value = false;
  focusedIndex.value = -1;
};

const removeGuest = (id: number) => {
  selectedGuests.value = selectedGuests.value.filter((g) => g.id !== id);
};

const closeDropdown = () => {
  dropdownOpen.value = false;
  focusedIndex.value = -1;
};

const moveFocus = (direction: number) => {
  if (!dropdownOpen.value || filteredResults.value.length === 0) return;
  focusedIndex.value = Math.max(
    0,
    Math.min(filteredResults.value.length - 1, focusedIndex.value + direction),
  );
};

const selectFocused = () => {
  if (focusedIndex.value >= 0 && filteredResults.value[focusedIndex.value]) {
    addGuest(filteredResults.value[focusedIndex.value]);
  }
};

const handleConfirm = async () => {
  if (selectedGuests.value.length === 0 || !selectedGift.value) {
    toast({
      title: "Por favor, selecione ao menos um nome da lista.",
      variant: "destructive",
    });
    return;
  }

  confirming.value = true;

  try {
    const response = await fetch(
      `/api/v1/gifts/${selectedGift.value.id}/select`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift_selection: { guest_ids: selectedGuests.value.map((g) => g.id) },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      toast({
        title: data.error || "Erro ao confirmar presente.",
        variant: "destructive",
      });
      return;
    }

    const names = selectedGuests.value.map((g) => g.full_name).join(" e ");
    toast({
      title: "Presente escolhido! 🎁",
      description: `Obrigado, ${names}! O casal ficará muito feliz com o seu presente (${selectedGift.value.name}).`,
    });

    await fetchGifts();
    closeDialog();
  } catch {
    toast({
      title: "Erro de conexão. Tente novamente.",
      variant: "destructive",
    });
  } finally {
    confirming.value = false;
  }
};

const closeDialog = () => {
  selectedGift.value = null;
  searchQuery.value = "";
  selectedGuests.value = [];
  searchResults.value = [];
  dropdownOpen.value = false;
  noResults.value = false;
  focusedIndex.value = -1;
};
</script>
