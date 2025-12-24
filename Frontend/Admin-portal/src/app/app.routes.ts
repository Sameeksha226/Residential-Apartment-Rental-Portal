import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Layout } from './components/layout/layout';
import { Bookings } from './components/bookings/bookings';
import { Towers } from './components/towers/towers';
import { Units } from './components/units/units';
import { Amenities } from './components/amenities/amenities';
import { AuthGuard } from './guards/auth.guard-guard';
import { AdminGuard } from './guards/admin-guard';
import { Users } from './components/users/users';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'',
        component:Layout,
        canActivate:[AuthGuard],
        children:[
            {
                path:'dashboard',
                component:Dashboard
            },
            {
                path:'bookings',
                component:Bookings
            },
            {
                path:'towers',
                component:Towers,
                canActivate:[AdminGuard]
            },
            {
                path:'units',
                component:Units,
                canActivate:[AdminGuard]
            },
            {
                path:'amenities',
                component:Amenities,
            },
            {
                path:'users',
                component:Users
            }
        ]
    }
];
