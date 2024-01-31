<script setup lang="ts">
import { register } from 'vue-advanced-chat'
import { useChatStore } from '../stores/chat_store'
import { ref } from 'vue';
import { useAuthenticationStore } from '../stores/auth_store';
import { service_post } from '../services/service_call';
import { CallType } from '../models/enums/CallType';
import { Message } from '../models/chat/Message'

const authStore = useAuthenticationStore();
const chatStore = useChatStore();
chatStore.loadRooms();
const chat =  ref<Array<any>>([]);
const rooms = chatStore.getRooms;
register()

const chatRooms = ref({
	currentUserId: authStore.userData.UserId.toString(),
	currentRoomId: 0,
	rooms: rooms,
	messages: [],
	messagesLoaded: false
})

function fetchMessages({ room }: any) {
	chatRooms.value.messagesLoaded = false;
	chatRooms.value.currentRoomId = room.roomId;
	
	chatStore.loadChat(room.roomId).then((response) => {
		chat.value = response;
		setTimeout(() => {
			chatRooms.value.messages = addMessages(room.roomId);
			chatRooms.value.messagesLoaded = true;
		}, 1000)
	})
}

function addMessages(roomId: any): any {
	var messages = [];
	for (let i = 0; i < chat.value.length; i++) {
		if (chat.value[i].roomId === roomId) {
			messages.push({
				_id: i,
				content: chat.value[i].content,
				senderId: chat.value[i].senderId,
				date: chat.value[i].date,
				timestamp: chat.value[i].timestamp
			});
		}
	}

	return messages;
}

async function sendMessage(message: any) {
	var param = new Message(message.roomId, chatRooms.value.currentUserId, message.content, new Date().toDateString(), new Date().toString().substring(16, 21));
	param.content = message.content;
	param.roomId = message.roomId;
	param.date = new Date().toDateString();
	param.timestamp = new Date().toString().substring(16, 21);
	service_post(CallType.InsertMessage, param).then((response) => {
		chat.value = JSON.parse(response.data);
		chatRooms.value.messages = addMessages(chatRooms.value.currentRoomId);
	});
}

</script>
<template>
	<div>
		<vue-advanced-chat height="calc(100vh - 60px)" 			
		    :current-user-id="chatRooms.currentUserId"
			:rooms="JSON.stringify(rooms)" 
			:rooms-loaded="true" 
			:messages="JSON.stringify(chatRooms.messages)"
			:messages-loaded="chatRooms.messagesLoaded" 
			:show-reaction-emojis="false" 
			:show-new-messages-divider="false"
			:show-audio="false"
			:show-files="false"
			:show-add-room="false"
			@send-message="sendMessage($event.detail[0])" 
			@fetch-messages="fetchMessages($event.detail[0])" />
	</div>
</template>


<style lang="scss">
body {
	font-family: 'Quicksand', sans-serif;
}
</style>
