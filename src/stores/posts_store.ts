import { defineStore } from "pinia";

export const usePostsStore = defineStore("PostsStore", {
    state: () => ({
      posts_list: []
    }),
    actions: {
        async insertPost(title: string, description: string, price: number){
            try {
                const apiUrl = 'https://localhost:7201/api/Posts';
                const requestBody = {
                  title: title,
                  description: description,
                  price: price
                };
            
                const response = await fetch(apiUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(requestBody),
                });
            
                if (response.ok) {
                  const data  = await response.json();
                  console.log(data); // The result from the API
                  return data;
                } else {
                  console.error('Inserting of the new post failed');
                }
              } catch (error) {
                console.error('An error occurred while inserting a post:', error);
              }
        },
        async getPostsById(postId : number | null) {
          try {
            let apiUrl = 'https://localhost:7201/api/Posts/posts';
            
            // Append the postId as a query parameter if provided
            if (postId) {
              apiUrl += `?id=${postId}`;
            }
        
            const response = await fetch(apiUrl);
        
            if (response.ok) {
              const data = await response.json();
              console.log(data); // The result from the API
              return data;
            } else {
              console.error('Failed to retrieve posts');
            }
          } catch (error) {
            console.error('An error occurred while retrieving posts:', error);
          }
        }
    },
    persist:{
        storage: sessionStorage
    }
  });