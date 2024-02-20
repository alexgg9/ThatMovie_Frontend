import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'playlist',
    loadComponent: () => import('./playlist/playlist.page').then((m) => m.PlaylistPage)
  },
  {
    path: '',
    redirectTo: 'playlist',
    pathMatch: 'full',
  },

];
