<template>
    <div class="h-screen w-full flex align-items-center justify-content-center my-5">
        <Card style="overflow: hidden">
            <template #title>Edit Profile</template>
            <!-- <template #subtitle>Card subtitle</template> -->
            <template #content>
                <Fieldset legend="Basic informations">
                    <div class="w-full flex align-items-center justify-content-center gap-3">
                        <div class="flex flex-column gap-2">
                            <label for="username">Username</label>
                            <InputText id='username' placeholder="Enter your username" type="text" v-model="updateObject.userName" />
                        </div>

                        <div class="flex flex-column gap-2">
                            <label for="email">Email</label>
                            <InputText id="email" placeholder="Enter your email" type="text" v-model="updateObject.email" />
                        </div>


                    </div>
                    <Divider/>
                    <div class="w-full flex align-items-center justify-content-center gap-3">
                        <div class="flex flex-column gap-2">
                            <label for="password">Old password</label>
                            <Password id="password" v-model="updateObject.oldpassword" placeholder="Enter your old password" />
                            
                        </div>
    
                        <div class="flex flex-column gap-2">
                            <label for="password">New password</label>
                            <Password id="password" v-model="updateObject.newpassword" placeholder="Enter your new password" />

                        </div>
                    </div>
                </Fieldset>
                <Fieldset legend="Artist informations" class="mt-3">
                    <div class="w-full flex align-items-center justify-content-center gap-3">
                        <div class="flex flex-column gap-2">
                            <label for="username">Artist name</label>
                            <InputText id='username' placeholder="Enter your username" type="text" v-model="updateObject.artistName" />
                        </div>

                        <div class="flex flex-column gap-2">
                            <label for="email">Location</label>
                            <InputText id="email" placeholder="Enter your email" type="text" v-model="updateObject.location" />
                        </div>
                    </div>
                    <div class="w-full flex align-items-center justify-content-center gap-3 mt-3">
                        <div class="flex flex-column gap-2 w-full">
                            <label for="username">Description</label>
                            <InputText id='username' placeholder="Enter your username" type="text" v-model="updateObject.description" />
                        </div>
                    </div>
                    <div class="w-full flex align-items-center justify-content-center gap-3 mt-3 w-full">
                        <div class="flex flex-column gap-2">
                            <label for="username">Type</label>
                            <Dropdown v-model="updateObject.type" :options="types" :class="classObject.typeClass" 
                                optionLabel="TypeDescription" optionValue="TypeId" />
                        </div>

                        <div class="flex flex-column gap-2">
                            <label for="email">Genre</label>
                            <MultiSelect v-model="updateObject.genre" :options="genres" option-label="GenreName" option-value="GenreId" />
                        </div>
                    </div>
                    <Divider/>
                    UPLOAD IMAGE
                </Fieldset>
            </template>
            <template #footer>
                <div class="flex gap-3 mt-1">
                    <Button label="Save" @click="" class="w-full" />
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { useAuthenticationStore } from '../stores/auth_store';
import {  useArtistStore } from '../stores/artist_store';
import { onMounted, ref } from 'vue';

const genres = ref();
const types = ref();
onMounted(async () => {
    types.value = await artistStore.getTypes();
    genres.value = await artistStore.getGenres();
});

const updateObject = ref({})

const authStore = useAuthenticationStore().userData;
const artistStore = useArtistStore();
const artistObject = ref({})
 artistStore.getArtistData(authStore.UserId).then(async response =>{
    artistObject.value = response;
    const type = await getTypeIdByDescription(artistObject.value.Type)
    const genres = await getGenreIdsByNames(artistObject.value.Genres)
    updateObject.value = {
        userName : authStore.LoginName,
        email : authStore.Email,
        oldpassword: "",
        newpassword: "",
        artistName: artistObject.value.Name,
        location: artistObject.value.Location,
        description: artistObject.value.Description,
        type: type,
        genre: genres,    
    }
 })

 const classObject = ref({
    nameClass: "",
    descriptionClass: "",
    priceClass: "",
    genreClass: "",
    locationClass: "",
    typeClass: ""
})

async function getTypeIdByDescription(description: string): Promise<number | undefined> {  
    const typeObject = await artistStore.getTypes()
    const retType = typeObject.find(type => type.TypeDescription === description)
    return retType ? retType.TypeId : undefined;
}

async function getGenreIdsByNames(names: string[]): Promise<number[]> {
    const genres = await artistStore.getGenres()
    const genreMap = new Map(genres.map(genre => [genre.GenreName, genre.GenreId]));
    return names.map(name => genreMap.get(name)).filter((id): id is number => id !== undefined);
}
</script>