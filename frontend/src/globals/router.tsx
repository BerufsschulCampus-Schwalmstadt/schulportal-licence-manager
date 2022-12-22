import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  createBrowserRouter,
} from 'react-router-dom';
import AuthPage from '../pages/auth-page/authPage';
import Dashboard from '../pages/dashboard-page/dashboardPage';
// eslint-disable-next-line node/no-extraneous-import
import {GuardProvider, GuardedRoute} from 'react-router-guards';

export const authRouter = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    path: '/*',
    element: <Navigate to="/" />,
  },
]);

export const appRouter = createBrowserRouter([
  {
    path: '/dashboard/*',
    element: <Dashboard />,
  },
  {
    path: '/*',
    element: <Navigate to="/dashboard" />,
  },
]);

// const requireLogin = (to, from, next) => {
//   useContext;
//   if (to.meta.auth) {
//     if (getIsLoggedIn()) {
//       next();
//     }
//     next.redirect('/login');
//   } else {
//     next();
//   }
// };

// export const router1 = (
//   <BrowserRouter>
//     <GuardProvider
//       guards={[requireLogin]}
//       loading={<p>Loading</p>}
//       error={<p>Not found</p>}
//     >
//       <GuardedRoute
//         path="/"
//         exact
//         component={<AuthPage />}
//         meta={{auth: false}}
//       />
//       <GuardedRoute
//         path="/dashboard/*"
//         exact
//         component={<Dashboard />}
//         meta={{auth: true}}
//       />
//       <GuardedRoute
//         path="*"
//         exact
//         component={<Navigate to="/" />}
//         meta={{auth: false}}
//       />
//     </GuardProvider>
//   </BrowserRouter>
// );
