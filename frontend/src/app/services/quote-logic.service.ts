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
    margen_esperado: 35
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
   * Adds a new detail to the list
   */
  addDetalle(item: string, precio: number) {
    const nuevo: DetalleCotizacion = {
      item,
      precio_unitario: precio,
      cantidad: 1,
      subtotal: precio
    };
    this.detalles.update(prev => [...prev, nuevo]);
  }

  /**
   * Updates a row's subtotal based on its quantity
   */
  updateDetalle(index: number, cantidad: number) {
    this.detalles.update(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        cantidad: cantidad,
        subtotal: cantidad * copy[index].precio_unitario
      };
      return copy;
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
      porcentaje_desperdicio: 10,
      mano_obra: 0,
      margen_esperado: 35
    });
  }
}
