import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

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
    audit: Audit;
}

export default function AuditShow({ audit }: Props) {
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
            <Head title="Detail Audit" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('admin.audits.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Daftar
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Audit</CardTitle>
                            <CardDescription>
                                Informasi lengkap tentang aktivitas yang dicatat
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Waktu</h3>
                                    <p>{format(new Date(audit.created_at), 'dd MMMM yyyy HH:mm:ss')}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Pengguna</h3>
                                    <p>{audit.user?.name || 'System'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Aksi</h3>
                                    <Badge className={getEventColor(audit.event)}>
                                        {audit.event === 'created' && 'Dibuat'}
                                        {audit.event === 'updated' && 'Diperbarui'}
                                        {audit.event === 'deleted' && 'Dihapus'}
                                        {!['created', 'updated', 'deleted'].includes(audit.event) && audit.event}
                                    </Badge>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Model</h3>
                                    <p>{getModelName(audit.auditable_type)} #{audit.auditable_id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">IP Address</h3>
                                    <p>{audit.ip_address}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">URL</h3>
                                    <p className="truncate">{audit.url}</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-lg font-medium mb-2">Perubahan Data</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {audit.event === 'updated' && (
                                        <>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Nilai Lama</h4>
                                                <pre className="bg-gray-50 p-3 rounded-md overflow-auto text-sm">
                                                    {JSON.stringify(audit.old_values, null, 2)}
                                                </pre>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Nilai Baru</h4>
                                                <pre className="bg-gray-50 p-3 rounded-md overflow-auto text-sm">
                                                    {JSON.stringify(audit.new_values, null, 2)}
                                                </pre>
                                            </div>
                                        </>
                                    )}
                                    {audit.event === 'created' && (
                                        <div className="col-span-2">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Data yang Dibuat</h4>
                                            <pre className="bg-gray-50 p-3 rounded-md overflow-auto text-sm">
                                                {JSON.stringify(audit.new_values, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                    {audit.event === 'deleted' && (
                                        <div className="col-span-2">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Data yang Dihapus</h4>
                                            <pre className="bg-gray-50 p-3 rounded-md overflow-auto text-sm">
                                                {JSON.stringify(audit.old_values, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-lg font-medium mb-2">Informasi Browser</h3>
                                <pre className="bg-gray-50 p-3 rounded-md overflow-auto text-sm">
                                    {audit.user_agent}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}