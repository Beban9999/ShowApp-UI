<script lang="ts" setup>
import router from "../router";
import { useAuthenticationStore } from "../stores/auth_store";
import { ref } from "vue";
import { service_get, service_post } from "../services/service_call";
import { CallType } from "../models/enums/CallType";

const loginObject = ref({
    f_name: "",
    l_name: "",
    username: "",
    email: "",
    password: "",
})
const authStore = useAuthenticationStore();
const errorObject = ref({
    message: "",
    visibility: "p-error hidden"
})

async function loginClick() {
    var response = await service_post(CallType.Login, { LoginName : loginObject.value.username, Password: loginObject.value.password})
    //{status: 1, message: 'Login is successfull!', data: 'true'}
    console.log(response.data);

    if(response.data == 'true'){
        const userData = await service_get(CallType.GetUser, { username : loginObject.value.username});
        authStore.userData = JSON.parse(userData.data);
        authStore.login();
    }
    else if(response.data == 'false' && response.message == 'Activate'){
        console.log("Verifiy")
        const userData = await service_get(CallType.GetUser, { username : loginObject.value.username});
        authStore.userData = JSON.parse(userData.data);
        router.push({name: "Verify"})
    }
    else{
        errorObject.value.message = response.message;
        errorObject.value.visibility = "p-error"
    }
}

function registerClick() {
    authStore.doRegister(loginObject.value.username, loginObject.value.password, loginObject.value.f_name, loginObject.value.l_name, loginObject.value.email).then(result => {
        if (!result) {
            errorObject.value.message = "Server error";
            errorObject.value.visibility = "p-error"
        }
        else if (result && result.returnCode === 0) {
            console.log("Success")
        }
        else {
            if(result.returnValue.split("|")[0] === "verify"){
                console.log("Verifiy")
                router.push({name: "Verify"})
            }
            errorObject.value.message = result.returnValue;
            errorObject.value.visibility = "p-error"

        }
    })
}
</script>

<template>
    <div class="flex w-full h-screen">
        <div class="w-4 bg-green-300 text-gray-900 font-bold p-2 flex align-items-center justify-content-center min-w-min">
            <Card>
                <template #content>

                    <TabView>
                        <TabPanel header="Login">
                            <div class="flex flex-column card-container green-container gap-3 p-4 align-items-center">
                                <InputText placeholder="Username" type="text" v-model="loginObject.username" />
                                <Password v-model="loginObject.password" placeholder="Password" :feedback="false" />
                                <small id="text-error" :class="errorObject.visibility">{{ errorObject.message || '&nbsp;'
                                }}</small>
                                <Button @click="loginClick">Login</Button>
                            </div>      
                        </TabPanel>
                        <TabPanel header="Register">
                            <div class="flex flex-column card-container green-container gap-3 p-4 align-items-center">
                                <InputText placeholder="First name" type="text" v-model="loginObject.f_name" />
                                <InputText placeholder="Last name" type="text" v-model="loginObject.l_name" />
                                <InputText placeholder="Username" type="text" v-model="loginObject.username" />
                                <InputText placeholder="Email" type="text" v-model="loginObject.email" />
                                <Password v-model="loginObject.password" placeholder="Password" :feedback="false" />
                                <small id="text-error" :class="errorObject.visibility">{{ errorObject.message || '&nbsp;'
                                }}</small>
                                <Button @click="registerClick">Register</Button>
                            </div>  
                        </TabPanel>
                    </TabView>
                </template>

            </Card>
        </div>
        <div class="w-8 bg-green-500 text-white font-bold p-3 flex align-items-center justify-content-center"></div>

    </div>
</template>

<style></style>