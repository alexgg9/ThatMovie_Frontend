import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'playlist',
    loadComponent: () => import('./playlist/playlist.page').then((m) => m.PlaylistPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-profile',
    loadComponent: () => import('./user-profile/user-profile.page').then(m => m.UserProfilePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'movie-list/:id',
    loadComponent: () => import('./playlist/movie-list/movie-list.page').then(m => m.MovieListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reviews',
    loadComponent: () => import('./reviews/reviews.page').then(m => m.ReviewsPage),
    canActivate: [AuthGuard]
  },
];
