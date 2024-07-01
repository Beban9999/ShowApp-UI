<template>
    <div class="h-full w-full flex align-items-center justify-content-center my-5 min-h-screen">
        <Card style="overflow: hidden w-full">
            <template #title>Edit Profile</template>
            <!-- <template #subtitle>Card subtitle</template> -->
            <template #content>
                <Fieldset legend="Basic informations">
                    <div class="w-full flex align-items-center justify-content-center gap-3">
                        <div class="flex flex-column gap-2">
                            <label for="username">Username</label>
                            <InputText id='username' placeholder="Enter your username" type="text" v-model="updateObject.userName" @focusout="fieldCheck('username')" />
                            <small>&nbsp;<i :class="userNameHelper.icon" :style="'color:'+userNameHelper.color" ></i>&nbsp; {{ userNameHelper.text }}</small>
                        </div>

                        <div class="flex flex-column gap-2">
                            <label for="email">Email</label>
                            <InputText id="email" placeholder="Enter your email" type="text" v-model="updateObject.email" @focusout="fieldCheck('email')" />
                            <small>&nbsp;<i :class="emailHelper.icon" :style="'color:'+emailHelper.color"></i>&nbsp; {{ emailHelper.text }}</small>
                        </div> 


                    </div>
                    <Divider/>
                    <div class="w-full flex align-items-center justify-content-center gap-3">
                        <div class="flex flex-column gap-2">
                            <label for="password">Old password</label>
                            <Password id="password" v-model="updateObject.oldpassword" placeholder="Enter your old password" @focusout="passwordCheck('old')" />
                            <small>&nbsp;<i :class="oldpasswordHelper.icon" :style="'color:'+oldpasswordHelper.color"></i>&nbsp; {{ oldpasswordHelper.text }}</small>
                        </div>
    
                        <div class="flex flex-column gap-2">
                            <label for="password">New password</label>
                            <Password id="password" v-model="updateObject.newpassword" placeholder="Enter your new password" @focusout="passwordCheck('new')" />
                            <small>&nbsp;<i :class="newpasswordHelper.icon" :style="'color:'+newpasswordHelper.color"></i>&nbsp; {{ newpasswordHelper.text }}</small>
                        </div>
                    </div>
                </Fieldset>
                <Fieldset legend="Artist informations" class="mt-3" v-if="authStore.userData.IsArtist">
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
                    <p>Change profile picture</p>
                    <div class="flex align-items-center justify-content-center gap-3">
                        <Image :src="`../../media/${authStore.userData.UserId}/${authStore.userData.Avatar}`" preview  width="210" height="210"/>
                        <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="" />
                    </div>
                </Fieldset>
            </template>
            <template #footer>
                <div class="flex gap-3 mt-1">
                    <Button label="Save" @click="" class="w-full" :disabled="everythingGood()"/>
                </div>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { useAuthenticationStore } from '../stores/auth_store';
import {  useArtistStore } from '../stores/artist_store';
import { onMounted, ref } from 'vue';
import { service_get } from '../services/service_call';
import { CallType } from '../models/enums/CallType';

interface fieldHelper{
    icon: string,
    color: string,
    text: string,
}

const isError = ref(false);

const genres = ref();
const types = ref();
onMounted(async () => {
    types.value = await artistStore.getTypes();
    genres.value = await artistStore.getGenres();
});
function validateEmail(email : string){
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


const updateObject = ref({
    userName : "",
    email : "",
    oldpassword: "",
    newpassword: "",
    artistName: "",
    location: "",
    description: "",
    type: "",
    genre: "",})

const authStore = useAuthenticationStore();
const artistStore = useArtistStore();
const artistObject = ref({})
 artistStore.getArtistData(authStore.userData.UserId).then(async response =>{
    artistObject.value = response;

    var type;
    var genres;
    if(authStore.userData.IsArtist){
        type = await getTypeIdByDescription(artistObject.value.Type)
        genres = await getGenreIdsByNames(artistObject.value.Genres)
    }
    updateObject.value = {
        userName : authStore.userData.LoginName,
        email : authStore.userData.Email,
        oldpassword: "",
        newpassword: "",
        artistName: artistObject.value?.Name,
        location: artistObject.value?.Location,
        description: artistObject.value?.Description,
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


var userNameHelper = ref({} as fieldHelper) 
var emailHelper = ref({} as fieldHelper)
var oldpasswordHelper = ref({} as fieldHelper)
var newpasswordHelper = ref({} as fieldHelper)

function fieldCheck(field : string){
    var oldValue = ''
    var newValue = ''
    const fieldObject = ref({} as fieldHelper);
    if(field == 'username'){
        oldValue = authStore.userData.LoginName
        newValue = updateObject.value.userName
        fieldObject.value = userNameHelper.value;
    }
    else{
        oldValue = authStore.userData.Email
        newValue = updateObject.value.email
        fieldObject.value = emailHelper.value;
    }

    if(field == 'email' && !validateEmail(newValue)){
        console.log(validateEmail(newValue))
        getHelper(fieldObject.value, 'bad', 'Please enter valid email');
        return;
    }

    if(newValue.trim() == ""){
        getHelper(fieldObject.value, 'bad', 'Cannot be empty');
        return;
    }
    if(oldValue == newValue){
        getHelper(fieldObject.value, '', '');
        return;
    }

    getHelper(fieldObject.value, 'load', '');
    service_get(CallType.Validate, {fieldName: field, fieldValue: newValue}).then(response =>{
        const resp = JSON.parse(response.data)
        console.log(resp)
        if(resp.IsSuccessfull == false){
            getHelper(fieldObject.value, 'bad', resp.ErrorMessage);
        }
        else{
            getHelper(fieldObject.value, 'good', '');
        }
    })
}

function passwordCheck(type: string) {
    if (type === 'old') {
        if (updateObject.value.oldpassword.trim() == "") {
            getHelper(oldpasswordHelper.value, '', '');
            return;
        }
        service_get(CallType.checkPassword, { userId: authStore.userData.UserId, password: updateObject.value.oldpassword }).then(response => {
            const resp = JSON.parse(response.data)
            console.log(resp)
            if (resp.IsSuccessfull == false) {
                getHelper(oldpasswordHelper.value, 'bad', resp.ErrorMessage);
            }
            else {
                getHelper(oldpasswordHelper.value, 'good', '')
            }
        })
    }
    else{
        if(updateObject.value.newpassword.trim() == ""){
            if(updateObject.value.oldpassword.trim() != ""){
                getHelper(newpasswordHelper.value, 'bad', 'New password cannot be empty');
                return;
            }
            getHelper(newpasswordHelper.value, '', '');
            return;
        }
        else{
            if(oldpasswordHelper.value.color == 'red'){
                getHelper(newpasswordHelper.value, 'bad', 'Please enter valid old password');
                return;
            }
            getHelper(newpasswordHelper.value, 'good', '');
        }
    }
}

function everythingGood(){
    if(userNameHelper.value.color == 'red' || emailHelper.value.color == 'red'){
        return true;
    }
    return false;
}

function getHelper(helperObject : fieldHelper, state : string, message : string){
    if(state === 'good'){
        helperObject.icon = 'pi pi-check'
        helperObject.color = 'green'
        helperObject.text = ''
    }
    else if(state === 'bad'){
        helperObject.icon = 'pi pi-times'
        helperObject.color = 'red'
        helperObject.text = message
        isError.value = true;
    }
    else if(state === 'load'){
        helperObject.icon = 'pi pi-spin pi-spinner'
        helperObject.color = ''
        helperObject.text = ''
    }
    else{
        helperObject.icon = '';
        helperObject.color= '';
        helperObject.text = '';
    }
}

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