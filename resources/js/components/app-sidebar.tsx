import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Shield, Key, FileText, ClipboardList } from 'lucide-react';
import AppLogo from './app-logo';
import { usePermission } from '@/hooks/usePermission';
import { Can } from '@/components/ui/can';


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
    console.log('auth.user:', auth.user);
    console.log('auth.user.activeRole:', auth.user.activeRole);
    const { hasRole, can } = usePermission();
    
    // Periksa apakah role aktif pengguna adalah admin
    // Ganti ini:
    // console.log(auth.user.activeRole?.name);
    // const isActiveRoleAdmin = auth.user.activeRole?.name === 'admin';
    
    // Dengan ini:
    const isActiveRoleAdmin = hasRole('admin');
    console.log(isActiveRoleAdmin);
    
    return (
        <Sidebar>
            <SidebarHeader className="p-2">
                <AppLogo />
            </SidebarHeader>
            
            <SidebarContent>
                <NavMain items={mainNavItems} />
                <Can role="admin">
        <div>Konten khusus admin</div>
      </Can>
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
                                            <Users className="h-4 w-4 mr-2" />
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
                                            <Shield className="h-4 w-4 mr-2" />
                                            Manajemen Role
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton 
                                        asChild 
                                        isActive={window.location.pathname.startsWith('/admin/permissions')}
                                    >
                                        <Link href={route('admin.permissions.index')} prefetch>
                                            <Key className="h-4 w-4 mr-2" />
                                            Manajemen Hak Akses
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton 
                                        asChild 
                                        isActive={window.location.pathname.startsWith('/admin/audits')}
                                    >
                                        <Link href={route('admin.audits.index')} prefetch>
                                            <ClipboardList className="h-4 w-4 mr-2" />
                                            Audit Log
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton 
                                        asChild 
                                        isActive={window.location.pathname.startsWith('/admin/logs')}
                                    >
                                        <Link href={route('admin.logs.index')} prefetch>
                                            <FileText className="h-4 w-4 mr-2" />
                                            System Logs
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
