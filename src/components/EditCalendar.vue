<template>
    <div>
        <Button class="pi pi-calendar" @click="visible = true"></Button>
        <Dialog v-model:visible="visible" modal header="Select Dates">
            <vue-cal class="vuecal--date-picker" xsmall hide-view-selector :time="false" :transitions="false"
                active-view="month" :selected="selectedDates" :disable-days="disabledDays" @cell-click="selectDate"
                style="width: 210px; height: 230px; background: #a78bfab0;"></vue-cal>
            <div class="actions">
                <Button type="button" label="Cancel" @click="visible = false" severity="secondary"></Button>
                <Button type="button" label="Save" @click="submitDates"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Swal from 'sweetalert2';
import { useArtistStore } from '../stores/artist_store';

const visible = ref(false);
const artistStore = useArtistStore();
const selectedDates = ref<string[]>([]);
defineProps<{ disabledDays: Array<string> }>();

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const selectDate = (date: Date) => {
    const formattedDate = formatDate(new Date(date));
    const index = selectedDates.value.indexOf(formattedDate);
    if (index === -1) {
        selectedDates.value.push(formattedDate);
    } else {
        selectedDates.value.splice(index, 1);
    }
};

const submitDates = async () => {
    if (selectedDates.value != null) {
        try {
            const resp = await artistStore.insertDates(selectedDates.value);
            debugger
            if (resp) {
                window.location.reload();
            } else {
                Swal.fire('Error!', 'There was an error inserting the dates.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'There was an error inserting the dates.', 'error');
        }
    }

    close();
};


</script>

<style scoped>
.actions {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 10px;
}
</style>