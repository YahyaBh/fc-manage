import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Phone, LayoutGrid, DatabaseIcon, FileText, Box, Layers, Compass } from 'lucide-react';
import AppLogo from './app-logo.jsx';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Donnée Référentielle',
        href: '/',
        icon: DatabaseIcon,
        subItems: [
            {
                title: 'Articles',
                href: '/articles',
                icon: FileText,
            },
            {
                title: 'Famille',
                href: '/famille',
                icon: Box,
            },
            {
                title: 'Sous Famille',
                href: '/sous-famille',
                icon: Layers,
            },
            {
                title: 'Unite',
                href: '/unite',
                icon: Compass,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Contact',
        href: 'tel:+212665665655',
        icon: Phone,
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
