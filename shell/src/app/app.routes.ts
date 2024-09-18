import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { WrapperComponent } from './wrapper.component';

export const routes: Routes = [
    {
        path: 'wrapper',
        component: WrapperComponent
    },
    {
        path: 'angular',
        loadComponent: () =>
            loadRemoteModule('remote', './Component').then((m) => m.AppComponent),
    }
];
