<template>
  <div class="container" v-if="artistObject">
    <h2>Name: <span>{{ artistObject?.Name }}</span></h2>
    <p>Type: <span>{{ artistObject?.Type }}</span></p>
    <p>Genre: <span>{{ artistObject?.Genre }}</span></p>
    <p>Description: <span>{{ artistObject?.Description }}</span></p>
    <p>Location: <span>{{ artistObject?.Location }}</span></p>
    <div class="post-media">
      <h3>Post Medias:</h3>
      <div id="post-medias">
        <img v-for="(media, index) in artistObject?.PostMedias" :key="index" :src="`../../media/${media.PostId}/${media.FileName}`" :alt="media.FileName" />
      </div>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { service_get } from '../services/service_call';
import { CallType } from '../models/enums/CallType';

interface PostMedia {
  PostId: number;
  FileName: string;
  FileType: string;
}

interface Artist {
  Name: string;
  Type: string;
  Genre: string;
  Description: string;
  Location: string;
  PostMedias: PostMedia[];
}

const id = ref();
const route = useRoute();
const artistObject = ref<Artist | null>(null);

id.value = route.params.id;

service_get(CallType.ArtistData, { ArtistId: id.value }).then(response => {
  artistObject.value = JSON.parse(response.data);
})
</script>

<style scoped></style>
