<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Ref, onMounted, ref } from 'vue';
import { useArtistStore } from '../stores/artist_store';
import { Artist } from '../models/artist/Artist';
import router from '../router';
import { useAuthenticationStore } from '../stores/auth_store';

const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);
const id = ref();
const route = useRoute();
const artistObject: Ref<Artist | null> = ref(null);
const artistStore = useArtistStore();
const authStore = useAuthenticationStore();
id.value = route.params.id;
const userId = authStore.userData.UserId;

onMounted(async () => {
    try {
      artistObject.value = await artistStore.getArtistData(id.value);
    } catch (error) {
        console.error('Failed to fetch artist data:', error);
    }
});

function addPost() {
  router.push({ name: 'AddPost'});
}
</script>

<template>
  <div class="m-2">
    <!-- Should be changed to image (cover) -->
    <div class="w-40rem cover-img mb-2 flex justify-content-center" style="overflow: hidden">
      <!-- <Image :class="$style.cover_img" width="2200" :src="'../../media/' + artistObject?.PostMedias[0].PostId+'/'+artistObject?.PostMedias[0].FileName"></Image> -->
    </div>
    <!-- <div style="">
    </div> -->
    <div class="flex ml-5 min-w-min">
      <Image width="120" :src="'../../media/' + artistObject?.UserId + '/' + artistObject?.Avatar"></Image>
      <div class="mx-5">
        <h2 style="white-space: nowrap;">{{ artistObject?.Name }}</h2>
        <p><span>{{ artistObject?.Type }}</span></p>
        <p><span>{{ artistObject?.Description }}</span></p>
      </div>

      <div class="w-full justify-content-end flex" >
        <div>
          <Button v-if="artistObject?.UserId==userId" :class="$style.button" @click="addPost()"><b>Add post</b></Button>
          <Button :class="$style.button"><b>Follow</b></Button>
          <Button  class="ml-2" :class="$style.button"><b>Message</b></Button>
        </div>
      </div>
      
    </div>
    <div class="w-full h-2rem flex justify-content-start gap-2" >
      <Tag :class="$style.tag"><span>{{ artistObject?.Location }}</span></Tag>
      <div v-for="genre in artistObject?.Genres" :key="genre">
        <Tag :value="genre">{{ genre }}</Tag>
      </div>
    </div>

    <Divider />

    
  </div>
</template>


<style scoped>
.cover-img{
  background-color: gray;
  height: 200px;
  border-radius: 10px;
  position: relative;
}
.card-div{
  border-radius: 10px;
  border: 1px solid rgb(78, 77, 77);
}
</style>

<style module>
.button {
    color: white;
    background-color: rgb(78, 77, 77);
    border-color: rgb(78, 77, 77);
    margin-top: 5%;
    border-radius: 40px;

}
.tag {
  color: white;
  background-color: rgb(78, 77, 77);
  border-color: rgb(78, 77, 77);
}
.img{
  margin: 10px;
}
.cover_img{
  position: relative;
}
</style>