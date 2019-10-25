import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject, of } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    private BASE_ENDPOINT = 'https://identitytoolkit.googleapis.com/v1/';

    constructor(private http: HttpClient,
                private router: Router) {

    }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.BASE_ENDPOINT + 'accounts:signUp?key=' + environment.API_KEY,
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
        return this.http.post<AuthResponseData>(
            this.BASE_ENDPOINT + 'accounts:signInWithPassword?key=' + environment.API_KEY,
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

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(userData.email,
                                    userData.id,
                                    userData._token,
                                    new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.logout();
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) { } {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuth(email: string, userId: string, token: string , expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
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
