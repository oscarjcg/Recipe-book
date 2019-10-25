import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubs: Subscription;
  isAuthenticated = false;
  collapsed = true;

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService) { }

  ngOnInit() {
    this.userSubs = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log(this.isAuthenticated);
    });

    console.log(this.isAuthenticated);
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }
}
