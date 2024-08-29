<script setup lang="ts">
import { onMounted, ref } from 'vue';
import router from '../router.ts'
import { useArtistStore } from '../stores/artist_store.ts';
import { useAuthenticationStore } from '../stores/auth_store.ts';
import { useAlert } from '../composables/useAlert';
import Swal from 'sweetalert2';
import EditCalendar from './EditCalendar.vue';
import Calendar from './Calendar.vue';
const { showConfirmationPopup } = useAlert();

const authStore = useAuthenticationStore();
const artistStore = useArtistStore();
const userId = authStore.userData.UserId;
const isArtist = authStore.userData.IsArtist;
const username = authStore.userData.LoginName;
const artists = ref([]);
const filteredArtists = ref([]);
const layout = ref<"grid" | "list" | undefined>("grid");
const sortKey = ref()
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' },
]);
const nameFilter = ref('');
const typeFilter = ref(null);
const genreFilter = ref(null);
const genres = ref();
const types = ref();

onMounted(async () => {
  artists.value = await artistStore.getAllArtists();
  filteredArtists.value = artists.value;

  types.value = await artistStore.getTypes();
  genres.value = await artistStore.getGenres();
});

const applyFilters = () => {
  filteredArtists.value = artists.value.filter(artist => {
    return (
      (!nameFilter.value || artist.Name.toLowerCase().includes(nameFilter.value.toLowerCase())) &&
      (!typeFilter.value || artist.Type === typeFilter.value) &&
      (!genreFilter.value || artist.Genres.includes(genreFilter.value))
    );
  });

  if (sortKey.value) {
    const order = sortKey.value.startsWith('!') ? -1 : 1;
    const field = sortKey.value.replace('!', '');
    filteredArtists.value.sort((a, b) => {
      return (a[field] < b[field] ? -1 : 1) * order;
    });
  }
};

function resetFilters(){
    nameFilter.value = '';
    typeFilter.value = null;
    genreFilter.value = null;
    sortKey.value = null;
    applyFilters();
}

artistStore.getAllArtists().then(result => {
    console.log(result);

    artists.value = result.filter((artist: { UserId: number; }) => artist.UserId !== userId);
    for(var i = 0; i < 5; i++){
        artists.value.push(...result.filter((artist: { UserId: number; }) => artist.UserId !== userId))
    }
})

function goToProfile(id : any){
    router.push({ name: 'Profile', params: { id: id } });
}

function chat(receiverId: number){
    router.push({ name: 'Chat', params: { receiverId: receiverId }});
}

const removeArtist = async (userId: number) => {
  const result = await showConfirmationPopup('Do you want to delete this artist?');

  if (result.isConfirmed) {
    try {
      const resp = await artistStore.removeArtist(userId);
      if (resp) {
        window.location.reload();
        Swal.fire('Deleted!', 'The artist has been deleted.', 'success');
      } else {
        Swal.fire('Error!', 'There was an error deleting the artist.', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'There was an error deleting the artist.', 'error');
    }
  }
};

</script>
<template>
  <DataView :value="filteredArtists" :sortOrder="sortOrder" :sortField="sortField" :layout="layout" dataKey="id" class="h-screen">
    <template #header>
      <div class="flex justify-content-center gap-3">
        <InputText type="text" v-model="nameFilter" placeholder="Search by name" />
        <Dropdown v-model="typeFilter" class="text-sm" :options="types" optionLabel="TypeDescription" optionValue="TypeDescription" placeholder="Type" />
        <Dropdown v-model="genreFilter" :options="genres" optionLabel="GenreName" optionValue="GenreName" placeholder="Genre" />
        <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" optionValue="value" placeholder="Sort By Price" />
        <Button @click="applyFilters" class="pi pi-search"></Button>
        <Button @click="resetFilters" class="pi pi-undo"></Button>
      </div>
    </template>

        <template #grid="slotProps">
            <div class="grid grid-nogutter align-items-center justify-content-center" style="background-color:#111827">
                <div v-for="item in slotProps.items" class="col-12 sm:col-4 md:col-3 xl:col-2 p-2">
                    <div class="p-4 border-1 surface-border surface-card border-round">
                        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-tag"></i>
                                <span class="font-semibold">{{ item.Type }}</span>
                            </div>
                            <div v-for="genre in item.Genres" :key="genre">
                                <Tag :value="genre">{{ genre }}</Tag>
                            </div>
                        </div>
                        <div class="flex flex-column align-items-center gap-3 py-5" @click="console.log(item, slotProps);goToProfile(item.UserId)">
                            <img :src="item.Avatar !== '' ? `../../media/${item.UserId}/${item.Avatar}` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'"

                                class="shadow-2 border-round w-full h-12rem"/>
                            <div class="text-2xl font-bold">{{ item.Name }}</div>
                            <div class="text-lg font-medium text-900 mt-1">{{ item.Description }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-between">
                            <span class="text-2xl font-semibold">${{ item.Price }}</span>
                        </div>
                        <div class="flex gap-2">
                          <Button v-if="!isArtist" @click="chat(item.UserId)" class="pi pi-comments"></Button>
                          <Calendar v-if="userId!=item.UserId" :disabledDays="item.Dates"/>
                          <EditCalendar v-if="userId==item.UserId" :disabledDays="item.Dates" />
                        </div>
                        <a v-if="username=='admin'" @click="removeArtist(item.UserId)" class="pi pi-trash m-3"></a>
                    </div>
                </div>
            </div>
        </template>        
    </DataView>
</template>
<style scoped>
.col-12 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}
</style>
<style module>
.dd{
    font-size: small;
}
</style>

