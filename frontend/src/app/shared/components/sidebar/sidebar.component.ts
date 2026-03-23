import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col z-50">
      <div class="p-6">
        <h1 class="text-2xl font-bold flex items-center gap-2">
           <span class="text-indigo-400">Flora</span>Quote
        </h1>
      </div>

      <nav class="flex-1 mt-10 px-4 space-y-2 overflow-y-auto pb-6">
        <a routerLink="/dashboard" routerLinkActive="bg-slate-800 text-indigo-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          Dashboard
        </a>
        <a routerLink="/quotations" routerLinkActive="bg-slate-800 text-indigo-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          Quotations
        </a>
        
        <div class="pt-8 mb-4 px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Master Data</div>
        
        <a routerLink="/flowers" routerLinkActive="bg-slate-800 text-indigo-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 16.5A4.5 4.5 0 1 0 7.5 12"/><path d="M12 7.5A4.5 4.5 0 1 0 16.5 12"/><path d="M12 12V3"/><path d="M12 12v9"/><path d="M12 12H3"/><path d="M12 12h9"/></svg>
          Flowers
        </a>
        <a routerLink="/boxes" routerLinkActive="bg-slate-800 text-indigo-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          Boxes
        </a>
        <a routerLink="/colors" routerLinkActive="bg-slate-800 text-indigo-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.4 2.1-1.1.2-.3.4-.6.7-.8.3-.2.8-.2 1.1-.1.5.1 1.2.2 1.7.2 2.4 0 4.4-2 4.4-4.4 0-.5-.1-1.1-.2-1.7-.1-.3-.1-.8.1-1.1.2-.3.5-.5.8-.7.7-.5 1.1-1.2 1.1-2.1 0-5.5-4.5-10-10-10z"/></svg>
          Colors
        </a>
        <a routerLink="/supplies" routerLinkActive="bg-slate-800 text-indigo-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/></svg>
          Supplies
        </a>
        <a routerLink="/accessories" routerLinkActive="bg-slate-800 text-indigo-400" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M6 14h8"/><path d="M10 10V4.5a2.5 2.5 0 0 0-5 0V10"/><path d="M14 10V4.5a2.5 2.5 0 0 1 5 0V10"/><path d="M18 20V10"/><path d="M2 20V10"/><path d="M20 12h2v4h-2z"/><path d="M2 12h2v4H2z"/></svg>
          Accessories
        </a>
      </nav>

      <div class="p-6 border-t border-slate-800">
        <p class="text-[10px] text-slate-500 uppercase tracking-widest text-center">FloraQuote v1.2</p>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {}
