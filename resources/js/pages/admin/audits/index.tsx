import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface Audit {
    id: string;
    user_id: number | null;
    user_type: string;
    event: string;
    auditable_type: string;
    auditable_id: number;
    old_values: Record<string, any>;
    new_values: Record<string, any>;
    url: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
    user?: User;
}

interface Props extends PageProps {
    audits: {
        data: Audit[];
        links: any[];
        // ... other pagination properties
    };
}

export default function AuditsIndex({ audits }: Props) {
    const getEventColor = (event: string) => {
        switch (event) {
            case 'created':
                return 'bg-green-100 text-green-800';
            case 'updated':
                return 'bg-blue-100 text-blue-800';
            case 'deleted':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getModelName = (type: string) => {
        return type.split('\\').pop();
    };

    return (
        <AppLayout>
            <Head title="Audit Log" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Audit Log</h1>

                            <Table>
                                <TableCaption>Daftar aktivitas pengguna dalam sistem</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead>Pengguna</TableHead>
                                        <TableHead>Aksi</TableHead>
                                        <TableHead>Model</TableHead>
                                        <TableHead>ID</TableHead>
                                        <TableHead>IP Address</TableHead>
                                        <TableHead className="w-[100px]">Detail</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {audits.data.map((audit) => (
                                        <TableRow key={audit.id}>
                                            <TableCell className="font-medium">
                                                {format(new Date(audit.created_at), 'dd MMM yyyy HH:mm:ss')}
                                            </TableCell>
                                            <TableCell>{audit.user?.name || 'System'}</TableCell>
                                            <TableCell>
                                                <Badge className={getEventColor(audit.event)}>
                                                    {audit.event === 'created' && 'Dibuat'}
                                                    {audit.event === 'updated' && 'Diperbarui'}
                                                    {audit.event === 'deleted' && 'Dihapus'}
                                                    {!['created', 'updated', 'deleted'].includes(audit.event) && audit.event}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{getModelName(audit.auditable_type)}</TableCell>
                                            <TableCell>{audit.auditable_id}</TableCell>
                                            <TableCell>{audit.ip_address}</TableCell>
                                            <TableCell>
                                                <Link href={route('admin.audits.show', audit.id)}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination links would go here */}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}