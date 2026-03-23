export interface DetalleCotizacion {
  id?: string;
  cotizacion_id?: string;
  id_referencia?: string;
  item: string;
  tipo: 'flower' | 'supply';
  cantidad: number;
  precio_original: number;
  precio_unitario: number;
  subtotal: number;
  color?: string;
  es_precio_manual?: boolean;
}

export interface Cotizacion {
  id?: string;
  cliente: string;
  temporada: 'Regular' | 'Alta' | 'Local';
  porcentaje_desperdicio: number;
  mano_obra: number;
  margen_esperado: number;
  costo_total_materiales?: number;
  costo_con_desperdicio?: number;
  precio_venta?: number;
}
