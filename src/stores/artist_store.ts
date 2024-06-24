import { defineStore } from "pinia";
import { service_get, service_post, service_upload_media } from "../services/service_call";
import { CallType } from "../models/enums/CallType";
import { useAuthenticationStore } from "./auth_store";
import { Artist } from "../models/artist/Artist";
const authStore = useAuthenticationStore();

export const useArtistStore = defineStore("ArtistStore", {
    actions: {
        async getUserData(username: string) {
            const userData = await service_get(CallType.GetUser, { username: username });
            authStore.userData = JSON.parse(userData.data);
        },
        async getAllArtists() {
            var response = await service_get(CallType.GetArtists);
            return JSON.parse(response.data);
        },

        async getArtistData(userId: number): Promise<Artist> {
            const response = await service_get(CallType.GetArtists, { userId: userId });
            const data: [Artist] = JSON.parse(response.data);
            const artistData : Artist = data[0];
            return artistData;
        },

        async getTypes() {
            var response = await service_get(CallType.GetArtistTypes);
            const typesArray = JSON.parse(response.data);
            if (Array.isArray(typesArray)) {
                return typesArray; 
            } else {
                return []; 
            }
        },

        async getGenres() {
            var response = await service_get(CallType.GetArtstGenres);
            const genresArray = JSON.parse(response.data);
            if (Array.isArray(genresArray)) {
                return genresArray; 
            } else {
                return []; 
            }
        },

        async insertPost(description: string, files?: any){
            var userid = authStore.userData.UserId;
            var response = await service_post(CallType.InsertPost, { UserId: userid, Description: description });
            var post_id = JSON.parse(response.data);
            if(post_id != 0 && files.length > 0) {
              var resp = await service_upload_media(userid, files, false, post_id);
              return JSON.parse(resp.data);
            } else {
              return false;
            }
        },

        async becomeArtist(name: string, description: string, price: number, type: number, location: string, genre: any[], files?: any){
            var userId = authStore.userData.UserId;
            var response = await service_post(CallType.BecomeArtist, { UserId: userId, Name: name, Description: description, Price: price, TypeId: type, Location: location, Genre: genre});
            console.log("Artis created: " + JSON.parse(response.data));
            if(JSON.parse(response.data) && files.length == 1) {
                var resp = await service_upload_media(userId, files, true);
                return JSON.parse(resp.data);
            } else {
                return false;
            }
        }
    },
    persist:{
        storage: sessionStorage
    }
  });