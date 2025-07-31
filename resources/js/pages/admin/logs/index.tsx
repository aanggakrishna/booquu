import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
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

interface Log {
    date: string;
    environment: string;
    level: string;
    message: string;
    context: string;
    extra: string;
}

interface Props extends PageProps {
    logs: Log[];
}

export default function LogsIndex({ logs }: Props) {
    const getLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'error':
                return 'bg-red-100 text-red-800';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800';
            case 'info':
                return 'bg-blue-100 text-blue-800';
            case 'debug':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title="System Logs" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">System Logs</h1>

                            <Table>
                                <TableCaption>Log aktivitas sistem</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Level</TableHead>
                                        <TableHead>Pesan</TableHead>
                                        <TableHead>Konteks</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{log.date}</TableCell>
                                            <TableCell>
                                                <Badge className={getLevelColor(log.level)}>
                                                    {log.level}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-md truncate">{log.message}</TableCell>
                                            <TableCell className="max-w-md truncate">{log.context}</TableCell>
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