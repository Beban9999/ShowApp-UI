import { ArtistPost } from "./ArtistPost";

export class Artist {
    public UserId: number = 0;
    public Name: string = "";
    public Type: string = "";
    public Price: number = 0;
    public Description: string = "";
    public Location: string = "";
    public Avatar: string = "";
    public Genres: string[];
    public Posts: ArtistPost[];
    public Dates: string[];

    constructor() {
        this.Genres = [];
        this.Posts = [];
        this.Dates = [];
    }
}