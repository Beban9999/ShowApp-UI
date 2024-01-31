import { defineStore } from "pinia";
import { service_get } from "../services/service_call";
import { CallType } from "../models/enums/CallType";
import { useAuthenticationStore } from "./auth_store";
const authStore = useAuthenticationStore();

export const useChatStore = defineStore("ChatStore", {
	state: () => ({
		rooms: []
	}),
	actions: {
		async loadRooms() {
			var user = authStore.userData.LoginName;
			var response = await service_get(CallType.GetRooms, { username : user});
			this.rooms = JSON.parse(response.data);
		},
		async loadChat(roomId : number) {
			var user = authStore.userData.LoginName;
			var response = await service_get(CallType.GetMessages, { roomId: roomId, username: user });
			return JSON.parse(response.data);
		}
	},
	getters: {
		getRooms() : any {
			return this.rooms;
		}
	},
	persist: {
    storage: sessionStorage
  }
})