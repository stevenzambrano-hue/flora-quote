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
  templateUrl: './generic-table.component.html'
})
export class GenericTableComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  
  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<string>();
}
