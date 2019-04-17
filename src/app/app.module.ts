import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  NgbModule,
  NgbActiveModal,
  NgbProgressbarConfig
} from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule } from '@angular/material';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { FlxUiDatatableModule, FlxUiDataTable } from 'flx-ui-datatable';
import { DragulaModule } from 'ng2-dragula';

import { AccountModule } from './account/account.module';
import { QuillModule } from 'ngx-quill';
import { QuabblyRtEditorModule } from './rtEditor/rtEditor.module';

import {
  MenuComponent,
  HeaderComponent,
  SidebarComponent,
  FooterComponent,
  AdminLayoutComponent,
  AuthLayoutComponent,
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './core';
import { ErrorInterceptor } from './core/interceptors/interceptor.error';
import { JwtInterceptor } from './core/interceptors/interceptor.jwt';
import { AlertModule } from './components/alert/alert.module';
import { HomeComponent } from './home/home.component';
import { ToastrModule } from 'ng6-toastr-notifications';
// import { UserManagementComponent } from './usermanagement/usermanagement.component';
// import { NotificationsComponent } from './notifications/notifications.component';

// import { NotificationsComponent } from './notifications/notifications.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    QuillModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot(AppRoutes),
    FlxUiDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    DragulaModule,
    AccountModule,
    HttpClientModule,

    NgxDatatableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    AccountModule,
    LoadingBarRouterModule,
    NgbModule.forRoot(),
    MatSidenavModule,
    AlertModule,
    ToastrModule,
    DragulaModule.forRoot(),
    QuabblyRtEditorModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    FlxUiDataTable,
    NgbActiveModal,
    NgbProgressbarConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
