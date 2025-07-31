import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function AdminDashboard() {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Panel Admin</h1>
                            <p>Selamat datang di panel admin. Gunakan menu di samping untuk mengelola pengguna dan hak akses.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}