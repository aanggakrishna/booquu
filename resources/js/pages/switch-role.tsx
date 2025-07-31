import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
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
import {
    RadioGroup,
    RadioGroupItem
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface Role {
    id: number;
    name: string;
}

interface SwitchRoleProps {
    userRoles: Role[];
    activeRoleId: number | null;
}

export default function SwitchRole({ userRoles, activeRoleId }: PageProps<SwitchRoleProps>) {
    const { data, setData, post, processing, errors } = useForm({
        role_id: activeRoleId || '',
    });
    
    const { toast } = useToast();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(route('switch.role'), {
            onSuccess: () => {
                toast({
                    title: 'Sukses',
                    description: 'Role aktif berhasil diubah',
                });
            },
        });
    }

    return (
        <AppLayout>
            <Head title="Pilih Role Aktif" />
            <div className="py-12">
                <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pilih Role Aktif</CardTitle>
                            <CardDescription>
                                Pilih role yang ingin Anda gunakan saat ini
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent>
                                {errors.message && (
                                    <div className="text-red-500 mb-4">{errors.message}</div>
                                )}
                                {errors.role_id && (
                                    <div className="text-red-500 mb-4">{errors.role_id}</div>
                                )}
                                
                                <RadioGroup
                                    value={data.role_id.toString()}
                                    onValueChange={(value) => setData('role_id', value)}
                                    className="space-y-4"
                                >
                                    {userRoles.map((role) => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={role.id.toString()} id={`role-${role.id}`} />
                                            <Label htmlFor={`role-${role.id}`} className="font-medium">
                                                {role.name}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Memproses...' : 'Simpan'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}