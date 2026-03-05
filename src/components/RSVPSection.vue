<template>
  <!-- CONFIRMATION SCREEN -->
  <section v-if="submitted" id="presenca" class="py-20 md:py-32 bg-card">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-md mx-auto animate-fade-in-up">
        <div
          class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <Check class="w-8 h-8 text-primary" />
        </div>

        <h2 class="font-heading text-3xl text-foreground italic mb-4">
          Presença Confirmada!
        </h2>

        <p class="text-muted-foreground font-body">
          Obrigado, {{ formData.name }}! Estamos muito felizes que você estará
          conosco nesse dia tão especial.
        </p>
      </div>
    </div>
  </section>

  <!-- FORM -->
  <section v-else id="presenca" class="py-20 md:py-32 bg-card">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <!--<p
          class="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body mb-3"
        >
          Confirme sua presença
        </p>-->

        <h2 class="font-heading text-4xl md:text-5xl text-foreground italic">
          Lista de Presença
        </h2>

        <div class="divider-ornament max-w-xs mx-auto mt-6">
          <span class="text-accent text-lg">♥</span>
        </div>
      </div>

      <div class="text-center">
        <p
          class="text-sm tracking-[0.3em] uppercase text-muted-foreground font-body mb-3 mx-[8rem]"
        >
          Será enviado um link para o Whatsapp para que você possa confirmar sua
          presença. Se você não recebeu, nos avise! Confirme até dia 31 de Março. Sua presença é muito importante para nós!
        </p>
      </div>

      <!--<form @submit="handleSubmit" class="max-w-md mx-auto space-y-5">
        <div class="space-y-2">
          <Label for="name" class="font-body text-sm tracking-wide">
            Nome completo *
          </Label>
          <Input
            id="name"
            v-model="formData.name"
            placeholder="Seu nome completo"
            class="bg-background"
          />
        </div>

        <div class="space-y-2">
          <Label for="guests" class="font-body text-sm tracking-wide">
            Número de acompanhantes *
          </Label>
          <Input
            id="guests"
            type="number"
            min="0"
            max="10"
            :value="formData.guests"
            @input="handleGuestsChange(($event.target as HTMLInputElement).value)"
            class="bg-background"
          />
        </div>
        <div
          v-for="(name, index) in guestNames"
          :key="index"
          class="space-y-2 animate-fade-in-up"
        >
          <Label
            :for="`guest-${index}`"
            class="font-body text-sm tracking-wide"
          >
            Nome do acompanhante {{ index + 1 }} *
          </Label>

          <Input
            :id="`guest-${index}`"
            :value="name"
            @input="handleGuestNameChange(index, ($event.target as HTMLInputElement).value)"
            :placeholder="`Nome completo do acompanhante ${index + 1}`"
            class="bg-background"
          />
        </div>
        <div class="space-y-2">
          <Label for="message" class="font-body text-sm tracking-wide">
            Mensagem para o casal
          </Label>

          <textarea
            id="message"
            v-model="formData.message"
            rows="3"
            placeholder="Deixe uma mensagem carinhosa... (opcional)"
            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-body"
          />
        </div>

        <Button
          type="submit"
          :disabled="loading"
          class="w-full font-body tracking-widest uppercase text-sm py-6"
        >
          {{ loading ? 'Enviando...' : 'Confirmar Presença' }}
        </Button>
      </form>-->
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/composables/useToast";
import { Check } from "lucide-vue-next";

const { toast } = useToast();

const submitted = ref(false);
const loading = ref(false);

const formData = reactive({
  name: "",
  guests: "0",
  message: "",
});

const guestNames = ref<string[]>([]);

const handleGuestsChange = (value: string) => {
  const num = Math.max(0, Math.min(10, parseInt(value) || 0));
  formData.guests = String(num);

  const updated = [...guestNames.value];
  while (updated.length < num) updated.push("");
  guestNames.value = updated.slice(0, num);
};

const handleGuestNameChange = (index: number, value: string) => {
  const updated = [...guestNames.value];
  updated[index] = value;
  guestNames.value = updated;
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    toast({
      title: "Por favor, preencha seu nome completo.",
      variant: "destructive",
    });
    return;
  }

  const companionsCount = parseInt(formData.guests) || 0;

  if (companionsCount > 0) {
    const hasEmptyName = guestNames.value.some((n) => !n.trim());
    if (hasEmptyName) {
      toast({
        title: "Preencha o nome completo de todos os acompanhantes.",
        variant: "destructive",
      });
      return;
    }
  }

  loading.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rsvp: {
          full_name: formData.name.trim(),
          companions_count: companionsCount,
          companion_names: guestNames.value.map((n) => n.trim()),
          message: formData.message.trim() || null,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast({
        title: data.error || "Erro ao confirmar presença.",
        variant: "destructive",
      });
      return;
    }

    submitted.value = true;
    toast({
      title: "Presença confirmada! 🎉",
      description:
        "Obrigado por confirmar, estamos ansiosos para celebrar com você!",
    });
  } catch {
    toast({
      title: "Erro de conexão. Tente novamente.",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};
</script>
