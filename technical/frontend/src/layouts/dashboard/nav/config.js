// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  // {
  //   title: 'articles',
  //   path: '/dashboard/articles',
  //   icon: icon('ic_article'),
  // },
  // {
  //   title: 'menus',
  //   path: '/dashboard/menus',
  //   icon: icon('ic_menu'),
  // },
  // {
  //   title: 'orders',
  //   path: '/dashboard/orders',
  //   icon: icon('ic_order'),
  // },
  {
    title: 'logs',
    path: '/dashboard/logs',
    icon: icon('ic_order'),
  },
  {
    title: 'components',
    path: '/dashboard/components',
    icon: icon('ic_order'),
  }
];

// const navConfig = [
//   {
//     title: 'dashboard',
//     path: '/dashboard/app',
//     icon: icon('ic_analytics'),
//   },
//   {
//     title: 'user',
//     path: '/dashboard/user',
//     icon: icon('ic_user'),
//   },
//   {
//     title: 'product',
//     path: '/dashboard/products',
//     icon: icon('ic_cart'),
//   },
//   {
//     title: 'articles',
//     path: '/dashboard/articles',
//     icon: icon('ic_article'),
//   },
//   {
//     title: 'menus',
//     path: '/dashboard/menus',
//     icon: icon('ic_menu'),
//   },
//   {
//     title: 'orders',
//     path: '/dashboard/orders',
//     icon: icon('ic_order'),
//   },
//   {
//     title: 'blog',
//     path: '/dashboard/blog',
//     icon: icon('ic_blog'),
//   },
//   {
//     title: 'login',
//     path: '/login',
//     icon: icon('ic_lock'),
//   },
//   {
//     title: 'Not found',
//     path: '/404',
//     icon: icon('ic_disabled'),
//   },
// ];
export default navConfig;
