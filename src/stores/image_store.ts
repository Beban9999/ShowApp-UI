// stores/images.ts

import { defineStore } from 'pinia';

interface ImagesState {
  uploadedImages: File[];
}

export const useImagesStore = defineStore({
  id: 'images',
  state: (): ImagesState => ({
    uploadedImages: [],
  }),
  getters: {
    getImageUrls: (state) =>
      state.uploadedImages.map((image) => URL.createObjectURL(image)),
  },
  actions: {
    addImage(image: File) {
      this.uploadedImages.push(image);
    },
    removeImage(index: number) {
      this.uploadedImages.splice(index, 1);
    },
    clearImages() {
      this.uploadedImages = [];
    },
  },
});
