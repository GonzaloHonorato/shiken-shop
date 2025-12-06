import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { NotificationComponent } from './components/layout/notification/notification.component';
import { DataService } from './services/data.service';

// Declaración global para TypeScript
declare global {
  interface Window {
    resetShikenData: () => Promise<void>;
    shikenDataService: DataService;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('shiken-shop-angular');
  private dataService = inject(DataService);

  constructor() {
    // Exponer métodos útiles en la consola para desarrollo
    if (typeof window !== 'undefined') {
      window.resetShikenData = async () => {
        console.log('🔄 Reseteando datos de ShikenShop...');
        await this.dataService.resetAllData();
        console.log('✅ Datos reseteados. Recargando página...');
        window.location.reload();
      };
      window.shikenDataService = this.dataService;

      console.log('🎮 ShikenShop Debug Tools:');
      console.log('  - resetShikenData(): Resetea todos los datos y recarga la página');
      console.log('  - shikenDataService: Acceso directo al servicio de datos');
    }
  }
}
