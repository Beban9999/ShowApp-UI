import { defineStore } from "pinia";
import router from "../router";

interface UserData {
  FirstName: string,
  LastName: string,
  LoginName: string,
  Email: string,
  IsActive: boolean,
  IsDeleted: boolean
}

export const useAuthenticationStore = defineStore("AuthenticationStore", {
  state: () => ({
    loggedIn: false,
    userData : {} as UserData,
  }),
  actions: {
    login() {
      this.loggedIn = true;
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
    // async doLogin(username: string, password: string) {
    //   try {
    //     const apiUrl = 'https://localhost:7201/api/Login';
    //     const requestBody = {
    //       loginName: username,
    //       password: password,
    //     };

    //     const response = await fetch(apiUrl, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(requestBody),
    //     });

    //     if (response.ok) {
    //       const data = await response.json();
    //       console.log(data); // The result from the API
    //       return data;
    //     } else {
    //       console.error('Authentication failed. Check your credentials.');
    //     }
    //   } catch (error) {
    //     console.error('An error occurred while authenticating:', error);
    //   }
    // },
    // async doRegister(username: string, password: string, fname: string, lname: string, email: string) {
    //   try {
    //     const apiUrl = 'https://localhost:7201/api/Login/register';
    //     const requestBody = {
    //       loginName: username,
    //       password: password,
    //       firstName: fname,
    //       lastName: lname,
    //       email: email
    //     }

    //     const response = await fetch(apiUrl, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(requestBody),
    //     });

    //     if (response.ok) {
    //       const data = await response.json();
    //       console.log(data); // The result from the API
    //       return data;
    //     } else {
    //       console.error('Authentication failed. Check your credentials.');
    //     }
    //   } catch (error) {
    //     console.error('An error occurred while authenticating:', error);
    //   }
    // }
  },
  getters: {
    getFullName() : string{
      return this.userData.FirstName + " " + this.userData.LastName
    }
  },
  persist: {
    storage: sessionStorage
  }
});