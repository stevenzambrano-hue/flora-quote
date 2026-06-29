import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { GenericTableComponent, TableColumn } from '../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-colores',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './colores.component.html'
})
export class ColoresComponent implements OnInit {
  private api = inject(SupabaseService);
  private fb = inject(FormBuilder);

  items = signal<any[]>([]);
  isEditing = signal(false);
  editMode = signal<'create' | 'edit'>('create');
  selectedId = signal<string | null>(null);

  cols: TableColumn[] = [
    { field: 'nombre', header: 'Name', type: 'text' },
    { field: 'codigo_hex', header: 'Hex Code', type: 'color' }
  ];

  form = this.fb.group({
    nombre: ['', Validators.required],
    codigo_hex: ['#000000', [Validators.required]]
  });

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.getAll('colores').subscribe(res => this.items.set(res));
  }

  openCreate() {
    this.form.reset({ codigo_hex: '#000000' });
    this.editMode.set('create');
    this.isEditing.set(true);
  }

  openEdit(row: any) {
    this.selectedId.set(row.id);
    this.form.patchValue(row);
    this.editMode.set('edit');
    this.isEditing.set(true);
  }

  save() {
    if (this.form.invalid) return;

    const resource = 'colores';
    const data = this.form.value;

    const op = this.editMode() === 'create' 
      ? this.api.create(resource, data)
      : this.api.update(resource, this.selectedId()!, data);

    op.subscribe({
      next: () => {
        this.isEditing.set(false);
        this.refresh();
      },
      error: (err) => alert('Error saving color: ' + err.message)
    });
  }

  deleteItem(id: string) {
    if (confirm('Are you sure you want to delete this color?')) {
      this.api.delete('colores', id).subscribe({
        next: () => this.refresh(),
        error: (err) => alert('Error deleting color (record might be linked): ' + err.message)
      });
    }
  }
}
