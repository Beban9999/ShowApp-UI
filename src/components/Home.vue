<script setup lang="ts">
import { ref } from 'vue';
import { useAuthenticationStore } from '../stores/auth_store';
import  BecomeArtis  from '../components/BecomeArtist.vue'


const authStore = useAuthenticationStore();
const userId = authStore.userData.UserId;

const menuItems = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        route: '/main'
    },
    // {
    //     label: 'Users',
    //     icon: 'pi pi-fw pi-user',
    // },
    // {
    //     label: 'Events',
    //     icon: 'pi pi-fw pi-calendar',
    //     route: '/page2'
    // },
    // {
    //     label: 'Upload',
    //     icon: 'pi pi-fw pi-upload',
    // },
    {
        label: 'Chat',
        icon: 'pi pi-comments',
        route: `/chat/${userId}`
    }
]);

if (!authStore.userData.IsArtist) {
    menuItems.value.splice(1, 0, {
        label: 'Become an artist',
        // icon: 'pi pi-fw pi-pencil',
        //route: '/BecomeArtist',
        icon: '',
        command: () => {
            console.log("THIS IS BTN TEST");
            becomeDialog.value = true;
        }
    });
}
const submenuItems = ref([
    { separator: true },
    {
        label: 'View profile',
        icon: 'pi pi-fw pi-user',
        route: `/profile/${userId}`
    },
    {
        label: 'Edit profile',
        icon: 'pi pi-fw pi-pencil',
        route: `/edit_profile/${userId}`
    },

    { separator: true },
])

function logoutClick() {
    authStore.logout();
}
function profileClick(){

}
const menu = ref();
const becomeDialog = ref(false);

const toggle = (event: any) => {
    menu.value.toggle(event);
};

const becomeProgress= ref(1);
</script>

<template>
    <Dialog v-model:visible="becomeDialog" modal header="Become an Artist" class="w-6">
        <div class="artist-benefits" v-if="becomeProgress == 1">
            <p>Join our vibrant community of artists and unlock a world of opportunities. Here’s why you should become an artist on our platform:</p>
            
            <ul>
                <li><strong>Showcase Your Work:</strong> Create a stunning profile to display your art. Upload images, videos, and other media to highlight your talent.</li>
                <li><strong>Get Discovered:</strong> Increase your visibility as people from around the world can find and follow your profile. Gain fans and supporters.</li>
                <li><strong>Feature on Our Homepage:</strong> Stand out by appearing on our main page, which is viewed by thousands of visitors daily.</li>
                <li><strong>Connect with Fellow Artists:</strong> Engage with a network of artists. Collaborate, share ideas, and grow together.</li>
                <li><strong>Sell Your Art:</strong> Set up an online store to sell your artwork. Reach new customers and grow your business.</li>
                <li><strong>Access Exclusive Events:</strong> Get invites to special events, exhibitions, and online showcases exclusively for our artists.</li>
                <li><strong>Professional Support:</strong> Receive tips and guidance from experts to help you improve your skills and manage your artistic career.</li>
            </ul>
            
            <p>Ready to start your artistic journey?</p>
        </div>
        
        <BecomeArtis v-else-if="becomeProgress == 2"></BecomeArtis>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Back" severity="secondary" @click="(becomeProgress == 2)?becomeProgress--:becomeDialog = false"></Button>
            <Button type="button" label="Next" @click="(becomeProgress == 1)?becomeProgress++:becomeDialog = false"></Button>
        </div>
    </Dialog>
    <div class="card relative z-2">
        <Menubar :model="menuItems" class="p-1">
            <template #start>
                <b class="mx-1">MusicConnect</b>
            </template>
            <template #item="{ label, item, props, root, hasSubmenu }">
                
                    <router-link v-if="item.route" v-slot="routerProps" :to="item.route">
                        <a :href="routerProps.href" v-bind="props.action" style="text-decoration: none; color: inherit;">
                            <span v-bind="props.icon" />
                            <span v-bind="props.label">{{ label }}</span>
                        </a>
                    </router-link>
                    <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                        <span v-bind="props.icon" />
                        <span v-bind="props.label">{{ label }}</span>
                        <span :class="[hasSubmenu && (root ? 'pi pi-fw pi-angle-down' : 'pi pi-fw pi-angle-right')]"
                            v-bind="props.submenuicon" />
                    </a>
            </template>
            <template #end>
                <Button icon="pi pi-cog" rounded aria-label="Search" @click="toggle" aria-haspopup="true"
                    aria-controls="overlay_menu" class="p-0"/>

                <Menu ref="menu" id="overlay_menu" :model="submenuItems" :popup="true">
                    <template #start>
                        <button @click="profileClick"
                            class="w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
                            <Avatar :image="`../../media/${authStore.userData.UserId}/${authStore.userData.Avatar}`" class="mr-2"
                                shape="circle" />
                            <div class="flex flex-column align">
                                <span class="font-bold">{{ authStore.getFullName }}</span>
                                <span class="text-sm">Agent</span>
                            </div>
                        </button>
                    </template>
                    <template #item="{ item, props }">
                        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                                <span :class="item.icon" />
                                <span class="ml-2">{{ item.label }}</span>
                            </a>
                        </router-link>
                        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                            <span :class="item.icon" />
                            <span class="ml-2">{{ item.label }}</span>
                        </a>
                    </template>
                    <template #end>
                        <Button @click="logoutClick"
                            class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround">
                            <i class="pi pi-sign-out" />
                            <span class="ml-2">Log Out</span>
                        </Button>
                    </template>

                </Menu>
            </template>
        </Menubar>
    </div>
    <router-view></router-view>
    <div class="footer w-full h-8rem p-3 flex">
       
        <div>
            <h2>MusicConnect</h2>
            <p style="color: gray; white-space: nowrap;">© 2023 MusicConnect. All Rights Reserved.</p>
        </div>
        <div class="w-full flex justify-content-end gap-3">
            <div>
                <h3>Follow us</h3>
                <div class="flex gap-3">
                    <a href="https://www.instagram.com/"><i class="pi pi-instagram icon_class"></i></a>
                    <a href="https://x.com/?lang=en"><i class="pi pi-twitter icon_class"></i></a>
                    <a href="https://www.facebook.com/"><i class="pi pi-facebook icon_class"></i></a>
                </div>
            </div>

        </div>
            
    
    </div>
</template>

<style scoped>
.footer{
    background-color: #1f2937;
}
.icon_class{
    font-size: 1.5rem
}
a {
    text-decoration: none;
}
</style>
