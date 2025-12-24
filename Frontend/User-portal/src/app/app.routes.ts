import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Navigation } from './components/navigation/navigation';
import { Home } from './components/home/home';
import { Apartment } from './components/apartment/apartment';
import { Profile } from './components/profile/profile';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'',
        component:Login,
    },
    {
        path:'register',
        component:Register
    },
    {
        path:'',
        component:Navigation,
        children:[
            {
                path:'home',
                component:Home
            },
            {
                path:'apartment',
                component:Apartment
            },
            {
                path:'unit-details/:id',
                loadComponent: () => import('./components/unit-details/unit-details').then(m => m.UnitDetails)
            },
            {
                path:'profile',
                component:Profile
            }
        ]
    }
];
