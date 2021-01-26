import { CHANNELS } from './constants';
import LinksPage from './pages/LinksPage';
import MenuPage from './pages/MenuPage';
import MainPage from './pages/MainPage';

const routes = [];

for (const channel of CHANNELS) {
	routes.push({ path: `/${channel}/menu/:type`, label: 'Menüü', component: MenuPage, requireChannel: true });
	routes.push({ path: `/${channel}/links`, label: 'Lingid', component: LinksPage, requireChannel: true });
}

// NB! keep the main page on last position
routes.push({ path: '/home', label: 'Avaleht', component: MainPage, exact: true })
routes.push({ path: '/', label: 'Avaleht', component: MainPage, exact: true })

export default routes;
