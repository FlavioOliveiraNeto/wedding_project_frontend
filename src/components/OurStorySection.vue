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
      <div class="mx-auto relative">
        <!-- Vertical line -->
        <div
          class="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px"
        />

        <div
          v-for="(item, i) in timeline"
          :key="item.year + item.title"
          :class="[
            'relative flex flex-col md:items-center mb-16 last:mb-0',
            i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
          ]"
        >
          <!-- Dot -->
          <div
            class="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-background z-10 mt-2 md:mt-0"
          />

          <!-- Text content -->
          <div
            :class="[
              'ml-14 md:ml-0 md:w-1/2',
              i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16',
            ]"
          >
            <span class="text-accent font-heading text-3xl">
              {{ item.year }}
            </span>

            <h3 class="font-heading text-xl text-foreground mt-1 mb-2">
              {{ item.title }}
            </h3>

            <p
              class="text-muted-foreground font-body text-lg leading-relaxed"
              v-html="item.description"
            ></p>
          </div>

          <!-- Photo -->
          <div
            :class="[
              'ml-14 mt-6 md:ml-0 md:mt-0 md:w-1/2',
              i % 2 === 0 ? 'md:pl-16' : 'md:pr-16',
            ]"
          >
            <img
              v-if="item.photo"
              :src="item.photo"
              :alt="item.title"
              class="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
            />
            <div
              v-else
              class="w-full h-64 md:h-80 rounded-lg border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2"
            >
              <Heart class="w-8 h-8 text-muted-foreground/40" />
              <span class="text-xs text-muted-foreground/40 font-body">foto do casal</span>
            </div>
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
  photo?: string;
}

const timeline: TimelineItem[] = [
  {
    year: "2022",
    title: "Como nos conhecemos:",
    description:
      "Nossa história não começa em um café romântico, na verdade, em 2022 o Tinder foi nosso cupido. Demos coraçãozinhos um para o outro, e assim um Match. Gabriella diz que deu coraçãozinho porque gostou da última foto do Flávio com um cachorrinho e na bio estava escrito que gostava de pagode, já o Flavio diz que deu coraçãozinho porque apesar de fazer \"carão\" nas fotos, parecia ser gente boa, era bonita e na bio falava que gostava de pagode também. Começamos a conversar, mas perdemos o assunto depois de um tempo.",
    photo: "/images/historia/tinder.jpg",
  },
  {
    year: "2022",
    title: "Primeiro encontro:",
    description:
      "Ainda naquele mesmo ano, no dia 1 de março, depois de exatamente um mês sem se falar, Flávio mandou mensagem chamando Gabriella para sair. Era 19:00 da noite, Gabriella achou que o convite era para outro dia, mas a intenção do Flávio era sair às 20:00. Gabriella ficou receosa, mas topou sair. O encontro foi muito engraçado, Flavio esqueceu o nome da Gabriella <strong>(nota do administrador: me envergonho profundamente!)</strong>, tirou o picles do sanduiche dela com a mão suja <strong>(nota 2 do administrador: não estava suja.)</strong> e conversaram sobre várias coisas sem nem observar que o tempo passou. No final do encontro, se despediram e para Gabriella ficou a impressão que o Flávio não tinha gostado, mas logo em seguida ele mandou mensagem agradecendo pelo encontro e querendo marcar outras vezes.",
    photo: "/images/historia/primeiro-encontro.jpg",
  },
  {
    year: "2022",
    title: "Pedido de namoro:",
    description:
      "Começamos a nos encontrar toda vez que o Flávio tinha aula em Goiânia. Saímos 3 vezes e não teve nenhum beijo, mas teve muita risada e conexão <strong>(nota da administradora: reclamo muito da falta de beijo e o Flávio diz para não discutir os métodos dele, e sim os resultados)</strong>. Saímos por 4 meses, e sempre era muito divertido. Quando Junho chegou, Flávio começou a perguntar onde iriam no dia dos namorados, e Gabriella sempre respondia que em lugar nenhum, pois ninguém havia pedido em namoro. No dia 3 de Junho, Flávio chamou Gabriella para jantar e a buscou na faculdade. Enquanto Flávio cozinhava, Gabriella foi ao banheiro e ao voltar, Flávio estava com a caixinha do anel, pedindo em namoro. Foi fofo!!",
    photo: "/images/historia/namoro.jpg",
  },
  {
    year: "2025",
    title: "Pedido de casamento:",
    description:
      "Depois de 3 anos e 5 meses de namoro, fizemos uma viagem para a Europa, muito especial em família. No dia 9 de Novembro, em um parque lindo de Londres, Flávio se ajoelhou e pediu Gabriella em casamento, muito nervoso com a caixinha de cabeça para baixo <strong>(nota do administrador: caixa com Design diferente que me levou ao erro kkkkkk)</strong>, o que virou risos seguinte do SIM!",
    photo: "/images/historia/noivado.jpg",
  },
  {
    year: "2026",
    title: "O Grande Dia",
    description:
      "Não teremos uma cerimônia de casamento, mas organizamos um chá de panela para que todos que amamos possam comemorar e celebrar com a gente! Contamos com sua presença no dia em que comemoraremos nossa união e companheirismo!",
    photo: "/images/historia/grande-dia.jpg",
  },
];
</script>
