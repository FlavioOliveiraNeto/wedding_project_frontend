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

      <!-- GRID -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl mx-auto"
      >
        <div
          v-for="gift in gifts"
          :key="gift.id"
          :class="[
            'rounded-lg border p-5 text-center transition-all duration-300',
            gift.selected
              ? 'bg-muted/50 border-border opacity-60'
              : 'bg-card border-border hover:border-accent/50 hover:shadow-md',
          ]"
        >
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
              <Gift class="w-3 h-3 mr-1" />
              Quero presentear
            </Button>
          </template>
        </div>
      </div>
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
import { Gift, Heart } from "lucide-vue-next";

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
  selected: boolean;
  selected_by: string | null;
}

const gifts = ref<GiftItem[]>([]);
const loading = ref(true);
const loadError = ref(false);
const selectedGift = ref<GiftItem | null>(null);
const giverName = ref("");
const confirming = ref(false);

const isDialogOpen = computed(() => !!selectedGift.value);

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
