<template>
    <div class="flex w-full h-screen">
        <div class="w-full bg-green-300 text-gray-900 font-bold p-2 flex align-items-center justify-content-center">
            <Card>
                <template #content>
                    <div v-if="availabe">
                        Link is not available
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

const email = useAuthenticationStore().email;
const userID = ref(-1);
const availabe = ref(false);

async function checkActive(){
    try {
        let apiUrl = 'https://localhost:7201/api/Login/active';
    
        // Append the postId as a query parameter if provided
        if (email) {
            apiUrl += `?email=${email}`;
        }
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            console.log(data); // The result from the API
            return data;
        } else {
            console.error('Failed to retrieve posts');
        }
    } catch (error) {
        console.error('An error occurred while retrieving posts:', error);
    }
}

checkActive().then((response : any) =>{
    availabe.value = response.isActive
    if(!response.isActive){
        userID.value = response.userID;
        sendEmail(email,'https://localhost:7201/api/Login/activateUser?userId='+response.userID)
    }
})
function resendEmail(){
    sendEmail(email,'https://localhost:7201/api/Login/activateUser?userId='+userID.value)
}

</script>