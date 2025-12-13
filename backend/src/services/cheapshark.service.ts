import {
  CheapSharkGame,
  Product,
  ProductCategory,
  ProductCategoryEnum,
} from "../models/types";
import { dataService } from "./data.service";

const CHEAPSHARK_API_URL =
  process.env.CHEAPSHARK_API_URL || "https://www.cheapshark.com/api/1.0";

/**
 * Servicio para integración con CheapShark API
 */
class CheapSharkService {
  /**
   * Busca juegos en CheapShark API
   */
  async searchGames(searchTerm: string): Promise<CheapSharkGame[]> {
    try {
      const url = `${CHEAPSHARK_API_URL}/games?title=${encodeURIComponent(
        searchTerm
      )}`;
      console.log(`🎮 Consultando CheapShark API: "${searchTerm}"...`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Respuesta inesperada de CheapShark API");
      }

      const games = data as CheapSharkGame[];
      console.log(`✅ ${games.length} juegos encontrados en CheapShark`);

      return games;
    } catch (error) {
      console.error("❌ Error consultando CheapShark API:", error);
      throw error;
    }
  }

  /**
   * Importa juegos de CheapShark al catálogo
   */
  async importGames(
    searchTerm: string,
    category: ProductCategory = ProductCategoryEnum.AVENTURA,
    limit: number = 20
  ): Promise<Product[]> {
    try {
      const games = await this.searchGames(searchTerm);
      const limitedGames = games.slice(0, limit);

      const products = dataService.addCheapSharkProducts(
        limitedGames,
        category
      );
      return products;
    } catch (error) {
      console.error("❌ Error importando juegos de CheapShark:", error);
      throw error;
    }
  }
}

export const cheapSharkService = new CheapSharkService();
