export interface DetalleCotizacion {
  id?: string;
  cotizacion_id?: string;
  item: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Cotizacion {
  id?: string;
  cliente: string;
  porcentaje_desperdicio: number;
  mano_obra: number;
  margen_esperado: number;
  costo_total_materiales?: number;
  costo_con_desperdicio?: number;
  precio_venta?: number;
}
