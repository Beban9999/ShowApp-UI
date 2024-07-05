<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Ref, onMounted, ref } from 'vue';
import { useArtistStore } from '../stores/artist_store';
import { Artist } from '../models/artist/Artist';
import router from '../router';
import { useAuthenticationStore } from '../stores/auth_store';
import Swal from 'sweetalert2';
import { useAlert } from '../composables/useAlert';
import Calendar from '../components/Calendar.vue'
import EditCalendar from './EditCalendar.vue';
const { showConfirmationPopup } = useAlert();

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
const username = authStore.userData.LoginName;
var disabledDays: any[] = [];

const imgData = ref([])

onMounted(async () => {
    try {
      artistObject.value = await artistStore.getArtistData(id.value);
      console.log(artistObject.value)
      const imageDetails = [];
      disabledDays = artistObject.value.Dates;

      // Traverse the data to find the UserId and FileName
      [artistObject.value].forEach(user => {
          if (user.Posts) {
              user.Posts.forEach(post => {
                  if (post.Media) {
                      post.Media.forEach(media => {
                          if(media.FileType.startsWith('image')){
                            imageDetails.push({
                                UserId: media.UserId,
                                FileName: media.FileName
                            });
                        }
                      });
                  }
              });
          }
      });

      // Log the extracted image details to the console
      console.log(imageDetails);
      imgData.value = imageDetails
    } catch (error) {
        console.error('Failed to fetch artist data:', error);
    }
});

function addPost() {
  router.push({ name: 'AddPost'});
}

const removePost = async (postId: number) => {
  const result = await showConfirmationPopup('Do you want to delete this post?');

  if (result.isConfirmed) {
    try {
      const resp = await artistStore.removePost(postId);
      if (resp) {
        window.location.reload();
        Swal.fire('Deleted!', 'The post has been deleted.', 'success');
      } else {
        Swal.fire('Error!', 'There was an error deleting the post.', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'There was an error deleting the post.', 'error');
    }
  }
};

function chat(receiverId: number){
    router.push({ name: 'Chat', params: { receiverId: receiverId }});
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
          <Button v-if="artistObject?.UserId!==userId" @click="chat(artistObject?.UserId)" class="pi pi-comments"></Button>
        </div>
      </div>
      <Calendar v-if="artistObject?.UserId!=userId" :disabledDays="disabledDays"/>
      <EditCalendar v-if="artistObject?.UserId==userId" :disabledDays="disabledDays" />
    </div>
    <div class="w-full h-2rem flex justify-content-start gap-2" >
      <Tag :class="$style.tag"><span>{{ artistObject?.Location }}</span></Tag>
      <div v-for="genre in artistObject?.Genres" :key="genre">
        <Tag :value="genre">{{ genre }}</Tag>
      </div>
    </div>

    <Divider />

    <div class="w-full flex">
      <div class="card-div mr-3 p-3" style="min-width: 520px; max-width: 520px; min-height: 520px; max-height: 520px">
        <b class="m">Gallery</b>
        <div >
          <Image :class="$style.img" v-for="(media, index) in imgData.slice(0,4) " :src="`../../media/${media.UserId}/${media.FileName}`"  alt="Image" width="210" height="210" preview />
        </div>
      </div>
      <div class="w-9 card-div p-3">
        <b>Posts</b>
        <div>
          <div v-for="post in artistObject?.Posts" class="card-div px-3 mb-2 pb-3" style="min-width: 520px;">
            <div class="flex w-full align-items-start">
                <p class="w-full">Post title</p>
                <div class="w-full flex justify-content-end">
                  <p style="position:relative; ">{{ post.CreatedDate }}</p>
                  <a v-if="username=='admin' || userId==post.UserId" @click="removePost(post.Id)" class="pi pi-trash m-3"></a>

                </div>   
            </div>
           <span> {{ post.Description }}</span> 
           <br>
            <div v-for="media in post.Media">
              <template v-if="media.FileType.startsWith('image')">
                <Image :class="$style.img" :src="`../../media/${media.UserId}/${media.FileName}`" alt="Image" width="210" height="210" preview />
              </template>
              <template v-else-if="media.FileType.startsWith('video')">
                <video :class="$style.video" width="320" height="240" controls>
                  <source :src="`../../media/${media.UserId}/${media.FileName}`" :type="media.FileType">
                  Your browser does not support the video tag.
                </video>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
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