# Gizmo

* Firebase Cloud Firestore
* [@ngrx/entity](https://github.com/ngrx/platform/tree/master/docs/entity)
* [AngularFirestoreCollection - stateChanges()](https://github.com/angular/angularfire2/blob/master/docs/firestore/collections.md#snapshotchanges)
* [EntityAdapter](https://github.com/ngrx/platform/blob/master/docs/entity/adapter.md) sorts records

# Widget

* Firebase Cloud Firestore
* [@ngrx/entity](https://github.com/ngrx/platform/tree/master/docs/entity)
* [AngularFirestoreCollection - valueChanges()](https://github.com/angular/angularfire2/blob/master/docs/firestore/collections.md#valuechanges) returns sorted records

### my-firebase-app-config.ts

```typescript
import { FirebaseAppConfig } from 'angularfire2';

export const MyFirebaseAppConfig: Readonly<FirebaseAppConfig> = {
  apiKey: 'xxxxxx',
  authDomain: 'xxxxxx',
  databaseURL: 'xxxxxx',
  projectId: 'xxxxxx',
  storageBucket: 'xxxxxx',
};
```

## State

* collection
  * loaded
  * loading
  * textItems
    * 0
      * description
      * title
    * 1
      * description
      * title
* wgizmo
  * ids
    * 0: "aa"
    * 1: "bb"
  * entities
    * aa
      * description
      * id
      * name
    * bb
      * description
      * id
      * name
  * selectedGizmoId
* login
  * displayName
  * isAuthenticated
  * isAuthenticating
  * error
* widget
  * ids
    * 0: "aa"
    * 1: "bb"
  * entities
    * aa
      * description
      * id
      * name
    * bb
      * description
      * id
      * name
  * selectedWidgetId

## ngrx 4.1.1

### Actions

Using [example-app/book.ts](https://github.com/ngrx/platform/blob/master/example-app/app/books/actions/book.ts) as pattern.

[Action doc](https://github.com/ngrx/platform/blob/master/docs/store/actions.md)

### Reducers

https://github.com/ngrx/platform/blob/master/example-app/app/auth/reducers/auth.ts

https://github.com/ngrx/platform/blob/master/docs/entity/adapter.md#createentityadapter
