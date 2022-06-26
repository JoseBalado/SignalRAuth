import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import AuthChatHub from './components/Chat/AuthChatHub';
import Chat from './components/Chat/Chat';

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/auth-chat-hub',
    requireAuth: true,
    element: <AuthChatHub />
  },
  {
    path: '/clock',
    // requireAuth: true,
    element: <Chat />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    requireAuth: true,
    element: <FetchData />
  },
  ...ApiAuthorzationRoutes
];

export default AppRoutes;
