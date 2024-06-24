<script lang="ts" setup>
import router from "../router";
import { useAuthenticationStore } from "../stores/auth_store";
import { onMounted, ref } from "vue";
import { service_get, service_post } from "../services/service_call";
import { CallType } from "../models/enums/CallType";
import { RequestStatus } from "../models/enums/RequestStatus";
import { useArtistStore } from "../stores/artist_store";

const loginObject = ref({
    f_name: "",
    l_name: "",
    username: "",
    email: "",
    password: "",
})
const authStore = useAuthenticationStore();
const artistStore = useArtistStore();
const errorObject = ref({
    message: "",
    visibility: "p-error hidden"
})
const activeTab = ref(0)

async function loginClick() {
    console.log("AAAA", getElementWidth());
    var response = await service_post(CallType.Login, { LoginName: loginObject.value.username, Password: loginObject.value.password });
    console.log(response.data);
    
    if (response.status == RequestStatus.Success) {
        authStore.login(JSON.parse(response.data));
        await artistStore.getUserData(loginObject.value.username);
        router.push({ path: '/home' });
    }
    else if (response.status == RequestStatus.Error && response.message == 'Activate') {
        console.log("Verifiy")
        await artistStore.getUserData(loginObject.value.username);
        router.push({ name: "Verify" });
    }
    else {
        errorObject.value.message = response.message;
        errorObject.value.visibility = "p-error"
    }
}

async function registerClick() {
    var response = await service_post(CallType.Register, { LoginName: loginObject.value.username, Password: loginObject.value.password, FirstName: loginObject.value.f_name, LastName: loginObject.value.l_name, Email: loginObject.value.email })
    console.log(response.data)

    if (response.data == 'true') {
        console.log("SUCCESSFULLY REGISTERED")
        activeTab.value = 0;
    }
    else {
        errorObject.value.message = response.message;
        errorObject.value.visibility = "p-error"
    }
}
onMounted(() => {
    calcWidth()
})

addEventListener("resize", (event) => {
    calcWidth()
});

const showLeft = ref(true)
const leftWidth = ref();
const register = ref(false);

function calcWidth() {
    const rightWidth = document.getElementById('left_div')?.offsetWidth ?? 0;
    if(rightWidth > 700){
        showLeft.value = true;
    }
    if(rightWidth < 500){
        showLeft.value = false;
    }
}
function getElementWidth (){
      if (leftWidth.value) {
        return leftWidth.value.offsetWidth;
      }
      return null;
};
function switchRegisterLogin(){
    register.value = true ? register.value == false : false;
    return false;
}
</script>

<template>
    <div class="flex w-full h-screen justify-content-center">
        <div v-if="showLeft" class="w-6 text-gray-900 font-bold flex align-items-center justify-content-center min-w-min left-div" style="background-color:#1f2937">
            <div class="" style="color:white; text-align:center">
                <img src="..\assets\Landing.png" alt="">
                <h1 class="px-6" style="white-space: nowrap;">Discover new artists and <br> music genres.</h1>
                <h3>Connect with musicians worldwide.</h3>
            </div>
        </div>
        <div class="w-8 text-white font-bold flex align-items-center justify-content-center" id="left_div" >
            <div class="corner-div" >
                <h1>MusicConnect</h1>
                <h5 style="margin-top: -15px;">Stay updated</h5>
            </div>
            <div v-if="!register" class="flex flex-column gap-2 align-items-center w-3">
                <h1 style="white-space: nowrap;">Log in</h1>
                <div>
                    <h4>Username</h4>
                    <InputText placeholder="Enter your username" type="text" v-model="loginObject.username" v-on:keyup.enter = 'loginClick'/>
                </div>
                <div>
                    <h4>Password</h4>
                    <Password v-model="loginObject.password" placeholder="Enter your password" :feedback="false" v-on:keyup.enter = 'loginClick' />
                </div>
                <small id="text-error" :class="errorObject.visibility">{{ errorObject.message || '&nbsp;'}}</small>
                <div>
                    <Button class="align-items-center justify-content-center"  @click="loginClick" :class="$style.button"><div>Log in</div></Button>
                </div>


                <span style="white-space: nowrap;">You do not have an account? <a href="" onclick="return false;" @click="switchRegisterLogin">Register</a></span>
            </div>
            <div v-if="register" class="flex flex-column gap-2 align-items-center w-6">
                <h1 style="white-space: nowrap;">Register</h1>

                <div>
                    <h4>Full name</h4>
                    <div class="gap-4 flex">
                        <InputText class="w-7rem" placeholder="First name" type="text" v-model="loginObject.f_name" />
                        <InputText class="w-7rem" placeholder="Last name" type="text" v-model="loginObject.l_name" />
                    </div>
                </div>

                <div>
                    <h4>Username</h4>
                    <InputText placeholder="Enter your username" type="text" v-model="loginObject.username" />
                </div>
                <div>
                    <h4>Email</h4>
                    <InputText placeholder="Enter your email" type="text" v-model="loginObject.email" />
                </div>
                <div>
                    <h4>Password</h4>
                    <Password v-model="loginObject.password" placeholder="Enter new password" :feedback="false" />
                </div>
                <small id="text-error" :class="errorObject.visibility">{{ errorObject.message || '&nbsp;'}}</small>
                <div>
                    <Button class="align-items-center justify-content-center" @click="registerClick" :class="$style.button">Register</Button>
                </div>

                <span style="white-space: nowrap;">Already have an account? <a href="" onclick="return false;" @click="switchRegisterLogin">Login</a></span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.corner-div{
    position: absolute;
    right: 1%;
    top: 1%;
}
</style>
<style module>
.button {
    color: white;
    background-color: #1f2937;
    border-color: #1f2937;
    margin-top: 5%;
    min-width: 200px;
    width: 250px;

}

</style>