import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { Post } from './post.model';


@Injectable({providedIn: 'root'})
export class PostsService {

  constructor(private http: HttpClient) {}



  createAndStorePost(title: string, content: string) {
    const postData: Post = {title: title, content: content};
    this.http
    .post<{ name: string }>(
      'https://http-tutorial-1a6b0-default-rtdb.firebaseio.com/posts.json', postData
    ).subscribe(responseData => {
      console.log(responseData);
    });
  }

  fetchPosts() {

    this.http
    .get<{ [key: string]: Post }>('https://http-tutorial-1a6b0-default-rtdb.firebaseio.com/posts.json')
    .pipe(
      map((responseData) => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }
        return postsArray; //this is forwarded to our subscribe function
      })
  )
  .subscribe(posts => {

  });
}

}
