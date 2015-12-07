import React from 'react';
import { Route } from 'react-router';
import App from '../containers/App';
const packageInfo = require('../../../package.json');

// pages
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import About from '../pages/About';
import Editor from '../pages/Editor';

const routes = (
	<Route component={App}>
		<Route path={`/${packageInfo.name}`} component={Home} />
		<Route path={`/${packageInfo.name}/home`} component={Home} />
		<Route path={`/${packageInfo.name}/about`} component={About} />
		<Route path={`/${packageInfo.name}/editor`} component={Editor}>
			<Route path="examples">
				<Route path=":group">
					<Route path=":file" />
				</Route>
			</Route>
		</Route>
		<Route path="*" component={NotFound} />
	</Route>
);

export default routes;
