import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    locaId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new Subject<User>();

    private BASE_ENDPOINT = 'https://identitytoolkit.googleapis.com/v1/';
    private API_KEY = 'AIzaSyDlPJSv-iU5ODqUU4eL74zkmsiZOVkKvco';

    constructor(private http: HttpClient) {

    }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.BASE_ENDPOINT + 'accounts:signUp?key=' + this.API_KEY,
            {
                email,
                password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError),
            tap(resData => {
               this.handleAuth(resData.email, resData.locaId, resData.idToken, +resData.expiresIn);
            }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(this.BASE_ENDPOINT + 'accounts:signInWithPassword?key=' + this.API_KEY,
        {
            email,
            password,
            returnSecureToken: true
        })
        .pipe(catchError(this.handleError),
        tap(resData => {
            this.handleAuth(resData.email, resData.locaId, resData.idToken, +resData.expiresIn);
         }));
    }

    private handleAuth(email: string, userId: string, token: string , expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unkown error occurred';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS' :
                errorMessage = 'This email already exists';
                break;
            case 'EMAIL_NOT_FOUND' :
                errorMessage = 'This email does not exists';
                break;
            case 'INVALID_PASSWORD' :
                errorMessage = 'This password is not correct';
                break;
        }
        return throwError(errorMessage);
    }
}
