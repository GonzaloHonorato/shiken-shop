import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="pt-16 pb-20 px-4">
      <div class="container mx-auto text-center">
        <h2 class="text-5xl md:text-7xl font-bold text-white mb-6">
          Bienvenido a <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">ShikenShop</span>
        </h2>
        <p class="text-xl md:text-2xl text-gray-300 mb-8">
          Tu destino definitivo para los mejores videojuegos
        </p>
        <button class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transform transition-all duration-300">
          Explorar Categorías
        </button>
      </div>
    </section>

    <!-- Temporary Development Notice -->
    <section class="py-12 px-4">
      <div class="container mx-auto text-center">
        <div class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
          <h3 class="text-2xl font-bold text-purple-400 mb-4">
            🚧 En Desarrollo - Fase 2
          </h3>
          <p class="text-gray-300 mb-4">
            Este es un componente temporal. Se migrará el contenido completo desde index.html original.
          </p>
          <div class="text-sm text-gray-400">
            <p>✅ Header Component - Completado</p>
            <p>⏳ Home Content - Siguiente tarea</p>
            <p>⏳ Footer Component - Pendiente</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class HomeComponent {

}