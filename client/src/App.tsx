import AuthorizedLayer from '@components/AuthorizedLayer';
import UnAuthorizedLayer from '@components/UnAuthorizedLayer';
import AccessDenied from '@pages/AccessDenied';
import Community from '@pages/Community';
import DM from '@pages/DM';
import DMRoom from '@pages/DMRoom';
import Friends from '@pages/Friends';
import Home from '@pages/Home';
import NotFound from '@pages/NotFound';
import Root from '@pages/Root';
import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import React from 'react';
import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Root />} />
      <Route element={<AuthorizedLayer />}>
        <Route element={<Home />}>
          <Route path="dms" element={<DM />}>
            <Route index element={<Friends />} />
            <Route path=":roomId" element={<DMRoom />} />
          </Route>
          <Route
            path="communities/:communityId/channels/:roomId"
            element={<Community />}
          />
        </Route>
      </Route>
      <Route element={<UnAuthorizedLayer />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
      <Route path="/error" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

const App = () => <RouterProvider router={router} />;

export default App;
