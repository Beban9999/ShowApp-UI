import { defineStore } from "pinia";
import { service_get, service_post, service_upload } from "../services/service_call";
import { CallType } from "../models/enums/CallType";

export const usePostsStore = defineStore("PostsStore", {
    state: () => ({
      posts_list: []
    }),
    actions: {
        async insertPost(title: string, description: string, price: number, files?: any){
          var response = await service_post(CallType.InsertPost, { Title: title, Description: description, Price: price });
          var post_id = JSON.parse(response.data);
          if(post_id != 0) {
            var resp = await service_upload(post_id, files);
            return JSON.parse(resp.data);
          } else {
            return false;
          }
        },
        async getPostsById(postId : number | null) {
          var response = await service_get(CallType.GetPosts, { id : postId});
          return JSON.parse(response.data);
        },
        async getAllPosts() {
          var response = await service_get(CallType.GetPosts);
          return JSON.parse(response.data);
        }
    },
    persist:{
        storage: sessionStorage
    }
  });