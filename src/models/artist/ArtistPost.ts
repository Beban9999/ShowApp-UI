import { ArtistMedia } from "./ArtistMedia";

export class ArtistPost {
    public Id: number = 0;
    public Description: string = "";
    public CreatedDate: string = "";
    public UserId: number = 0;
    public Media: ArtistMedia[];

    constructor() {
        this.Media = [];
    }
}