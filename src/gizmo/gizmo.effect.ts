import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { empty } from 'rxjs/observable/empty';

import * as FromRootReducer from '../reducers';
import {
  DatabaseDeleteItem,
  DatabaseListenForAddedItems,
  DatabaseListenForAddedItemsError,
  DatabaseListenForDataStart,
  DatabaseListenForDataStop,
  DatabaseListenForModifiedItems,
  DatabaseListenForModifiedItemsError,
  DatabaseListenForRemovedItems,
  DatabaseListenForRemovedItemsError,
  DatabaseUpsertItem,
  DatabaseUpsertItemError,
  DatabaseUpsertItemSuccess,
  GizmoActionTypes,
  StoreAddItems,
  StoreDeleteItems,
  StoreUpdateItems,
} from './gizmo.actions';
import { GizmoDataService } from './gizmo.data.service';
import { Gizmo } from './gizmo.model';

import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import {
  catchError,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

@Injectable()
export class GizmoEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<FromRootReducer.State>,
    private dataService: GizmoDataService,
  ) {}

  // tslint:disable-next-line:member-ordering
  @Effect({ dispatch: false })
  public deleteItem$ = this.actions$.pipe(
    ofType<DatabaseDeleteItem>(GizmoActionTypes.DATABASE_DELETE_ITEM),
    map((action) => action.payload),
    tap((payload) => {
      console.log('Effect:deleteItem$:A', payload);
      this.dataService.deleteItem(payload.id, payload.userId);
    }),
  );

  // tslint:disable-next-line:member-ordering
  @Effect({ dispatch: false })
  public listenForAddedItems$ = this.actions$.pipe(
    ofType<DatabaseListenForAddedItems | DatabaseListenForDataStop>(
      GizmoActionTypes.DATABASE_LISTEN_FOR_ADDED_ITEMS,
      GizmoActionTypes.DATABASE_LISTEN_FOR_DATA_STOP,
    ),
    switchMap((action) => {
      switch (action.type) {
        case GizmoActionTypes.DATABASE_LISTEN_FOR_ADDED_ITEMS: {
          return this.dataService.ListenForAdded$(action.payload.userId).pipe(
            map((items: Gizmo[]) => {
              this.store$.dispatch(new StoreAddItems({ gizmos: items }));
            }),
            catchError((error) => {
              this.store$.dispatch(
                new DatabaseListenForAddedItemsError({
                  error: this.handleFirebaseError(error),
                }),
              );
              // Pass on to higher level.
              // throw error;
              return empty();
            }),
          );
        }

        case GizmoActionTypes.DATABASE_LISTEN_FOR_DATA_STOP: {
          console.log('listenForAddedItems.DATABASE_LISTEN_FOR_DATA_STOP');
          return empty();
        }

        default: {
          return empty();
        }
      }
    }),
  );

  // tslint:disable-next-line:member-ordering
  @Effect()
  public listenForData$ = this.actions$.pipe(
    ofType(GizmoActionTypes.DATABASE_LISTEN_FOR_DATA_START),
    tap(() => {
      console.log('Effect:listenForData$:A');
    }),
    switchMap((action: DatabaseListenForDataStart) => {
      console.log('Effect:listenForData$:action>', action);
      return [
        new DatabaseListenForAddedItems({ userId: action.payload.userId }),
        new DatabaseListenForModifiedItems({ userId: action.payload.userId }),
        new DatabaseListenForRemovedItems({ userId: action.payload.userId }),
      ];
    }),
  );

  // tslint:disable-next-line:member-ordering
  @Effect({ dispatch: false })
  public listenForModifiedItems$ = this.actions$.pipe(
    ofType<DatabaseListenForModifiedItems | DatabaseListenForDataStop>(
      GizmoActionTypes.DATABASE_LISTEN_FOR_MODIFIED_ITEMS,
      GizmoActionTypes.DATABASE_LISTEN_FOR_DATA_STOP,
    ),
    tap(() => {
      console.log('Effect:listenForModifiedItems$:A');
    }),
    switchMap((action) => {
      switch (action.type) {
        case GizmoActionTypes.DATABASE_LISTEN_FOR_MODIFIED_ITEMS: {
          // return this.dataService.ListenForModified$(action.payload.userId);
          return this.dataService
            .ListenForModified$(action.payload.userId)
            .pipe(
              map((items: Gizmo[]) => {
                return items.map((item) => {
                  return {
                    changes: item,
                    id: item.id,
                  };
                });
              }),
              map((qq) => {
                this.store$.dispatch(new StoreUpdateItems({ items: qq }));
              }),
              catchError((error) => {
                this.store$.dispatch(
                  new DatabaseListenForModifiedItemsError({
                    error: this.handleFirebaseError(error),
                  }),
                );
                // Pass on to higher level.
                // throw error;
                return empty();
              }),
            );
        }

        case GizmoActionTypes.DATABASE_LISTEN_FOR_DATA_STOP: {
          console.log('listenForModifiedItems.DATABASE_LISTEN_FOR_DATA_STOP');
          return empty();
        }

        default: {
          return empty();
        }
      }
    }),
  );

  // tslint:disable-next-line:member-ordering
  @Effect({ dispatch: false })
  public listenForRemovedItems$ = this.actions$.pipe(
    ofType<DatabaseListenForRemovedItems | DatabaseListenForDataStop>(
      GizmoActionTypes.DATABASE_LISTEN_FOR_REMOVED_ITEMS,
      GizmoActionTypes.DATABASE_LISTEN_FOR_DATA_STOP,
    ),
    tap(() => {
      console.log('Effect:listenForRemovedItems$:A');
    }),
    switchMap((action) => {
      switch (action.type) {
        case GizmoActionTypes.DATABASE_LISTEN_FOR_REMOVED_ITEMS: {
          // return this.dataService.ListenForRemoved$(action.payload.userId);
          return this.dataService.ListenForRemoved$(action.payload.userId).pipe(
            map((items: Gizmo[]) => items.map((a) => a.id)),
            map((ids) => {
              this.store$.dispatch(new StoreDeleteItems({ ids }));
            }),
            catchError((error) => {
              this.store$.dispatch(
                new DatabaseListenForRemovedItemsError({
                  error: this.handleFirebaseError(error),
                }),
              );
              // Pass on to higher level.
              // throw error;
              return empty();
            }),
          );
        }

        case GizmoActionTypes.DATABASE_LISTEN_FOR_DATA_STOP: {
          console.log('listenForRemovedItems.DATABASE_LISTEN_FOR_DATA_STOP');
          return empty();
        }

        default: {
          return empty();
        }
      }
    }),
    tap((x) => {
      console.log('Effect:listenForRemovedItems$:B', x);
    }),
    // map((items: Gizmo[]) => items.map((a) => a.id)),
    // map((ids) => new StoreDeleteItems({ ids })),
  );

  // tslint:disable-next-line:member-ordering
  @Effect()
  public databaseUpsertItem$ = this.actions$.pipe(
    ofType(GizmoActionTypes.DATABASE_UPSERT_ITEM),
    map((action: DatabaseUpsertItem) => action.payload),
    switchMap((payload) => {
      return fromPromise(
        this.dataService.upsertItem(payload.item, payload.userId),
      ).pipe(
        map(() => new DatabaseUpsertItemSuccess()),
        catchError((error) =>
          of(
            new DatabaseUpsertItemError({
              error: this.handleFirebaseError(error),
            }),
          ),
        ),
      );
    }),
  );

  private handleFirebaseError(firebaseError: any) {
    //
    return {
      code: firebaseError.code,
      message: firebaseError.message,
      name: firebaseError.name,
    };
  }
}
