<script lang="ts" setup>
import router from "../router";
import { useAuthenticationStore } from "../stores/auth_store";
import { ref } from "vue";
import { service_get, service_post } from "../services/service_call";
import { CallType } from "../models/enums/CallType";
import { RequestStatus } from "../models/enums/RequestStatus";

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
const activeTab = ref(0)

async function loginClick() {
    var response = await service_post(CallType.Login, { LoginName: loginObject.value.username, Password: loginObject.value.password });
    console.log(response.data);
    
    if (response.status == RequestStatus.Success) {
        authStore.login(JSON.parse(response.data));
        const userData = await service_get(CallType.GetUser, { username: loginObject.value.username });
        authStore.userData = JSON.parse(userData.data);
    }
    else if (response.status == RequestStatus.Error && response.message == 'Activate') {
        console.log("Verifiy")
        const userData = await service_get(CallType.GetUser, { username: loginObject.value.username });
        authStore.userData = JSON.parse(userData.data);
        router.push({ name: "Verify" })
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
</script>

<template>
    <div class="flex w-full h-screen">
        <div class="w-4 bg-green-300 text-gray-900 font-bold p-2 flex align-items-center justify-content-center min-w-min">
            <Card>
                <template #content>

                    <TabView v-model:activeIndex="activeTab">
                        <TabPanel header="Login">
                            <div class="flex flex-column card-container green-container gap-3 p-4 align-items-center">
                                <InputText placeholder="Username" type="text" v-model="loginObject.username" v-on:keyup.enter = 'loginClick' />
                                <Password v-model="loginObject.password" placeholder="Password" :feedback="false" v-on:keyup.enter = 'loginClick' />
                                <small id="text-error" :class="errorObject.visibility">{{ errorObject.message || '&nbsp;'}}</small>
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
                                <small id="text-error" :class="errorObject.visibility">{{ errorObject.message || '&nbsp;'}}</small>
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