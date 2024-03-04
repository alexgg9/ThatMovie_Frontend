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
  {
    path: 'user-profile',
    loadComponent: () => import('./user-profile/user-profile.page').then( m => m.UserProfilePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'movie-list',
    loadComponent: () => import('./playlist/movie-list/movie-list.page').then( m => m.MovieListComponent)
  },


];
