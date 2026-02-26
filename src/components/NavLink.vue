<template>
  <RouterLink
    :to="to"
    custom
    v-slot="{ href, navigate, isActive, isExactActive }"
  >
    <a
      :href="href"
      @click="navigate"
      :class="cn(
        class,
        (isActive || isExactActive) && activeClassName
      )"
    >
      <slot />
    </a>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useLink } from "vue-router";
import { cn } from "@/lib/utils";

interface Props {
  to: string;
  class?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const props = defineProps<Props>();

// useLink fornece estado equivalente ao isActive/isPending do React Router
const link = useLink({
  to: props.to,
});

const classes = computed(() =>
  cn(
    props.class,
    link.isActive.value && props.activeClassName,
    link.isExactActive.value && props.activeClassName,
  ),
);
</script>
