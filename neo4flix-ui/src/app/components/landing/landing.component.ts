import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="landing-container">
      <header class="landing-header">
        <div class="logo">NEO4FLIX</div>
        <a routerLink="/login" class="btn-signin">Sign In</a>
      </header>
      <main class="hero-content">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>Ready to watch? Enter your email to create or restart your membership.</p>
        <div class="cta-form">
          <input type="email" placeholder="Email address" />
          <button class="btn-get-started" routerLink="/register">Get Started ></button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%), url('https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7244cc449/f131061c-f020-4562-b029-5d463f624855/FR-en-20240311-popsignuptwoweeks-perspective_alpha_website_large.jpg');
      background-size: cover;
      background-position: center;
    }
    .landing-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 3rem;
    }
    .logo {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    .btn-signin {
      background-color: var(--primary-color);
      color: var(--text-color);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
    }
    .hero-content {
      max-width: 950px;
      margin: 15vh auto 0;
      text-align: center;
      color: var(--text-color);
    }
    .hero-content h1 {
      font-size: 3.5rem;
      font-weight: 900;
    }
    .hero-content h2 {
      font-size: 1.75rem;
      font-weight: 400;
      margin: 1rem 0;
    }
    .hero-content p {
      font-size: 1.2rem;
    }
    .cta-form {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
      gap: 8px;
    }
    .cta-form input {
      width: 450px;
      padding: 1.2rem 1rem;
      font-size: 1rem;
      background-color: rgba(22, 22, 22, 0.7);
      border: 1px solid #888;
      border-radius: 4px;
      color: var(--text-color);
    }
    .btn-get-started {
      background-color: var(--primary-color);
      color: var(--text-color);
      padding: 1rem 2rem;
      border: none;
      border-radius: 4px;
      font-size: 1.5rem;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
    }
  `]
})
export class LandingComponent {}
