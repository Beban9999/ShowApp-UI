import { ref } from 'vue';
import { service_get } from './service_call';
import { CallType } from '../models/enums/CallType';

class ChatService {
  username: any;
  onUnreadMessagesUpdate: any;
  unreadMessagesCount: any;
  ws: WebSocket;

  constructor(username: string,onUnreadMessagesUpdate: any) {
    this.username = username;
    this.onUnreadMessagesUpdate = onUnreadMessagesUpdate;
    this.unreadMessagesCount = ref(0);

    this.ws = new WebSocket(`wss://localhost:7201/ws?username=${this.username}`);

    this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        console.log('WebSocket Ready State:', this.ws.readyState);
        console.log('WebSocket Buffered Amount:', this.ws.bufferedAmount);
    }

    this.ws.onmessage = (event) => {
      debugger
      // Handle incoming messages, update unread messages count
      this.onUnreadMessagesUpdate(event.data);
    };

    this.init();
  }

  async init() {
    this.getUnreadMessages();
  }

  async getUnreadMessages() {
    const response = await service_get(CallType.GetUnreadMessages, { username: this.username });
    this.unreadMessagesCount.value = JSON.parse(response.data);
  }

  unsubscribe() {
    this.ws.close();
  }

}

export { ChatService };
