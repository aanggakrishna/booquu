import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Shield } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    // Periksa apakah role aktif pengguna adalah admin
    const isActiveRoleAdmin = auth.user.activeRole?.name === 'admin';
    
    return (
        <Sidebar>
            <SidebarHeader className="p-2">
                <AppLogo />
            </SidebarHeader>
            
            <SidebarContent>
                <NavMain items={mainNavItems} />
                
                {isActiveRoleAdmin && (
                    <SidebarMenu className="px-2 py-2">
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={window.location.pathname.startsWith('/admin')}>
                                <Shield className="h-4 w-4" />
                                <span>Admin</span>
                            </SidebarMenuButton>
                            
                            <SidebarMenuSub>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton 
                                        asChild 
                                        isActive={window.location.pathname.startsWith('/admin/users')}
                                    >
                                        <Link href={route('admin.users.index')} prefetch>
                                            Manajemen Pengguna
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton 
                                        asChild 
                                        isActive={window.location.pathname.startsWith('/admin/roles')}
                                    >
                                        <Link href={route('admin.roles.index')} prefetch>
                                            Manajemen Role
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarContent>
            
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
