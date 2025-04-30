import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { Phone, LayoutGrid, DatabaseIcon, FileText, Box, Layers, Compass, Handshake } from 'lucide-react';
import AppLogo from './app-logo.jsx';

const mainNavItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Donnée Référentielle',
        href: '/referentiel',
        icon: DatabaseIcon,
        subItems: [
            {
                title: 'Articles',
                href: '/referentiel/articles',
                icon: FileText,
            },
            {
                title: 'Famille',
                href: '/referentiel/famille',
                icon: Box,
            },
            {
                title: 'Sous Famille',
                href: '/referentiel/sous-famille',
                icon: Layers,
            },
            {
                title: 'Unite',
                href: '/referentiel/unite',
                icon: Compass,
            },
        ],
    },
    {
        title: 'Fournisseur',
        href: '/stock',
        icon: Handshake,
        subItems: [
            {
                //
                title: 'Ajouter Des Articles',
                href: '/fournisseur/articles',
                icon: FileText,
            },
            {
                //
                title: "Mise a Jour les prix d'Articles",
                href: '/fournisseur/price-update',
                icon: FileText,
            },
        ],
    },
];

const footerNavItems= [
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
