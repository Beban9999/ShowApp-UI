export class Message {
    public roomId: number = 0;
    public senderId: string = '';
    public receiverId: string = '';
    public content: string = '';
    public date: string = '';
    public timestamp: string = '';

    constructor(roomId: number, senderId: string, content: string, date: string, timestamp: string) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.content = content;
        this.date = date;
        this.timestamp = timestamp;
    }
}
