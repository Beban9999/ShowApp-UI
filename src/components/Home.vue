<script setup lang="ts">
import { ref } from 'vue';
import { useAuthenticationStore } from '../stores/auth_store';
const authStore = useAuthenticationStore();

const menuItems = ref([
    {
        label: 'Home',
        icon: 'pi pi-fw pi-file',
        route: '/main'
    },
    {
        label: 'Add',
        icon: 'pi pi-fw pi-pencil',
        route: '/add'
    },
    {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
    },
    {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar',
        route: '/page2'
    },
    {
        label: 'Upload',
        icon: 'pi pi-fw pi-upload',
    },
    {
        label: 'Chat',
        icon: 'pi pi-comments',
        route: '/chat'
    }
]);

const submenuItems = ref([
    { separator: true },
    {
        label: 'View profile',
        icon: 'pi pi-fw pi-user'
    },
    {
        label: 'Edit profile',
        icon: 'pi pi-fw pi-pencil'
    },

    { separator: true },
])

function logoutClick() {
    authStore.logout();
}
function profileClick(){

}
const menu = ref();

const toggle = (event: any) => {
    menu.value.toggle(event);
};
</script>

<template>
    <div class="card relative z-2">
        <Menubar :model="menuItems" class="p-1">
            <template #start>

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
                            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2"
                                shape="circle" />
                            <div class="flex flex-column align">
                                <span class="font-bold">{{ authStore.getFullName }}</span>
                                <span class="text-sm">Agent</span>
                            </div>
                        </button>
                    </template>
                    <template #item="{ item, label, props }">
                        <a class="flex" v-bind="props.action">
                            <span v-bind="props.icon" />
                            <span v-bind="props.label">{{ label }}</span>
                            <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
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
</template>

<style scoped>
a {
    text-decoration: none;
}
</style>
