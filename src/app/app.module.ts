import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {NgbDropdownModule, NgbProgressbarModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CategoryPipe } from './pipe';

const appRoutes: Routes = [
  {path: '',
    component: AppComponent},
  {path: '**',
    component: AppComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    CategoryPipe
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {useHash: false}),
    HttpClientModule,
    NgbDropdownModule,
    FormsModule,
    NgbTypeaheadModule,
    NgbProgressbarModule,
    ReactiveFormsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
