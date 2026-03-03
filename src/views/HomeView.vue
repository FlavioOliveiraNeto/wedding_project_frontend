<template>
  <div class="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <OurStorySection />
    <!--<PhotoGallerySection />-->
    <RSVPSection />
    <GiftRegistrySection />
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/NavBar.vue";
import HeroSection from "@/components/HeroSection.vue";
import OurStorySection from "@/components/OurStorySection.vue";
//import PhotoGallerySection from "@/components/PhotoGallerySection.vue";
import RSVPSection from "@/components/RSVPSection.vue";
import GiftRegistrySection from "@/components/GiftRegistrySection.vue";
import FooterSection from "@/components/FooterSection.vue";
</script>
