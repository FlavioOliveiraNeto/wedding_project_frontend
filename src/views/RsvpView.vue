<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- TOPO -->
    <header class="py-8 text-center border-b border-border">
      <a href="/" class="inline-block">
        <p class="font-heading text-2xl text-foreground italic tracking-wide">
          Flávio & Gabriella
        </p>
        <p
          class="text-xs tracking-[0.3em] uppercase text-muted-foreground font-body mt-1"
        >
          04 · 04 · 2026
        </p>
      </a>
    </header>

    <!-- CONTEÚDO PRINCIPAL -->
    <main class="flex-1 flex items-center justify-center py-16 px-4">
      <div class="w-full max-w-md">
        <!-- LOADING -->
        <div v-if="isLoading" class="text-center space-y-4">
          <div
            class="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"
          />
          <p class="text-muted-foreground font-body text-sm">
            Carregando convite...
          </p>
        </div>

        <!-- TOKEN INVÁLIDO / ERRO -->
        <div v-else-if="isError" class="text-center space-y-6">
          <div
            class="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto"
          >
            <X class="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h1 class="font-heading text-2xl text-foreground italic mb-2">
              Link inválido
            </h1>
            <p class="text-muted-foreground font-body text-sm leading-relaxed">
              Este link de confirmação não é válido ou já expirou.<br />
              Entre em contato com os noivos para mais informações.
            </p>
          </div>
          <a
            href="/"
            class="inline-block text-sm font-body text-accent hover:text-accent/80 underline underline-offset-4 transition-colors"
          >
            Voltar ao site
          </a>
        </div>

        <!-- CONTEÚDO DO CONVITE -->
        <div v-else-if="guestData" class="space-y-8">
          <!-- CABEÇALHO DA SEÇÃO -->
          <div class="text-center">
            <p
              class="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body mb-3"
            >
              Confirmação de Presença
            </p>
            <h1
              class="font-heading text-3xl md:text-4xl text-foreground italic"
            >
              Olá, {{ guestData.full_name }}!
            </h1>
            <div class="divider-ornament max-w-xs mx-auto mt-5">
              <span class="text-accent text-lg">♥</span>
            </div>
          </div>

          <!-- CARD DO GRUPO FAMILIAR -->
          <div class="bg-card border border-border rounded-xl p-6 space-y-4">
            <!-- Membros do grupo -->
            <div>
              <p
                class="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body mb-3"
              >
                {{
                  guestData.companions.length > 0 ? "Seu grupo" : "Convidado"
                }}
              </p>

              <!-- Modo de seleção parcial: checkboxes -->
              <ul v-if="showPartialSelection" class="space-y-3">
                <li class="flex items-center gap-3">
                  <Checkbox
                    :checked="true"
                    :disabled="true"
                    class="opacity-60"
                  />
                  <span class="font-body text-foreground text-sm">
                    {{ guestData.full_name }}
                    <span class="text-muted-foreground text-xs ml-1"
                      >(responsável)</span
                    >
                  </span>
                </li>
                <li
                  v-for="companion in guestData.companions"
                  :key="companion.id"
                  class="flex items-center gap-3"
                >
                  <Checkbox
                    :checked="!declinedCompanionIds.has(companion.id)"
                    @update:checked="
                      (val: boolean | 'indeterminate') =>
                        toggleCompanion(companion.id, val)
                    "
                  />
                  <span
                    class="font-body text-sm cursor-pointer select-none"
                    :class="
                      declinedCompanionIds.has(companion.id)
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    "
                    @click="
                      toggleCompanion(
                        companion.id,
                        declinedCompanionIds.has(companion.id),
                      )
                    "
                  >
                    {{ companion.full_name }}
                  </span>
                </li>
              </ul>

              <!-- Modo normal: lista simples -->
              <ul v-else class="space-y-2">
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span class="font-body text-foreground text-sm">
                    {{ guestData.full_name }}
                    <span class="text-muted-foreground text-xs ml-1"
                      >(responsável)</span
                    >
                  </span>
                </li>
                <li
                  v-for="companion in guestData.companions"
                  :key="companion.id"
                  class="flex items-center gap-2"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 shrink-0"
                  />
                  <span class="font-body text-foreground text-sm">{{
                    companion.full_name
                  }}</span>
                </li>
              </ul>
            </div>

            <div class="border-t border-border pt-4">
              <div
                class="grid grid-cols-1 gap-1.5 text-xs font-body text-muted-foreground"
              >
                <p>
                  📅 <span class="text-foreground">04 de Abril de 2026</span> ·
                  12h
                </p>
                <p>📍 Espaço B eventos — Bairro Ilda, Aparecida de Goiânia</p>
              </div>
            </div>
          </div>

          <!-- ESTADO: JÁ CONFIRMADO (todos) -->
          <div
            v-if="resolvedStatus === 'confirmed'"
            class="text-center space-y-4"
          >
            <div
              class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto"
            >
              <Check class="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p class="font-heading text-xl text-foreground italic">
                Presença confirmada!
              </p>
              <p
                class="text-muted-foreground font-body text-sm mt-1 leading-relaxed"
              >
                Estamos muito felizes em contar com
                {{ guestData.companions.length > 0 ? "vocês" : "você" }} nesse
                dia especial. 💍
              </p>
            </div>
            <a
              href="/"
              class="inline-block text-sm font-body text-accent hover:text-accent/80 underline underline-offset-4 transition-colors"
            >
              Ver detalhes do evento
            </a>
          </div>

          <!-- ESTADO: RECUSOU (todos) -->
          <div
            v-else-if="resolvedStatus === 'declined'"
            class="text-center space-y-4"
          >
            <div
              class="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto"
            >
              <Heart class="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p class="font-heading text-xl text-foreground italic">
                Sentiremos a falta de vocês
              </p>
              <p
                class="text-muted-foreground font-body text-sm mt-1 leading-relaxed"
              >
                Obrigado por nos avisar. Será uma pena não ter
                {{ guestData.companions.length > 0 ? "vocês" : "você" }}
                conosco, mas entendemos. ♥
              </p>
            </div>
            <a
              href="/"
              class="inline-block text-sm font-body text-accent hover:text-accent/80 underline underline-offset-4 transition-colors"
            >
              Voltar ao site
            </a>
          </div>

          <!-- ESTADO: CONFIRMAÇÃO PARCIAL -->
          <div v-else-if="resolvedStatus === 'partial'" class="space-y-4">
            <div class="text-center">
              <div
                class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"
              >
                <Check class="w-7 h-7 text-green-600" />
              </div>
              <p class="font-heading text-xl text-foreground italic">
                Confirmação registrada!
              </p>
              <p class="text-muted-foreground font-body text-sm mt-1">
                Ficamos felizes com quem poderá comparecer. ♥
              </p>
            </div>

            <div class="bg-card border border-border rounded-xl p-5 space-y-4">
              <div v-if="confirmedNames.length > 0">
                <p
                  class="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body mb-2"
                >
                  ✅ Confirmados
                </p>
                <ul class="space-y-1">
                  <li
                    v-for="name in confirmedNames"
                    :key="name"
                    class="font-body text-sm text-foreground flex items-center gap-2"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"
                    />
                    {{ name }}
                  </li>
                </ul>
              </div>

              <div
                v-if="declinedNames.length > 0"
                class="border-t border-border pt-3"
              >
                <p
                  class="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body mb-2"
                >
                  ❌ Não poderão comparecer
                </p>
                <ul class="space-y-1">
                  <li
                    v-for="name in declinedNames"
                    :key="name"
                    class="font-body text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 shrink-0"
                    />
                    {{ name }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="text-center">
              <a
                href="/"
                class="inline-block text-sm font-body text-accent hover:text-accent/80 underline underline-offset-4 transition-colors"
              >
                Ver detalhes do evento
              </a>
            </div>
          </div>

          <!-- ESTADO: PENDENTE -->
          <div v-else class="space-y-3">
            <!-- Modo de seleção parcial: botões de confirmação/cancelar -->
            <div v-if="showPartialSelection" class="space-y-3">
              <p class="text-center text-muted-foreground font-body text-sm">
                Desmarque quem
                <strong class="text-foreground">não</strong> poderá comparecer.
              </p>
              <Button
                @click="submitPartial"
                :disabled="submitting"
                class="w-full font-body tracking-widest uppercase text-sm py-6"
              >
                <Check class="w-4 h-4 mr-2" />
                {{ submitting ? "Confirmando..." : "Confirmar Seleção" }}
              </Button>
              <Button
                @click="cancelPartialSelection"
                :disabled="submitting"
                variant="outline"
                class="w-full font-body tracking-widest uppercase text-sm py-5 text-muted-foreground"
              >
                Cancelar
              </Button>
            </div>

            <!-- Modo normal: 3 opções -->
            <div v-else class="space-y-3">
              <p class="text-center text-muted-foreground font-body text-sm">
                Você confirmará a presença de
                <strong class="text-foreground">
                  {{ guestData.companions.length + 1 }}
                  {{
                    guestData.companions.length + 1 === 1 ? "pessoa" : "pessoas"
                  }} </strong
                >.
              </p>

              <Button
                @click="submitRsvp('confirmed')"
                :disabled="submitting"
                class="w-full font-body tracking-widest uppercase text-sm py-6"
              >
                <Check class="w-4 h-4 mr-2" />
                {{
                  submitting && pendingAction === "confirmed"
                    ? "Confirmando..."
                    : "Confirmar Todos"
                }}
              </Button>

              <Button
                v-if="guestData.companions.length > 0"
                @click="enterPartialSelection"
                :disabled="submitting"
                variant="outline"
                class="w-full font-body tracking-widest uppercase text-sm py-5"
              >
                <Users class="w-4 h-4 mr-2" />
                Selecionar quem não poderá ir
              </Button>

              <Button
                @click="submitRsvp('declined')"
                :disabled="submitting"
                variant="outline"
                class="w-full font-body tracking-widest uppercase text-sm py-5 text-muted-foreground"
              >
                Nenhum poderá comparecer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- RODAPÉ -->
    <footer class="py-6 text-center border-t border-border">
      <p class="text-xs text-muted-foreground font-body">
        Com amor · Flávio & Gabriella ♥
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { Check, X, Heart, Users } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/composables/useToast";

const route = useRoute();
const { toast } = useToast();

const token = computed(() => route.params.token as string);

interface Companion {
  id: number;
  full_name: string;
  status: "pending" | "confirmed" | "declined";
}

interface GuestData {
  full_name: string;
  companions: Companion[];
  status: "pending" | "confirmed" | "declined";
  group_status: "pending" | "confirmed" | "declined" | "partial";
}

type ResolvedStatus = "confirmed" | "declined" | "partial" | null;

const fetchGuest = async (): Promise<GuestData> => {
  const response = await fetch(`/api/v1/rsvp/${token.value}`);
  if (!response.ok) throw new Error("Token inválido");
  return response.json();
};

const {
  data: guestData,
  isLoading,
  isError,
} = useQuery<GuestData>({
  queryKey: computed(() => ["rsvp", token.value]),
  queryFn: fetchGuest,
  retry: false,
});

const localStatus = ref<ResolvedStatus>(null);
const submitting = ref(false);
const pendingAction = ref<"confirmed" | "declined" | null>(null);

const showPartialSelection = ref(false);
const declinedCompanionIds = ref<Set<number>>(new Set());

const localConfirmedNames = ref<string[]>([]);
const localDeclinedNames = ref<string[]>([]);

const resolvedStatus = computed((): ResolvedStatus => {
  if (localStatus.value) return localStatus.value;
  const gs = guestData.value?.group_status;
  if (gs === "pending" || !gs) return null;
  return gs as ResolvedStatus;
});

const confirmedNames = computed((): string[] => {
  if (localStatus.value === "partial") return localConfirmedNames.value;
  if (!guestData.value || guestData.value.group_status !== "partial") return [];
  return [
    { full_name: guestData.value.full_name, status: guestData.value.status },
    ...guestData.value.companions,
  ]
    .filter((m) => m.status === "confirmed")
    .map((m) => m.full_name);
});

const declinedNames = computed((): string[] => {
  if (localStatus.value === "partial") return localDeclinedNames.value;
  if (!guestData.value || guestData.value.group_status !== "partial") return [];
  return [
    { full_name: guestData.value.full_name, status: guestData.value.status },
    ...guestData.value.companions,
  ]
    .filter((m) => m.status === "declined")
    .map((m) => m.full_name);
});

const enterPartialSelection = () => {
  declinedCompanionIds.value = new Set();
  showPartialSelection.value = true;
};

const cancelPartialSelection = () => {
  showPartialSelection.value = false;
  declinedCompanionIds.value = new Set();
};

const toggleCompanion = (id: number, isChecked: boolean | "indeterminate") => {
  const next = new Set(declinedCompanionIds.value);
  if (isChecked) {
    next.delete(id);
  } else {
    next.add(id);
  }
  declinedCompanionIds.value = next;
};

const submitRsvp = async (status: "confirmed" | "declined") => {
  submitting.value = true;
  pendingAction.value = status;

  try {
    const response = await fetch(`/api/v1/rsvp/${token.value}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast({
        title: data.error || "Erro ao registrar resposta.",
        variant: "destructive",
      });
      return;
    }

    localStatus.value = status;

    if (status === "confirmed") {
      toast({
        title: "Presença confirmada! 🎉",
        description: "Estamos ansiosos para celebrar com vocês!",
      });
    } else {
      toast({
        title: "Resposta registrada.",
        description: "Obrigado por nos avisar.",
      });
    }
  } catch {
    toast({
      title: "Erro de conexão. Tente novamente.",
      variant: "destructive",
    });
  } finally {
    submitting.value = false;
    pendingAction.value = null;
  }
};

const submitPartial = async () => {
  if (!guestData.value) return;

  submitting.value = true;

  const declined = Array.from(declinedCompanionIds.value);
  const allCompanions = guestData.value.companions;

  try {
    const response = await fetch(`/api/v1/rsvp/${token.value}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "partial",
        declined_companion_ids: declined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast({
        title: data.error || "Erro ao registrar resposta.",
        variant: "destructive",
      });
      return;
    }

    localConfirmedNames.value = [
      guestData.value.full_name,
      ...allCompanions
        .filter((c) => !declinedCompanionIds.value.has(c.id))
        .map((c) => c.full_name),
    ];
    localDeclinedNames.value = allCompanions
      .filter((c) => declinedCompanionIds.value.has(c.id))
      .map((c) => c.full_name);

    localStatus.value = "partial";
    showPartialSelection.value = false;

    toast({
      title: "Confirmação registrada! 🎉",
      description: "Ficamos felizes com quem poderá comparecer.",
    });
  } catch {
    toast({
      title: "Erro de conexão. Tente novamente.",
      variant: "destructive",
    });
  } finally {
    submitting.value = false;
  }
};
</script>
