import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts()"
           class="toast toast-{{toast.type}}"
           [@toastAnimation]>
        {{ toast.message }}
        <button (click)="toastService.remove(toast.id)" class="close-btn">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      padding: 15px 20px;
      border-radius: 5px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 300px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    }
    .toast-success { background-color: #28a745; }
    .toast-error { background-color: #dc3545; }
    .toast-info { background-color: #17a2b8; }
    .close-btn {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      margin-left: 15px;
    }
  `],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ])
  ]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
