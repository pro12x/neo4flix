import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="landing-container">
      <!-- Animated Background Video -->
      <div class="background-video">
        <div class="video-overlay"></div>
        <div class="particles-container">
          <div class="particle" *ngFor="let particle of particles"></div>
        </div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>

      <!-- Header -->
      <header class="landing-header">
        <div class="logo">
          <span class="logo-text">NEO4FLIX</span>
          <div class="logo-glow"></div>
        </div>
        <a routerLink="/login" class="btn-signin">
          <span>Sign In</span>
          <div class="btn-glow"></div>
        </a>
      </header>

      <!-- Main Hero Content -->
      <main class="hero-content">
        <div class="hero-text">
          <h1 class="main-title">
            <span class="title-line">Unlimited movies,</span>
            <span class="title-line">TV shows, and more.</span>
          </h1>
          <h2 class="subtitle">Watch anywhere. Cancel anytime.</h2>
          <p class="description">
            Ready to watch? Enter your email to create or restart your membership.
          </p>
        </div>

        <div class="cta-section">
          <div class="cta-form">
            <div class="input-wrapper">
              <input
                type="email"
                placeholder="Email address"
                class="email-input"
                [(ngModel)]="email"
              />
              <div class="input-focus"></div>
            </div>
            <button class="btn-get-started" routerLink="/register">
              <span class="btn-text">Get Started</span>
              <svg class="btn-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              <div class="btn-ripple"></div>
            </button>
          </div>
        </div>

        <!-- Features Preview -->
        <div class="features-preview">
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <span>Watch on TV</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12" y2="18"/>
              </svg>
            </div>
            <span>Watch on Mobile</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10,8 16,12 10,16 10,8"/>
              </svg>
            </div>
            <span>Watch Everywhere</span>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow-x: hidden;
      background: #000000;
    }

    .landing-container {
      position: relative;
      height: 100vh;
      overflow: hidden;
    }

    /* Animated Background */
    .background-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.8) 0%,
        rgba(20, 20, 40, 0.6) 50%,
        rgba(0, 0, 0, 0.8) 100%
      );
      backdrop-filter: blur(1px);
    }

    /* Particles Animation */
    .particles-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: float 20s infinite linear;
    }

    .particle:nth-child(1) { width: 4px; height: 4px; left: 10%; animation-delay: 0s; }
    .particle:nth-child(2) { width: 6px; height: 6px; left: 20%; animation-delay: 2s; }
    .particle:nth-child(3) { width: 3px; height: 3px; left: 30%; animation-delay: 4s; }
    .particle:nth-child(4) { width: 5px; height: 5px; left: 40%; animation-delay: 6s; }
    .particle:nth-child(5) { width: 4px; height: 4px; left: 50%; animation-delay: 8s; }
    .particle:nth-child(6) { width: 7px; height: 7px; left: 60%; animation-delay: 10s; }
    .particle:nth-child(7) { width: 3px; height: 3px; left: 70%; animation-delay: 12s; }
    .particle:nth-child(8) { width: 5px; height: 5px; left: 80%; animation-delay: 14s; }
    .particle:nth-child(9) { width: 4px; height: 4px; left: 90%; animation-delay: 16s; }
    .particle:nth-child(10) { width: 6px; height: 6px; left: 95%; animation-delay: 18s; }

    @keyframes float {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }

    /* Floating Shapes */
    .floating-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .shape {
      position: absolute;
      background: linear-gradient(45deg, rgba(229, 9, 20, 0.1), rgba(178, 7, 16, 0.1));
      border: 1px solid rgba(229, 9, 20, 0.2);
      animation: shapeFloat 25s infinite linear;
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 60px;
      height: 60px;
      border-radius: 20px;
      top: 60%;
      right: 15%;
      animation-delay: 8s;
    }

    .shape-3 {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      top: 40%;
      right: 5%;
      animation-delay: 15s;
    }

    @keyframes shapeFloat {
      0% {
        transform: translateY(0px) rotate(0deg) scale(1);
        opacity: 0.3;
      }
      25% {
        transform: translateY(-20px) rotate(90deg) scale(1.1);
        opacity: 0.6;
      }
      50% {
        transform: translateY(-40px) rotate(180deg) scale(0.9);
        opacity: 0.4;
      }
      75% {
        transform: translateY(-20px) rotate(270deg) scale(1.05);
        opacity: 0.5;
      }
      100% {
        transform: translateY(0px) rotate(360deg) scale(1);
        opacity: 0.3;
      }
    }

    /* Header */
    .landing-header {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 4rem;
      animation: headerSlideIn 1s ease-out;
    }

    @keyframes headerSlideIn {
      from {
        transform: translateY(-100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .logo {
      position: relative;
      font-size: 2.5rem;
      font-weight: 700;
      color: #e50914;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05);
    }

    .logo-text {
      background: linear-gradient(45deg, #e50914, #b20710);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      z-index: 2;
    }

    .logo-glow {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #e50914, #b20710);
      border-radius: 8px;
      opacity: 0;
      z-index: 1;
      transition: opacity 0.3s ease;
      filter: blur(8px);
    }

    .logo:hover .logo-glow {
      opacity: 0.3;
    }

    .btn-signin {
      position: relative;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
    }

    .btn-signin:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
    }

    .btn-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, #f40612, #d01018);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .btn-signin:hover .btn-glow {
      opacity: 1;
    }

    .btn-signin span {
      position: relative;
      z-index: 2;
    }

    /* Hero Content */
    .hero-content {
      position: relative;
      z-index: 5;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      text-align: center;
      animation: contentFadeIn 1.5s ease-out 0.5s both;
    }

    @keyframes contentFadeIn {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .hero-text {
      margin-bottom: 3rem;
    }

    .main-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 1rem;
      line-height: 1.1;
    }

    .title-line {
      display: block;
      background: linear-gradient(45deg, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: titleGlow 3s ease-in-out infinite alternate;
    }

    .title-line:nth-child(2) {
      animation-delay: 1.5s;
    }

    @keyframes titleGlow {
      from {
        filter: brightness(1);
      }
      to {
        filter: brightness(1.2);
      }
    }

    .subtitle {
      font-size: clamp(1.25rem, 2.5vw, 1.875rem);
      font-weight: 400;
      color: rgba(255, 255, 255, 0.9);
      margin: 1.5rem 0;
    }

    .description {
      font-size: clamp(1rem, 2vw, 1.25rem);
      color: rgba(255, 255, 255, 0.8);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* CTA Section */
    .cta-section {
      margin: 3rem 0;
    }

    .cta-form {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .input-wrapper {
      position: relative;
      min-width: 300px;
      flex: 1;
      max-width: 500px;
    }

    .email-input {
      width: 100%;
      padding: 1.25rem 1.5rem;
      font-size: 1.1rem;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: #ffffff;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .email-input:focus {
      outline: none;
      border-color: #e50914;
      background: rgba(0, 0, 0, 0.8);
      box-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
    }

    .email-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .input-focus {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 8px;
      background: linear-gradient(45deg, #e50914, #b20710);
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease;
      filter: blur(8px);
    }

    .email-input:focus + .input-focus {
      opacity: 0.1;
    }

    .btn-get-started {
      position: relative;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1.25rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
      min-width: 180px;
      justify-content: center;
    }

    .btn-get-started:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(229, 9, 20, 0.5);
    }

    .btn-text {
      position: relative;
      z-index: 2;
    }

    .btn-arrow {
      position: relative;
      z-index: 2;
      transition: transform 0.3s ease;
    }

    .btn-get-started:hover .btn-arrow {
      transform: translateX(4px);
    }

    .btn-ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .btn-get-started:active .btn-ripple {
      width: 300px;
      height: 300px;
    }

    /* Features Preview */
    .features-preview {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-top: 4rem;
      animation: featuresSlideUp 1s ease-out 1s both;
    }

    @keyframes featuresSlideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      transform: translateY(-5px);
      color: #ffffff;
    }

    .feature-icon {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .feature-item:hover .feature-icon {
      background: rgba(229, 9, 20, 0.2);
      border-color: #e50914;
      transform: scale(1.1);
    }

    .feature-icon svg {
      width: 24px;
      height: 24px;
      color: #ffffff;
    }

    .feature-item span {
      font-size: 0.9rem;
      font-weight: 500;
      text-align: center;
    }

    /* Scroll Indicator */
    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.6);
      animation: bounce 2s infinite;
      z-index: 10;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
      }
      40% {
        transform: translateX(-50%) translateY(-10px);
      }
      60% {
        transform: translateX(-50%) translateY(-5px);
      }
    }

    .scroll-mouse {
      width: 24px;
      height: 36px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      position: relative;
    }

    .scroll-wheel {
      width: 4px;
      height: 8px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 2px;
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      animation: scrollWheel 2s infinite;
    }

    @keyframes scrollWheel {
      0% {
        transform: translateX(-50%) translateY(0);
        opacity: 0;
      }
      50% {
        transform: translateX(-50%) translateY(8px);
        opacity: 1;
      }
      100% {
        transform: translateX(-50%) translateY(16px);
        opacity: 0;
      }
    }

    .scroll-indicator span {
      font-size: 0.8rem;
      font-weight: 300;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .landing-header {
        padding: 1.5rem 2rem;
      }

      .logo {
        font-size: 2rem;
      }

      .btn-signin {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }

      .hero-content {
        padding: 0 1rem;
      }

      .main-title {
        font-size: 2.5rem;
      }

      .cta-form {
        flex-direction: column;
        gap: 1rem;
      }

      .input-wrapper {
        min-width: auto;
        width: 100%;
        max-width: none;
      }

      .email-input {
        font-size: 1rem;
        padding: 1rem;
      }

      .btn-get-started {
        width: 100%;
        font-size: 1.1rem;
      }

      .features-preview {
        flex-direction: column;
        gap: 1.5rem;
        margin-top: 2rem;
      }

      .feature-item {
        flex-direction: row;
        gap: 1rem;
      }

      .feature-icon {
        width: 40px;
        height: 40px;
      }

      .feature-icon svg {
        width: 20px;
        height: 20px;
      }

      .scroll-indicator {
        bottom: 1rem;
      }
    }
  `]
})
export class LandingComponent {
  email: string = '';
  particles: number[] = Array(10).fill(0);
}
