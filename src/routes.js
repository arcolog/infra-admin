import { CHANNELS } from './constants';
import MenuPage from './pages/MenuPage';
import MainPage from './pages/MainPage';

const routes = CHANNELS.map(channel => (
	{ path: `/${channel}/menu/:type`, label: 'Menüü', component: MenuPage, requireChannel: true }
));

// NB! keep the main page on last position
routes.push({ path: '/home', label: 'Avaleht', component: MainPage, exact: true })
routes.push({ path: '/', label: 'Avaleht', component: MainPage, exact: true })

export default routes;
