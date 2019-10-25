import { Injectable } from '@angular/core';


// @Injectable({providedIn: 'root'})
export class LogginService {
    lastlog: string;

    printLog(message) {
        console.log(message);
        console.log(this.lastlog);
        this.lastlog = message;
    }
}
