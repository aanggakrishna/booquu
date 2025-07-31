import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export default function RolesIndex({ roles }: { roles: Role[] }) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus role ini?')) {
            router.delete(route('admin.roles.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Role" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold">Manajemen Role</h1>
                                <Link href={route('admin.roles.create')}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Role
                                    </Button>
                                </Link>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Hak Akses</TableHead>
                                        <TableHead className="w-[100px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell className="font-medium">{role.name}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.map((permission) => (
                                                        <span
                                                            key={permission.id}
                                                            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                                        >
                                                            {permission.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Buka menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.roles.edit', role.id)}>Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(role.id)}
                                                            className="text-red-600"
                                                        >
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}