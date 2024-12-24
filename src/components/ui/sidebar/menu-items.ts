import { Icons } from './icons';

export type MenuItem = {
  title: string;
  icon: JSX.Element;
  path: string;
  roles: Array<'tenant' | 'manager' | 'team'>;
};

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <Icons.Dashboard />,
    path: '/',
    roles: ['tenant', 'manager', 'team'],
  },
  {
    title: 'Clients',
    icon: <Icons.Users />,
    path: '/clients',
    roles: ['tenant', 'manager', 'team'],
  },
  {
    title: 'Teams',
    icon: <Icons.Users />,
    path: '/teams',
    roles: ['tenant', 'manager'],
  },
  {
    title: 'Forms',
    icon: <Icons.Calendar />,
    path: '/forms',
    roles: ['tenant', 'manager', 'team'],
  },
  {
    title: 'Profile',
    icon: <Icons.Settings />,
    path: '/profile',
    roles: ['tenant', 'manager', 'team'],
  },
  {
    title: 'Tenant',
    icon: <Icons.Settings />,
    path: '/tenant',
    roles: ['tenant'],
  },
];