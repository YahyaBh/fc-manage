import { useState } from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();


    const currentUrl = page.url;

    const getInitiallyOpenItems = () => {
        return items
            .filter(item => item.subItems?.some(sub => sub.href === currentUrl))
            .map(item => item.title);
    };

    const [openItems, setOpenItems] = useState<string[]>(getInitiallyOpenItems());



    const toggleSubcategories = (title: string) => {
        setOpenItems((prevState) =>
            prevState.includes(title)
                ? prevState.filter((item) => item !== title)
                : [...prevState, title]
        );
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={item.href === page.url}
                            tooltip={{ children: item.title }}
                            onClick={() => item.subItems && toggleSubcategories(item.title)}
                        >

                            {item.subItems ?
                                <h3 className='cursor-pointer'>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </h3>
                                :
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            }

                        </SidebarMenuButton>

                        {item.subItems && openItems.includes(item.title) && (
                            <SidebarMenu className="pl-4 transition-all duration-300 ease-in-out">
                                {item.subItems.map((subItem) => (
                                    <SidebarMenuItem key={subItem.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={subItem.href === page.url}
                                            tooltip={{ children: subItem.title }}
                                        >
                                            <Link href={subItem.href} prefetch>
                                                {subItem.icon && <subItem.icon />}
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
