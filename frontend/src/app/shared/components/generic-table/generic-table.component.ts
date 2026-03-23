import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  field: string;
  header: string;
  type?: 'currency' | 'text' | 'boolean' | 'color';
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      
      <!-- Table Header Action -->
      <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <h3 class="font-bold text-slate-800 text-lg uppercase tracking-wider text-xs">{{ title }}</h3>
        <button 
          (click)="onAdd.emit()"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y1="19"></line><line x1="5" y1="12" x2="19" y1="12"></line></svg>
          Add New
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50">
            <tr>
              @for (col of columns; track col.field) {
                <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{{ col.header }}</th>
              }
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (row of data; track row.id) {
              <tr class="hover:bg-indigo-50/20 transition-colors group">
                @for (col of columns; track col.field) {
                  <td class="px-6 py-5 text-sm">
                    @if (col.type === 'currency') {
                      <span class="font-semibold text-slate-800">{{ row[col.field] | currency }}</span>
                    } @else if (col.type === 'color') {
                      <div class="flex items-center gap-3 font-medium text-slate-600">
                        <div class="w-6 h-6 rounded-full border border-slate-200" [style.backgroundColor]="row[col.field]"></div>
                        {{ row[col.field] }}
                      </div>
                    } @else if (col.type === 'boolean') {
                       <span class="px-3 py-1 rounded-full text-xs font-bold" [ngClass]="row[col.field] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                         {{ row[col.field] ? 'YES' : 'NO' }}
                       </span>
                    } @else {
                      <span class="font-medium text-slate-600">{{ row[col.field] }}</span>
                    }
                  </td>
                }
                <!-- Actions -->
                <td class="px-6 py-5">
                  <div class="flex items-center justify-center gap-2">
                    <button (click)="onEdit.emit(row)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button (click)="onDelete.emit(row.id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y1="17"></line><line x1="14" y1="11" x2="14" y1="17"></line></svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="columns.length + 1" class="px-6 py-20 text-center text-slate-400 italic">
                  No records found in this catalog.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class GenericTableComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  
  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<string>();
}
