import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { WrapperComponent } from './wrapper.component';

export const routes: Routes = [
    {
        path: 'test',
        component: TestComponent
    },
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
