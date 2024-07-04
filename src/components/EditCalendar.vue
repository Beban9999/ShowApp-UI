<template>
    <div v-if="isVisible" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <vue-cal
          class="vuecal--date-picker"
          xsmall
          hide-view-selector
          :time="false"
          :transitions="false"
          active-view="month"
          :disable-views="['week']"
          :selected="selectedDates"
          :disable-days="disabledDays"
          @cell-click="selectDate"
          style="width: 210px; height: 230px; background: #a78bfab0;"
        ></vue-cal>
        <div class="actions">
          <Button @click="submitDates">Save</Button>
        </div>
      </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { useArtistStore } from '../stores/artist_store';
import Swal from 'sweetalert2';
  
const props = defineProps<{ isVisible: boolean; initialSelectedDates: Array<string>; disabledDays: Array<string> }>();
const emits = defineEmits(['close', 'submit']);
const artistStore = useArtistStore();
  
const selectedDates = ref<string[]>([...props.initialSelectedDates]);
  
const close = () => {
    emits('close');
};
  
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
    emits('submit', selectedDates.value);
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
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
  
.modal-content {
    background: white;
    padding: 5px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
  
.actions {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 10px;
}
</style>
  