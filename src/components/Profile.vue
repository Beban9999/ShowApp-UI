<template>
  <div class="m-2">
    <!-- Should be changed to image (cover) -->
    <div class="w-40rem cover-img mb-2 flex justify-content-center" style="overflow: hidden">
      <Image :class="$style.cover_img" width="2200" :src="'../../media/' + artistObject?.PostMedias[0].PostId+'/'+artistObject?.PostMedias[0].FileName"></Image>
    </div>
    <!-- <div style="">
    </div> -->
    <div class="flex ml-5 min-w-min">
      <Image width="120" :src="'../../media/' + artistObject?.PostMedias[0].PostId+'/'+artistObject?.PostMedias[0].FileName"></Image>
      <div class="mx-5">
        <h2 style="white-space: nowrap;">{{ artistObject?.Name }}</h2>
        <p><span>{{ artistObject?.Type }}</span></p>
        <p><span>{{ artistObject?.Description }}</span></p>
      </div>

      <div class="w-full justify-content-end flex" >
        <div>
          <Button :class="$style.button"><b>Follow</b></Button>
          <Button  class="ml-2" :class="$style.button"><b>Message</b></Button>
        </div>
      </div>
      
    </div>
    <div class="w-full h-2rem flex justify-content-start gap-2" >
      <Tag :class="$style.tag"><span>{{ artistObject?.Genre }}</span></Tag>
      <Tag :class="$style.tag"><span>{{ artistObject?.Location }}</span></Tag>
    </div>

    <Divider />

    <div class="w-full flex min-h-max">
      <div class="w-5 card-div mr-3 p-3 min-w-max">
        <b class="m">Gallery</b>
        <div >
          <Image :class="$style.img" v-for="(media, index) in artistObject?.PostMedias" :src="`../../media/${media.PostId}/${media.FileName}`"  alt="Image" width="210" height="210" preview />
        </div>
        <!-- TEST FOR MORE IMAGES, not needed in the future. -->
        <div >
          <Image :class="$style.img" v-for="(media, index) in artistObject?.PostMedias" :src="`../../media/${media.PostId}/${media.FileName}`"  alt="Image" width="210" height="210" preview />
        </div>
      </div>
      <div class="w-9 card-div p-3">
        <b>Posts</b>
      </div>
    </div>
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
const artistObject = ref<Artist | null>(null);


id.value = route.params.id;

service_get(CallType.ArtistData, { ArtistId: id.value }).then(response => {
  artistObject.value = JSON.parse(response.data);
  console.log(artistObject.value?.PostMedias)
})
</script>

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