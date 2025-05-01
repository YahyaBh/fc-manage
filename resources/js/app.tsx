import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import toast, { Toaster } from 'react-hot-toast';



const appName = import.meta.env.VITE_APP_NAME || 'FC Manage';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <Toaster />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();

Inertia.on('error', (error) => {
    if (error?.status === 409) {
        toast.error('Your session has expired. Please log in again.');
    }

    if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
    } else {
        toast.error('An unexpected error occurred. Please try again.');
    }
});