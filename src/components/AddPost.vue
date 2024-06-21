<script setup lang="ts">
import { onMounted, ref } from 'vue';
import router from "../router";
import { useArtistStore } from '../stores/artist_store';
import { useAuthenticationStore } from '../stores/auth_store';

const artistStore = useArtistStore();
const authStore = useAuthenticationStore();

const fileUploadRef = ref({
    upload() { }, //just for typescript
    files: []
})

const postObject = ref({
    description: ""
})

const classObject = ref({
    descriptionClass: "",
})

const errorObject = ref({
    message : "",
    visibility: "p-error"
})

function submit() {
    if(postObject.value.description.trim() === ""){
        classObject.value.descriptionClass = 'p-invalid'
        errorObject.value.message = "Description is required"

        return;
    }

    artistStore.insertPost(postObject.value.description, fileUploadRef.value.files).then((response) => {
        debugger
        if(response) {
            router.push({ name: 'Profile', params: { id: authStore.userData.UserId } });
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
                    <div class="col-12">
                        <div class="flex flex-column gap-2">
                            <label for="price">Description</label>
                            <Textarea v-model="postObject.description" rows="5" cols="30" :class="classObject.descriptionClass" @input="()=>{classObject.descriptionClass = ''; errorObject.message = ''}"/>

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