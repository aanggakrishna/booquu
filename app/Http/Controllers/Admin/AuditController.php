<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use OwenIt\Auditing\Models\Audit;
use Inertia\Inertia;
use Inertia\Response;

class AuditController extends Controller
{
    /**
     * Display a listing of the audits.
     */
    public function index(Request $request): Response
    {
        $audits = Audit::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        
        return Inertia::render('admin/audits/index', [
            'audits' => $audits
        ]);
    }

    /**
     * Display the specified audit details.
     */
    public function show(Audit $audit): Response
    {
        $audit->load('user');
        
        return Inertia::render('admin/audits/show', [
            'audit' => $audit
        ]);
    }
}