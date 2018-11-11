import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ajaxdata } from './services/Ajaxdata';
import { AppComponent } from './app.component';
import { AdminComponent } from './adminComponent';
import { PickComponent } from './pickComponent';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

export const routes: Routes = [
    { path: '', redirectTo: 'pick', pathMatch: 'full' },
    { path: 'admin', component: AdminComponent },
    { path: 'pick', component: PickComponent },
    { path: 'pick/:id', component: PickComponent }
];
export const appRoutingProviders: any[] = [];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    PickComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/dist'},
    Ajaxdata,
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
