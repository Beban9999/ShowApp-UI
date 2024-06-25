<script setup lang="ts">
import { ref } from 'vue';
import router from '../router.ts'
import { useArtistStore } from '../stores/artist_store.ts';
import { useAuthenticationStore } from '../stores/auth_store.ts';

const authStore = useAuthenticationStore();
const artistStore = useArtistStore();
const userId = authStore.userData.UserId;
const isArtist = authStore.userData.IsArtist;
const artists = ref([]);
const layout = ref<"grid" | "list" | undefined>("grid");
const sortKey = ref()
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' },
]);

const onSortChange = (event: { value: { value: any; }; }) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    }
    else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};

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

</script>
<template>
    <DataView :value="artists" :sortOrder="sortOrder" :sortField="sortField" :layout="layout" dataKey="id" class="h-screen">
        <template #header>
            <div class="flex justify-content-center gap-3">
                <!-- <Calendar v-model="icondisplay" showIcon iconDisplay="input" /> -->
                <InputText type="text" v-model="value" placeholder="Search by name" />
                <Dropdown v-model="sortKey" class="text-sm" :options="sortOptions" optionLabel="label" placeholder="Type"
                    @change="onSortChange($event)" />
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Genre"
                    @change="onSortChange($event)" />
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By Price"
                    @change="onSortChange($event)" />
                    <Button>Apply filters</Button>
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
                        <Button v-if="!isArtist" @click="chat(item.UserId)" class="pi pi-comments"></Button>
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

