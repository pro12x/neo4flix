import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { HomeComponent } from './components/home/home';
import { MovieDetailsComponent } from './components/movies/movie-details';
import { SearchComponent } from './components/search/search';
import { WatchlistComponent } from './components/watchlist/watchlist';
import { RatingsComponent } from './components/ratings/ratings';
import { RecommendationsComponent } from './components/recommendations/recommendations';
import { ShareComponent } from './components/share/share';
import { RegisterComponent } from './components/auth/register/register';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/auth/login/login';

export const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  {
    path: 'browse',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'movies/:id',
    component: MovieDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [authGuard],
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
    canActivate: [authGuard],
  },
  {
    path: 'ratings',
    component: RatingsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'recommendations',
    component: RecommendationsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'share',
    component: ShareComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' }
];
