<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class LogController extends Controller
{
    /**
     * Display the system logs.
     */
    public function index(Request $request): Response
    {
        $logPath = storage_path('logs/laravel.log');
        $logContent = File::exists($logPath) ? File::get($logPath) : '';
        
        // Parse log content into structured data
        $logs = $this->parseLogContent($logContent);
        
        return Inertia::render('admin/logs/index', [
            'logs' => $logs
        ]);
    }
    
    /**
     * Parse log content into structured data.
     */
    private function parseLogContent(string $content): array
    {
        $logs = [];
        
        if (empty($content)) {
            return $logs;
        }
        
        $pattern = '/\[(?<date>.*?)\] (?<env>\w+)\.(?<level>\w+): (?<message>.*?)(?:\{(?<context>.*?)\})?(?:\[(?<extra>.*?)\])?$/m';
        
        preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);
        
        foreach ($matches as $match) {
            $logs[] = [
                'date' => $match['date'] ?? '',
                'environment' => $match['env'] ?? '',
                'level' => $match['level'] ?? '',
                'message' => $match['message'] ?? '',
                'context' => $match['context'] ?? '',
                'extra' => $match['extra'] ?? ''
            ];
        }
        
        return $logs;
    }
}