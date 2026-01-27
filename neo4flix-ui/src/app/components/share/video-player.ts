import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges, inject, signal, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-player-overlay" (click)="onOverlayClick($event)">
      <div class="video-player-container">
        <button class="close-button" (click)="onClose()">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div class="video-wrapper">
          <!-- Movie Title -->
          <div class="video-header" *ngIf="movieTitle">
            <h2 class="video-title">{{ movieTitle }}</h2>
            <p class="video-subtitle">Official Trailer</p>
          </div>
          <!-- Error Message -->
          <div class="error-message" *ngIf="hasError()">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p class="error-text">{{ errorMessage() }}</p>
            <button class="retry-button" (click)="retryVideo()">Retry</button>
          </div>
          <!-- Loading Spinner -->
          <div class="loading-spinner" *ngIf="isLoading() && !hasError()">
            <div class="spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
            </div>
            <p class="loading-text">Loading trailer...</p>
          </div>
          <!-- YouTube iFrame -->
          <iframe
            *ngIf="safeVideoUrl && !hasError()"
            [src]="safeVideoUrl"
            (load)="onVideoLoaded()"
            class="video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .video-player-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .video-player-container {
      position: relative;
      width: 90%;
      max-width: 1200px;
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      animation: slideUp 0.4s ease-out;
    }
    @keyframes slideUp {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .close-button {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.3s ease;
      color: white;
    }
    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }
    .video-wrapper {
      position: relative;
      width: 100%;
      padding-top: 56.25%; /* 16:9 Aspect Ratio */
      background: #000;
    }
    .video-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 24px;
      background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%);
      z-index: 2;
    }
    .video-title {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .video-subtitle {
      margin: 4px 0 0 0;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .video-iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    .loading-spinner,
    .error-message {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #000;
      z-index: 1;
    }
    .spinner {
      position: relative;
      width: 80px;
      height: 80px;
    }
    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 4px solid transparent;
      border-top-color: #e50914;
      border-radius: 50%;
      animation: spin 1.5s linear infinite;
    }
    .spinner-ring:nth-child(2) {
      border-top-color: #b20710;
      animation-delay: -0.5s;
    }
    .spinner-ring:nth-child(3) {
      border-top-color: #831010;
      animation-delay: -1s;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .loading-text,
    .error-text {
      margin-top: 24px;
      color: white;
      font-size: 1.1rem;
      font-weight: 500;
    }
    .error-message svg {
      opacity: 0.5;
    }
    .retry-button {
      margin-top: 24px;
      padding: 12px 32px;
      background: #e50914;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .retry-button:hover {
      background: #f40612;
      transform: scale(1.05);
    }
    @media (max-width: 768px) {
      .video-player-container {
        width: 95%;
        border-radius: 8px;
      }
      .close-button {
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
      }
      .video-header {
        padding: 16px;
      }
      .video-title {
        font-size: 1.3rem;
      }
      .video-subtitle {
        font-size: 0.8rem;
      }
    }
  `]
})
export class VideoPlayerComponent implements OnInit, OnChanges, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private movedToBody = false;

  ngOnDestroy() {
    try {
      const native = this.el?.nativeElement;
      if (native && native.parentElement === document.body) {
        document.body.removeChild(native);
      }
    } catch {
      // ignore
    }
  }
  private readonly sanitizer = inject(DomSanitizer);

  @Input() videoUrl?: string;
  @Input() movieTitle: string = '';
  @Output() closed = new EventEmitter<void>();

  safeVideoUrl: SafeResourceUrl | null = null;
  isLoading = signal(true);
  hasError = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    this.refreshUrl();
    // Ensure overlay is appended to document.body so position:fixed centers relative to viewport
    try {
      const native = this.el?.nativeElement;
      if (native && typeof document !== 'undefined' && native.parentElement !== document.body) {
        document.body.appendChild(native);
        this.movedToBody = true;
      }
    } catch {
      // ignore in non-browser environments
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoUrl']) {
      this.refreshUrl();
    }
  }

  private refreshUrl() {
    this.hasError.set(false);
    this.errorMessage.set('');

    const url = (this.videoUrl || '').trim();
    if (!url) {
      this.safeVideoUrl = null;
      this.hasError.set(true);
      this.errorMessage.set('No trailer available for this movie.');
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);

    try {
      const embedUrl = this.convertToEmbedUrl(url);
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } catch {
      this.safeVideoUrl = null;
      this.hasError.set(true);
      this.errorMessage.set('Invalid video URL.');
      this.isLoading.set(false);
    }
  }

  private convertToEmbedUrl(url: string): string {
    // If already an embed URL, return as is
    if (url.includes('/embed/')) {
      return url;
    }
    // Convert watch URL to embed URL
    // https://www.youtube.com/watch\?v\=VIDEO_ID -> https://www.youtube.com/embed/VIDEO_ID
    const videoIdMatch = url.match(/[?&]v=([^&]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
    }
    // If URL is in short format: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
    }
    // Return original if no conversion needed
    return url;
  }
  onVideoLoaded() {
    this.isLoading.set(false);
  }
  retryVideo() {
    this.hasError.set(false);
    this.isLoading.set(true);
    this.refreshUrl();
  }
  onClose() {
    this.closed.emit();
  }
  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('video-player-overlay')) {
      this.onClose();
    }
  }
}
