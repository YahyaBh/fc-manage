import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {


    const { user } = usePage().props.auth;


    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Sell & Buy Manager</span>
                <span className='text-xs text-sidebar-secondary-foreground truncate leading-none opacity-50'>{user.role === 'client' ? 'Client' : user.role === 'admin' ? 'Admin' : user.role === 'provider' ? 'Seller' : ''}</span>
            </div>
        </>
    );
}
