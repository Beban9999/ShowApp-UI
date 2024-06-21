<script setup lang="ts">
import { onMounted, ref } from 'vue';
import router from "../router";
import { useArtistStore } from '../stores/artist_store';

const artistStore = useArtistStore();
const genres = ref();
const types = ref();
onMounted(async () => {
    types.value = await artistStore.getTypes();
    genres.value = await artistStore.getGenres();
});

const fileUploadRef = ref({
    upload() { }, //just for typescript
    files: []
});
const artistObject = ref({
    name: "",
    price: 0,
    description: "",
    genre: [],
    location: "",
    type: 0
})
const classObject = ref({
    nameClass: "",
    descriptionClass: "",
    priceClass: "",
    genreClass: "",
    locationClass: "",
    typeClass: ""
})
const errorObject = ref({
    message : "",
    visibility: "p-error"
})


function submit() {

    console.log(artistObject.value)
    if(artistObject.value.name.trim() === ""){
        classObject.value.nameClass = 'p-invalid'
        errorObject.value.message = "Artist name is required"

        return;
    }
    if(artistObject.value.price === 0){
        classObject.value.priceClass = 'p-invalid'
        errorObject.value.message = "Price can't be 0"

        return;
    }
    if(artistObject.value.description.trim() === ""){
        classObject.value.descriptionClass = 'p-invalid'
        errorObject.value.message = "Description is required"

        return;
    }
    if(artistObject.value.location.trim() === ""){
        classObject.value.locationClass = 'p-invalid'
        errorObject.value.message = "Location is required"

        return;
    }
    if(artistObject.value.genre.length == 0){
        classObject.value.genreClass = 'p-invalid'
        errorObject.value.message = "Music genre is required"

        return;
    }
    if(artistObject.value.type === 0){
        classObject.value.typeClass = 'p-invalid'
        errorObject.value.message = "Type is required"

        return;
    }

    artistStore.becomeArtist(artistObject.value.name, artistObject.value.description, artistObject.value.price, artistObject.value.type, artistObject.value.location, artistObject.value.genre, fileUploadRef.value.files).then((response) => {
        if(response) {
            router.push({ path: '/home'});
        }
    });
}
</script>

<template>
    <div class="w-full">
        <Card class="w-7 mx-auto mt-5">
            <template #title>
                <div class="flex flex-column card-container green-container gap-3 align-items-center">
                    Become an artist
                </div>
            </template>
            <template #content>
                <div class="grid m-5">
                    <div class="col-6">
                        <div class="flex flex-column gap-2">
                            <label for="name">Artist Name</label>
                            <InputText id="name" v-model="artistObject.name" :class="classObject.nameClass" @input="()=>{classObject.nameClass = ''; errorObject.message = ''}"/>

                        </div>
                    </div>

                    <div class="col-6">
                        <div class="flex flex-column gap-2">
                            <label for="price">Price</label>
                            <InputNumber v-model="artistObject.price" inputId="currency-us" mode="currency" currency="USD" :class="classObject.priceClass" 
                                locale="en-US" @input="()=>{classObject.priceClass = ''; errorObject.message = ''}"/>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="flex flex-column gap-2">
                            <label for="price">Description</label>
                            <Textarea v-model="artistObject.description" rows="5" cols="30" :class="classObject.descriptionClass" @input="()=>{classObject.descriptionClass = ''; errorObject.message = ''}"/>

                        </div>
                    </div>

                    <div class="col-6">
                    <div class="flex flex-column gap-2">
                        <label for="genres">Music genre</label>
                        <MultiSelect v-model="artistObject.genre" :options="genres" option-label="GenreName" option-value="GenreId" />
                    </div>
                    </div>

                    <div class="col-6">
                        <div class="flex flex-column gap-2">
                            <label for="type">Type</label>
                            <Dropdown v-model="artistObject.type" :options="types" :class="classObject.typeClass" 
                                optionLabel="TypeDescription" optionValue="TypeId" placeholder="Select a type" @change="()=>{classObject.typeClass = ''; errorObject.message = ''}"/>
                        </div>
                    </div>

                    <div class="col-6">
                        <div class="flex flex-column gap-2">
                            <label for="price">Location</label>
                            <Textarea v-model="artistObject.location" rows="5" cols="30" :class="classObject.locationClass" @input="()=>{classObject.locationClass = ''; errorObject.message = ''}"/>

                        </div>
                    </div>

                    <div class="col-12">
                        
                        <div class="flex flex-column gap-2">
                            <div>
                                <FileUpload name="images" accept="image/*,video/mp4" ref="fileUploadRef" :maxFileSize="100000000"
                                    :multiple=false :showUploadButton="false"/>
                                    <small id="text-error" :class="errorObject.visibility">{{ errorObject.message || '&nbsp;' }}</small>
                            </div>
                            <div class="mx-auto mt-6">
                                <Button @click="submit">Finish</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>