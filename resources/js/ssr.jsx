import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import route from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'FC Manage';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,

        resolve: (name) =>
            resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx')),

        setup: ({ App, props }) => {
            // 👇 Removed TypeScript-related code
            global.route = (name, params, absolute) =>
                route(name, params, absolute, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });

            return <App {...props} />;
        },
    })
);
