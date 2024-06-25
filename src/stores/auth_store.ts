import { defineStore } from "pinia";
import router from "../router";
import { useChatStore } from './chat_store'; 

interface UserData {
  UserId: number,
  FirstName: string,
  LastName: string,
  LoginName: string,
  Email: string,
  Avatar: string,
  IsArtist: boolean,
  IsActive: boolean,
  IsDeleted: boolean
}

export const useAuthenticationStore = defineStore("AuthenticationStore", {
  state: () => ({
    loggedIn: false,
    userData: {} as UserData,
    token : ''
  }),
  actions: {
    login(token: string) {
      this.loggedIn = true;
      this.token = token;
    },
    logout() {
      const chatStore = useChatStore();
      this.loggedIn = false;
      this.userData = {} as UserData;
      this.token = '';
      localStorage.removeItem('AuthenticationStore');
      localStorage.removeItem('ArtistStore');
      chatStore.reset();
      router.push({ path: '/' })
    },
    checkStatus() {
      if (!this.loggedIn) {
        router.push({ path: '/' })
      }
    },
  },
  getters: {
    getFullName(): string {
      return this.userData.FirstName + " " + this.userData.LastName
    }
  },
  persist: {
    storage: localStorage
  }
});