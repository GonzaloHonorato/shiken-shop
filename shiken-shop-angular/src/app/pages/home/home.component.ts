import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          🎮 ShikenShop
        </h1>
        <p class="text-xl text-gray-700 mb-6">
          Tienda de Videojuegos - Página Principal
        </p>
        <p class="text-gray-600">
          Componente temporal - Se migrará desde index.html original
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {

}