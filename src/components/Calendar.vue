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
          :disable-days="disabledDays"
          style="width: 210px; height: 230px; background: #a78bfab0;"
        ></vue-cal>
      </div>
    </div>
</template>
  
<script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  
  const props = defineProps<{ isVisible: boolean; disabledDays: Array<string> }>();
  const emits = defineEmits(['close']);
  
  const close = () => {
    emits('close');
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
}
</style>
  