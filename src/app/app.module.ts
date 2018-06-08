import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { StatusBar } from '@ionic-native/status-bar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Error } from '../components/error/error.component';
import { ExampleList } from '../components/example-list/example-list.component';
import { TextItemEffects } from '../effects/text-item.effect';
import { GadgetDataService } from '../gadget/gadget.data.service';
import { GadgetEffects } from '../gadget/gadget.effect';
import { GadgetService } from '../gadget/gadget.service';
import { GadgetDetailModal } from '../gadget/modals/gadget-detail/gadget-detail.modal';
import { GadgetListPage } from '../gadget/pages/gadget-list/gadget-list.page';
import { GizmoDataService } from '../gizmo/gizmo.data.service';
import { GizmoEffects } from '../gizmo/gizmo.effect';
import { GizmoService } from '../gizmo/gizmo.service';
import { GizmoDetailModal } from '../gizmo/modals/gizmo-detail/gizmo-detail.modal';
import { GizmoListPage } from '../gizmo/pages/gizmo-list/gizmo-list.page';
import { HomePage } from '../pages/home/home.page';
import { LoginPage } from '../pages/login/login.page';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { RealtimeDatabasePage } from '../pages/realtime-database/realtime-database.page';
import { SignupPage } from '../pages/signup/signup.page';
import { metaReducers, reducers } from '../reducers';
import { WidgetDetailModal } from '../widget/modals/widget-detail/widget-detail.modal';
import { WidgetListPage } from '../widget/pages/widget-list/widget-list.page';
import { WidgetDataService } from '../widget/widget.data.service';
import { WidgetEffects } from '../widget/widget.effect';
import { WidgetService } from '../widget/widget.service';
import { MyApp } from './app.component';
import { AuthEffects } from './auth/auth.effect';
import { AuthService } from './auth/auth.service';
import { MyFirebaseAppConfig } from '../pages/credenciais/credenciais';

@NgModule({
  declarations: [
    WidgetDetailModal,
    WidgetListPage,
    GadgetDetailModal,
    GadgetListPage,
    GizmoDetailModal,
    GizmoListPage,
    Error,
    ExampleList,
    MyApp,
    Page1,
    Page2,
    HomePage,
    LoginPage,
    RealtimeDatabasePage,
    SignupPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(MyFirebaseAppConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence(),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([
      AuthEffects,
      TextItemEffects,
      WidgetEffects,
      GadgetEffects,
      GizmoEffects,
    ]),
  ],
  // tslint:disable-next-line:object-literal-sort-keys
  bootstrap: [IonicApp],
  entryComponents: [
    GadgetDetailModal,
    GadgetListPage,
    GizmoDetailModal,
    GizmoListPage,
    WidgetDetailModal,
    WidgetListPage,
    MyApp,
    Page1,
    Page2,
    HomePage,
    LoginPage,
    RealtimeDatabasePage,
    SignupPage,
  ],
  providers: [
    AuthService,
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GadgetDataService,
    GadgetService,
    GizmoDataService,
    GizmoService,
    WidgetDataService,
    WidgetService,
  ],
})
export class AppModule {}
