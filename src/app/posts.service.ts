import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject, catchError, throwError, tap } from 'rxjs';

import { Post } from './post.model';



@Injectable({providedIn: 'root'})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}



  createAndStorePost(title: string, content: string) {
    const postData: Post = {title: title, content: content};
    this.http
    .post<{ name: string }>(
      'https://http-tutorial-1a6b0-default-rtdb.firebaseio.com/posts.json', postData,
      {
        observe: 'response'
      }
    )
    .subscribe(
      responseData => {
      console.log(responseData);
    },
    error => {
      this.error.next(error.message);
    }
  );
  }


  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');

    return this.http
      .get<{ [key: string]: Post }>( // Ensure the response type is defined here
        'https://http-tutorial-1a6b0-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ "Custom-Header": 'Hello' }), // Custom header for the request
          params: searchParams,         // Query params for the request
          responseType: 'json'
        }
      )
      .pipe(
        map((responseData: { [key: string]: Post }) => { // Type assertion for responseData
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray; // Return the transformed posts array to the subscriber
        }),
        catchError(errorRes => {
          // Handle errors, e.g., log or send to an analytics server
          return throwError(() => errorRes); // Using throwError with an error factory function
        })
      ); // Ensures the pipe() is closed here
  }


  deletePosts() {
    return this.http.delete('https://http-tutorial-1a6b0-default-rtdb.firebaseio.com/posts.json', {
      observe: 'events',
      responseType: 'text'
    })
    .pipe(
      tap(event => {
        console.log(event);
        if (event.type === HttpEventType.Sent) {
          // ...
        }
        if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      })
    );
  }


}
