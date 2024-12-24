export type MenuItem = {
  title: string;
  icon: keyof typeof import('./icons').Icons;  // Changed to use icon name string
  path: string;
  roles: Array<'tenant' | 'manager' | 'team'>;
};

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'Dashboard',
    path: '/',
    roles: ['tenant', 'manager', 'team'],
  },
  {
    title: 'Clients',
    icon: 'Users',
    path: '/clients',
    roles: ['tenant', 'manager', 'team'],
  },
  {
    title: 'Teams',
    icon: 'Users',
    path: '/teams',
    roles: ['tenant', 'manager'],
  },
  {
    title: 'Forms',
    icon: 'Calendar',
    path: '/forms',
    roles: ['tenant', 'manager', 'team'],
  },
  {
    title: 'Profile',
    icon: 'Settings',
    path: '/profile',
    roles: ['tenant', 'manager', 'team'],
  },
  {
    title: 'Tenant',
    icon: 'Settings',
    path: '/tenant',
    roles: ['tenant'],
  },
];