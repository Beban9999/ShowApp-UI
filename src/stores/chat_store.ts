import { defineStore } from "pinia";
import { service_get, service_post } from "../services/service_call";
import { CallType } from "../models/enums/CallType";
import { useAuthenticationStore } from "./auth_store";

export const useChatStore = defineStore("ChatStore", {
	state: () => ({
		rooms: []
	}),
	actions: {
		async createRoom(receiverId: number) {
			const authStore = useAuthenticationStore();
			var user = authStore.userData.UserId;
			var response = await service_post(CallType.CreateRoom, { receiverId: receiverId, senderId: user });
			return JSON.parse(response.data);
		},
		async loadRooms() {
			const authStore = useAuthenticationStore();
			var user = authStore.userData.UserId;
			var response = await service_get(CallType.GetRooms, { userId : user});
			this.rooms = JSON.parse(response.data);
		},
		async loadChat(roomId : number) {
			const authStore = useAuthenticationStore();
			var user = authStore.userData.UserId;
			var response = await service_get(CallType.GetMessages, { roomId: roomId, userId: user });
			return JSON.parse(response.data);
		},
		reset() {
			this.rooms = [];
			sessionStorage.removeItem('ChatStore');
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