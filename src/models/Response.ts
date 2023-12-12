import { RequestStatus } from "./enums/RequestStatus";

export class Response
{
    public Status: RequestStatus = 0;
    public Message: string = "";
    public Data: string = "";
}