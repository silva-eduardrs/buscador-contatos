import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [HeaderComponent, SidebarComponent],
  exports: [HeaderComponent, SidebarComponent],
})
export class SharedModule {}
