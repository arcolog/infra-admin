import { CHANNELS } from './constants';
import LinksPage from './pages/LinksPage';
import MenuPage from './pages/MenuPage';
import MainPage from './pages/MainPage';
import SheetPage from './pages/SheetPage';

const routes = [];

for (const channel of CHANNELS) {
	routes.push({ path: `/menu/${channel}/:type`, label: 'Menüü', component: MenuPage, requireChannel: true });
	routes.push({ path: `/links/${channel}`, label: 'Lingid', component: LinksPage, requireChannel: true });
}

// NB! keep the main page on last position
routes.push({ path: '/sheet', label: 'Andmetabelid', component: SheetPage, exact: true })
routes.push({ path: '/home', label: 'Avaleht', component: MainPage, exact: true })
routes.push({ path: '/', label: 'Avaleht', component: MainPage, exact: true })

export default routes;
