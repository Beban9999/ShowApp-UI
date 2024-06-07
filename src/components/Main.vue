<script setup lang="ts">
import { ref } from 'vue';
import { usePostsStore } from '../stores/posts_store';
import router from '../router.ts'

const postsStore = usePostsStore();
const posts = ref([])
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
postsStore.getAllPosts().then(result => {
    console.log(result)
    posts.value = result;
    for(var i = 0; i < 5; i++){
        posts.value.push(...result)
    }
})

function navigateToRoute(props : any){
    router.push({ name: 'Profile', params: { id: props.Id } });
}

</script>
<template>
    <DataView :value="posts" :sortOrder="sortOrder" :sortField="sortField" :layout="layout" dataKey="id">
        <template #header>
            <div class="flex justify-content-center gap-3">
                <Calendar v-model="icondisplay" showIcon iconDisplay="input" />
                <InputText type="text" v-model="value" />
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Type"
                    @change="onSortChange($event)" />
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Genre"
                    @change="onSortChange($event)" />
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By Price"
                    @change="onSortChange($event)" />
            </div>
        </template>

        <template #grid="slotProps">
            <!-- <div class="col-12  lg:col-12 xl:col-3 p-2" @click="console.log(slotProps);navigateToRoute(slotProps.key)">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12"> -->
            <div class="grid grid-nogutter align-items-center justify-content-center" style="background-color:#111827">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 sm:col-4 md:col-3 xl:col-2 p-2">
                    <div class="p-4 border-1 surface-border surface-card border-round" @click="console.log(item);navigateToRoute(item)">
                        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                            <div class="flex align-items-center gap-2">
                                <i class="pi pi-tag"></i>
                                <span class="font-semibold">{{ item.Type }}</span>
                            </div>
                            <Tag :value="item.inventoryStatus">Rock</Tag>
                        </div>
                        <div class="flex flex-column align-items-center gap-3 py-5">
                            <img :src="item.Medias[0].FileType !== 'video/mp4' ? `../../media/${item.Medias[0].PostId}/${item.Medias[0].FileName}` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'"
                                class="shadow-2 border-round w-full h-12rem"/>


                            <!-- <Galleria v-if="item.Medias && item.Medias.length > 0 " :value="item.Medias" :numVisible="5" :show-indicators-on-item=true
                                containerStyle="max-width: 640px" :showThumbnails="false" :showIndicators="true">
                                <template #item="slotProps">
                                    <img 
                                    :src="slotProps.item.FileType !== 'video/mp4' ? `../../media/${slotProps.item.PostId}/${slotProps.item.FileName}` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'"
                                        class="shadow-2 border-round" style="height: 33.3vh; width: 14vw;" />

                                    
                                </template>
                            </Galleria>
                            <Galleria v-else
                                :value="['https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png']"
                                :numVisible="5" containerStyle="max-width: 640px" :showThumbnails="false"
                                :showIndicators="false">
                                <template #item="slotProps">
                                    <img class="shadow-2 border-round" style="height: 33.3vh; width: 14vw;"
                                        :src="slotProps.item" />
                                </template>
                            </Galleria> -->
    
                            <div class="text-2xl font-bold">{{ item.Title }}</div>
                            <div class="text-lg font-medium text-900 mt-1">{{ item.Description }}</div>
                        </div>
                        <div class="flex align-items-center justify-content-between">
                            <span class="text-2xl font-semibold">${{ item.Price }}</span>
                        </div>
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

