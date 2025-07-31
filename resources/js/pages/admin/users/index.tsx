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

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

export default function UsersIndex({ users }: { users: User[] }) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Pengguna" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold">Manajemen Pengguna</h1>
                                <Link href={route('admin.users.create')}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Pengguna
                                    </Button>
                                </Link>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="w-[100px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                                        >
                                                            {role.name}
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
                                                            <Link href={route('admin.users.edit', user.id)}>Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(user.id)}
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