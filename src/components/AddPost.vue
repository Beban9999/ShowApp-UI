<script setup lang="ts">
import { ref } from 'vue';
import { usePostsStore } from '../stores/posts_store';
const fileUploadRef = ref({
    upload() { }, //just for typescript
    files: []
});
const postObject = ref({
    title: "",
    price: 0,
    description: ""
})
const classObject = ref({
    titleClass: "",
    descriptionClass: "",
    priceClass: ""
})
const errorObject = ref({
    message : "",
    visibility: "p-error"
})
const imageUploadUrl = ref("https://localhost:7201/api/Images/");

function insertNewPost() {

    console.log(postObject.value)
    if(postObject.value.title.trim() === ""){
        classObject.value.titleClass = 'p-invalid'
        errorObject.value.message = "Title is required"

        return;
    }
    if(postObject.value.price === 0){
        classObject.value.priceClass = 'p-invalid'
        errorObject.value.message = "Price can't be 0"

        return;
    }
    if(postObject.value.description.trim() === ""){
        classObject.value.descriptionClass = 'p-invalid'
        errorObject.value.message = "Description is required"

        return;
    }

    //Insert new post
    const postStore = usePostsStore();

    postStore.insertPost(postObject.value.title, postObject.value.description, postObject.value.price).then(result => {
        imageUploadUrl.value = "https://localhost:7201/api/Images/" + result
    }).then(() => {
        //Insert images for that post
        if (fileUploadRef?.value && fileUploadRef.value.files.length !== 0) {
            console.log(fileUploadRef.value.files.length === 0)
            fileUploadRef.value.upload()
        }
    })

}
</script>

<template>
    <div class="w-full">
        <Card class="w-7 mx-auto mt-5">
            <template #title>
                <div class="flex flex-column card-container green-container gap-3 align-items-center">
                    Add a new post
                </div>
            </template>
            <template #content>
                <div class="grid m-5">
                    <div class="col-6">
                        <div class="flex flex-column gap-2">
                            <label for="title">Title</label>
                            <InputText id="title" v-model="postObject.title" :class="classObject.titleClass" @input="()=>{classObject.titleClass = ''; errorObject.message = ''}"/>

                        </div>
                    </div>

                    <div class="col-6">
                        <div class="flex flex-column gap-2">
                            <label for="price">Price</label>
                            <InputNumber v-model="postObject.price" inputId="currency-us" mode="currency" currency="USD" :class="classObject.priceClass" 
                                locale="en-US" @input="()=>{classObject.priceClass = ''; errorObject.message = ''}"/>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="flex flex-column gap-2">
                            <label for="price">Description</label>
                            <Textarea v-model="postObject.description" rows="5" cols="30" :class="classObject.descriptionClass" @input="()=>{classObject.descriptionClass = ''; errorObject.message = ''}"/>

                        </div>
                    </div>
                    <div class="col-12">
                        
                        <div class="flex flex-column gap-2">
                            <div>
                                <FileUpload name="images" accept="image/*" ref="fileUploadRef" :maxFileSize="1000000"
                                    :multiple=true :showUploadButton="false" :url="imageUploadUrl"/>
                                    <small id="text-error" :class="errorObject.visibility">{{ errorObject.message || '&nbsp;' }}</small>
                            </div>
                            <div class="mx-auto mt-6">
                                <Button @click="insertNewPost">Finish</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>