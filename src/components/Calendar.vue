<template>
    <div>
        <Button class="pi pi-calendar" @click="visible = true"></Button>
        <Dialog v-model:visible="visible" header="Availability" modal>
            <vue-cal class="vuecal--date-picker" xsmall hide-view-selector :time="false" :transitions="false"
                active-view="month" :disable-days="disabledDays" 
                style="width: 210px; height: 230px; background: #a78bfab0;"></vue-cal>
        </Dialog>
    </div>
</template>
  
<script setup lang="ts">
  import { ref, defineProps } from 'vue';
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';

  const visible = ref(false);
  defineProps<{ disabledDays: Array<string> }>();
  

</script>
  
<style scoped>

</style>
  