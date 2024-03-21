import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
 
 
  {
    path: '/det/profile/view',
    title: 'Profile',
    icon: 'bi bi-person-circle',
    class: '',
    extralink: false,
    submenu: [],
  },
  {
    path: '/det/pages/bank-details',
    title: 'Bank details',
    icon: 'bi bi-bank',
    class: '',
    extralink: false,
    submenu: [],
  },
  {
    path: '',
    title: 'My Consultants',
    icon: 'bi bi-people',
    class: 'd-none',  
    extralink: false,
    submenu: [

  {
    path: '/det/pages/add-doctors',
    title: 'Add consultant',
    icon: 'bi bi-person-add',
    class: '',
    extralink: false,
    submenu: [],
  },
],
expanded: false,
},


  {
    path: '',
    title: 'Orders',
    icon: 'bi bi-bag-fill',
    class: 'd-none',  
    extralink: false,
    submenu: [
      {
        path: '/det/pages/create-order',
        title: 'Create order',
        icon: 'bi bi-bag-plus',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: '/det/pages/orderlist',
        title: 'Pending Orders',
        icon: 'bi bi-bag-check',
        class: '',
        extralink: false,
        submenu: [],
      },
      {
        path: '/det/pages/completedorder',
        title: 'Completed Orders',
        icon: 'bi bi-bag-check',
        class: '',
        extralink: false,
        submenu: [],
      },
    ],
    expanded: false,
  },
  

  {
    path: '/det/pages/faq',
    title: 'FAQ',
    icon: 'bi bi-card-list',
    class: '',
    extralink: false,
    submenu: [],
  },

 

];
