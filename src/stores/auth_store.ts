import { defineStore } from "pinia";
import router from "../router";

interface UserData {
  UserId: number,
  FirstName: string,
  LastName: string,
  LoginName: string,
  Email: string,
  Avatar: string,
  IsArtist: boolean;
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
      router.push({ path: '/home' })
    },
    logout() {
      this.loggedIn = false;
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