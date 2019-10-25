import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LogginService } from './loggin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
              private loggingService: LogginService) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.loggingService.printLog('Hello from AppComponent ngOnInit');
  }
}
