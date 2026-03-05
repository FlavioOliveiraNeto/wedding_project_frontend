<template>
  <div
    v-if="tracks.length > 0"
    class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50"
  >
    <div
      class="bg-white/95 backdrop-blur-sm border border-border rounded-2xl shadow-xl overflow-hidden"
      style="box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);"
    >
      <!-- Expanded: info da faixa + barra de progresso -->
      <Transition name="slide-down">
        <div v-if="!isMinimized" class="px-4 pt-4 pb-0">
          <div class="flex items-start gap-2 mb-3">
            <div class="min-w-0 flex-1">
              <p class="font-display font-semibold text-foreground truncate leading-tight">
                {{ currentTrack?.title ?? '' }}
              </p>
              <p class="text-xs text-muted-foreground truncate mt-0.5">
                {{ currentTrack?.artist ?? '' }}
              </p>
            </div>
          </div>

          <!-- Barra de progresso -->
          <div
            ref="progressBarRef"
            class="group cursor-pointer"
            @click="handleProgressClick"
          >
            <div class="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                style="background: hsl(38 60% 55%); transition: width 0.1s linear;"
                :style="{ width: `${progress}%` }"
              />
            </div>
          </div>
          <div class="flex justify-between text-xs text-muted-foreground mt-1 mb-3">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>
      </Transition>

      <!-- Playlist expandida -->
      <Transition name="slide-down">
        <div
          v-if="!isMinimized && showPlaylist"
          class="border-t border-border max-h-48 overflow-y-auto px-2 pb-2"
        >
          <button
            v-for="(track, i) in tracks"
            :key="i"
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors hover:bg-muted"
            :class="{ 'bg-muted/50': i === currentIndex }"
            @click="playTrack(i)"
          >
            <div class="w-4 flex-shrink-0 flex items-center justify-center">
              <span v-if="i === currentIndex && isPlaying" class="music-bars">
                <span class="bar bar-1" />
                <span class="bar bar-2" />
                <span class="bar bar-3" />
              </span>
              <Music v-else :size="12" :class="i === currentIndex ? 'text-accent' : 'text-muted-foreground'" />
            </div>
            <div class="min-w-0 flex-1">
              <p
                class="text-xs font-medium truncate"
                :class="i === currentIndex ? 'text-accent' : 'text-foreground'"
              >
                {{ track.title }}
              </p>
              <p class="text-xs text-muted-foreground truncate">{{ track.artist }}</p>
            </div>
          </button>
        </div>
      </Transition>

      <!-- Barra de controles (sempre visível) -->
      <div v-if="isMinimized" class="flex items-center gap-2 px-3 py-2.5">
        <!-- Expand -->
        <button
          class="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          @click="isMinimized = false"
        >
          <ChevronUp :size="14" />
        </button>

        <!-- Info da faixa -->
        <div class="flex-1 min-w-0 flex items-center gap-1.5">
          <Music :size="12" class="text-accent flex-shrink-0" />
          <p class="text-xs text-foreground truncate">
            <span class="font-medium">{{ currentTrack?.title ?? 'Playlist' }}</span>
            <span v-if="currentTrack?.artist" class="text-muted-foreground"> · {{ currentTrack.artist }}</span>
          </p>
        </div>

        <!-- Controles -->
        <button
          class="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          @click="prev"
        >
          <SkipBack :size="15" />
        </button>
        <button
          class="w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95"
          style="background: hsl(142 25% 36%); color: hsl(40 33% 97%);"
          @click="toggle"
        >
          <Pause v-if="isPlaying" :size="15" />
          <Play v-else :size="15" class="ml-0.5" />
        </button>
        <button
          class="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          @click="next"
        >
          <SkipForward :size="15" />
        </button>
      </div>

      <!-- Controles expandidos -->
      <div v-else class="flex items-center gap-1 px-3 py-2.5">
        <!-- Spacer esquerdo -->
        <div class="flex-1" />

        <!-- Controles centralizados -->
        <div class="flex items-center gap-1">
          <button
            class="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            @click="prev"
          >
            <SkipBack :size="16" />
          </button>
          <button
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95 mx-1"
            style="background: hsl(142 25% 36%); color: hsl(40 33% 97%);"
            @click="toggle"
          >
            <Pause v-if="isPlaying" :size="18" />
            <Play v-else :size="18" class="ml-0.5" />
          </button>
          <button
            class="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            @click="next"
          >
            <SkipForward :size="16" />
          </button>
        </div>

        <!-- Controles direita -->
        <div class="flex-1 flex items-center justify-end gap-1">
          <button
            class="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            @click="toggleMute"
          >
            <VolumeX v-if="isMuted || volume === 0" :size="15" />
            <Volume1 v-else-if="volume < 0.5" :size="15" />
            <Volume2 v-else :size="15" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            class="volume-slider"
            style="accent-color: hsl(38 60% 55%);"
            @input="handleVolumeChange"
          />
          <button
            class="p-1.5 transition-colors rounded-lg hover:bg-muted"
            :class="showPlaylist ? 'text-accent' : 'text-muted-foreground hover:text-foreground'"
            @click="showPlaylist = !showPlaylist"
          >
            <ListMusic :size="15" />
          </button>
          <button
            class="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            @click="isMinimized = true"
          >
            <ChevronDown :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Play, Pause, SkipBack, SkipForward,
  Volume1, Volume2, VolumeX, Music,
  ChevronUp, ChevronDown, ListMusic,
} from 'lucide-vue-next'
import { useMusicPlayer } from '@/composables/useMusicPlayer'
import { playlist } from '@/config/playlist'

const {
  tracks, currentIndex, currentTrack, isPlaying,
  volume, currentTime, duration, progress,
  isMuted, isMinimized, showPlaylist,
  setPlaylist, autoplayOnInteraction, toggle, next, prev, seek,
  setVolume, toggleMute, playTrack, formatTime,
} = useMusicPlayer()

const progressBarRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  setPlaylist(playlist, true) // true = embaralhar
  autoplayOnInteraction()
})

function handleProgressClick(event: MouseEvent) {
  if (!progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const percent = ((event.clientX - rect.left) / rect.width) * 100
  seek(Math.max(0, Math.min(100, percent)))
}

function handleVolumeChange(event: Event) {
  setVolume(Number((event.target as HTMLInputElement).value))
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.2s ease, max-height 0.25s ease;
  overflow: hidden;
  max-height: 400px;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.volume-slider {
  width: 56px;
  height: 4px;
  cursor: pointer;
  border-radius: 2px;
}

/* Animação das barrinhas de música na playlist */
.music-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}

.bar {
  display: block;
  width: 2px;
  border-radius: 1px;
  background: hsl(38 60% 55%);
  transform-origin: bottom;
}

.bar-1 { animation: music-bar 0.8s ease-in-out infinite; }
.bar-2 { animation: music-bar 0.8s ease-in-out infinite 0.2s; }
.bar-3 { animation: music-bar 0.8s ease-in-out infinite 0.4s; }

@keyframes music-bar {
  0%, 100% { transform: scaleY(0.3); height: 12px; }
  50%       { transform: scaleY(1);   height: 12px; }
}
</style>
