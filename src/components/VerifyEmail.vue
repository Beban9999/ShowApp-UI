<template>
    <div class="flex w-full h-screen">
        <div class="w-full bg-green-300 text-gray-900 font-bold p-2 flex align-items-center justify-content-center">
            <Card>
                <template #content>
                    <div v-if="availabe">
                        Link is not available
                        <Divider></Divider>
                        <Button @click="goToMainPage()">Go to main page</Button>
                    </div>
                    <div v-else>
                        <div class="flex flex-column">
                            <div>
                                Pleaes verify your email
                                {{ email }}
                            </div>
                            <Divider />
                            <div class="flex align-items-center justify-content-center">
                                <Button @click="resendEmail">Resend the email</Button>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useAuthenticationStore } from '../stores/auth_store';
import { sendEmail } from '../services/verifiy_email';
import { service_get } from '../services/service_call';
import { CallType } from '../models/enums/CallType';
import { goToMainPage } from '../router';

const email = useAuthenticationStore().userData.Email;
const userID = ref(-1);
const availabe = ref(false);

service_get(CallType.IsActive, { email: email }).then(response => {
    var retObject = JSON.parse(response.data)
    console.log(retObject);
    availabe.value = retObject.IsActive;
    if(availabe.value){
        return
    }
    console.log(retObject.IsActive)
    if (!retObject.isActive) {
        userID.value = retObject.UserID;
        sendEmail(email, 'https://localhost:7201/api/Auth/activate?userId=' + userID.value)
    }
})

function resendEmail() {
    sendEmail(email, 'https://localhost:7201/api/Auth/activate?userId=' + userID.value)
}

</script>