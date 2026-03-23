import { Injectable, computed, signal } from '@angular/core';
import { Cotizacion, DetalleCotizacion } from '../models/cotizacion.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteLogicService {
  // Base quotation state
  public cotizacion = signal<Cotizacion>({
    cliente: '',
    porcentaje_desperdicio: 10,
    mano_obra: 0,
    margen_esperado: 35,
    temporada: 'Regular'
  });

  // Details list
  public detalles = signal<DetalleCotizacion[]>([]);

  // Derived calculations via computed signals
  public subtotal = computed(() => {
    return this.detalles().reduce((acc, curr) => acc + curr.subtotal, 0);
  });

  public totalConDesperdicio = computed(() => {
    const s = this.subtotal();
    const d = this.cotizacion().porcentaje_desperdicio;
    return s * (1 + d / 100);
  });

  public precioVenta = computed(() => {
    const costoBase = this.totalConDesperdicio() + this.cotizacion().mano_obra;
    const margen = this.cotizacion().margen_esperado;
    if (margen >= 100) return 0;
    return costoBase / (1 - margen / 100);
  });

  /**
   * Adds a new item to the details list
   */
  addDetalle(item: any, type: 'flower' | 'supply', currentSeason: string) {
    const defaultPrice = type === 'flower' 
      ? (currentSeason === 'Regular' ? item.costo_regular : currentSeason === 'Alta' ? item.costo_alta : item.costo_local)
      : item.costo_unitario;

    const nuevo: any = {
      id_referencia: item.id,
      item: item.nombre,
      tipo: type,
      precio_original: defaultPrice,
      precio_unitario: defaultPrice,
      cantidad: 1,
      color: '',
      es_precio_manual: false,
      subtotal: defaultPrice
    };
    this.detalles.update(prev => [...prev, nuevo]);
  }

  /**
   * Updates a detail based on index and new values
   */
  updateDetalleRow(index: number, updates: any) {
    this.detalles.update(prev => {
      const copy = [...prev];
      const updatedItem = { ...copy[index], ...updates };
      
      // Mark as manual if the price is changed from the original
      if (updates.precio_unitario !== undefined) {
        updatedItem.es_precio_manual = updates.precio_unitario !== updatedItem.precio_original;
      }

      updatedItem.subtotal = updatedItem.cantidad * updatedItem.precio_unitario;
      copy[index] = updatedItem;
      return copy;
    });
  }

  /**
   * Re-calculates prices for all flowers when the season changes
   */
  applySeasonChange(newSeason: string, catalogFlores: any[]) {
    this.detalles.update(prev => {
      return prev.map(detalle => {
        if (detalle.tipo === 'flower' && !detalle.es_precio_manual) {
          const item = catalogFlores.find(f => f.id === detalle.id_referencia);
          if (item) {
            const newPrice = newSeason === 'Regular' ? item.costo_regular : newSeason === 'Alta' ? item.costo_alta : item.costo_local;
            return {
              ...detalle,
              precio_original: newPrice,
              precio_unitario: newPrice,
              subtotal: detalle.cantidad * newPrice
            };
          }
        }
        return detalle;
      });
    });
  }

  /**
   * Removes a detail
   */
  removeDetalle(index: number) {
    this.detalles.update(prev => prev.filter((_, i) => i !== index));
  }

  /**
   * Resets the quotation state
   */
  reset() {
    this.detalles.set([]);
    this.cotizacion.set({
      cliente: '',
      temporada: 'Regular',
      porcentaje_desperdicio: 10,
      mano_obra: 0,
      margen_esperado: 35
    });
  }
}
