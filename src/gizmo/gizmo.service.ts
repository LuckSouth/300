import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

import * as FromRootReducer from '../reducers';
import {
  DatabaseDeleteItem,
  DatabaseListenForDataStart,
  DatabaseListenForDataStop,
  DatabaseUpsertItem,
} from './gizmo.actions';
import { Gizmo } from './gizmo.model';

@Injectable()
export class GizmoService {
  constructor(private store: Store<FromRootReducer.State>) {}

  public getData$(): Observable<ReadonlyArray<Gizmo>> {
    //
    return this.store.pipe(select(FromRootReducer.selectAllGizmos));
  }

  public ListenForDataStart(): void {
    //
    this.store
    .pipe(select(FromRootReducer.getAuthState), take(1))
      .subscribe((authState) => {
        if (authState.isAuthenticated) {
          this.store.dispatch(
            new DatabaseListenForDataStart({ userId: authState.userId }),
          );
        }
      });
  }

  public ListenForDataStop(): void {
    //
    this.store.dispatch(new DatabaseListenForDataStop());
  }

  public deleteItem(item: Gizmo) {
    //
    this.store
    .pipe(select(FromRootReducer.getAuthState), take(1))
      .subscribe((authState) => {
        this.store.dispatch(
          new DatabaseDeleteItem({ id: item.id, userId: authState.userId }),
        );
      });
  }
  /*
  public update(item: Gizmo) {
    this.store.dispatch(
      new UpdateGizmo({ gizmo: { id: item.id, changes: item } }),
    );
  }
*/
  /*
  Best practice is to provide the user as part of the payload as mentioned
  instead of selecting it from the state in the effect. This keeps the Effect
  pure and easier to test. You can also write a selector that composes the two
  pieces of data together for your action.
  https://github.com/ngrx/platform/issues/496#issuecomment-337781385
  */
  public upsert(item: Gizmo) {
    //
    this.store
    .pipe(select(FromRootReducer.getAuthState), take(1))
      .subscribe((authState) => {
        this.store.dispatch(
          new DatabaseUpsertItem({ item, userId: authState.userId }),
        );
      });
  }

  public isLoaded(): Observable<boolean> {
    //
    return this.store.pipe(select(FromRootReducer.getGizmoLoaded));
  }

  public isLoading(): Observable<boolean> {
    //
    return this.store.pipe(select(FromRootReducer.getGizmoLoading));
  }
}
