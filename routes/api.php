<?php

use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\AdminDashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryDropdownController;
use App\Http\Controllers\CreateTicketController;
use App\Http\Controllers\DashboardReportController;
use App\Http\Controllers\EmailImportCsvController;
use App\Http\Controllers\EmailListController;
use App\Http\Controllers\EnvConfigController;
use App\Http\Controllers\HeskNoticeController;
use App\Http\Controllers\HeskUserController;
use App\Http\Controllers\IncidentTicketController;
use App\Http\Controllers\NotifyEmailsController;
use App\Http\Controllers\RequestTicketController;
use App\Http\Controllers\TicketExportController;
use App\Http\Controllers\ViewAdminTicketController;
use App\Http\Controllers\ViewTicketController;

Route::middleware('auth.php')->get('/user', function (Request $request) {
    return $request->user();
});

// Sample API
Route::get('/books', [BookController::class, 'index']);
Route::post('/books', [BookController::class, 'store']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::put('/books/{id}', [BookController::class, 'update']);
Route::delete('/books/{id}', [BookController::class, 'destroy']);

//end-user tickets API
Route::post('/tickets', [CreateTicketController::class, 'createTicket']);
Route::post('/view-ticket', [ViewTicketController::class, 'show']);
Route::put('/update-ticket/{trackid}/{email}', [ViewTicketController::class, 'update']);
Route::get('/incident-categories', [CategoryDropdownController::class, 'getIncidentCategories']);
Route::get('/request-categories', [CategoryDropdownController::class, 'getRequestCategories']);

// Admin Notices API
Route::get('/hesk-notices', [HeskNoticeController::class, 'index']);
Route::post('/hesk-notices', [HeskNoticeController::class, 'store']);
Route::get('/hesk-notices/{id}', [HeskNoticeController::class, 'show']);
Route::put('/hesk-notices/{id}', [HeskNoticeController::class, 'update']);
Route::delete('/hesk-notices/{id}', [HeskNoticeController::class, 'destroy']);

    // Email List API
Route::get('admin/emails', [EmailListController::class, 'index']);
Route::delete('/emails/{id}', [EmailListController::class, 'destroy']);
Route::post('/import-emails', [EmailImportCsvController::class, 'importCsv']);
Route::patch('/email-list/{id}/lock', [EmailListController::class, 'updateLock']);



//Admin Tickets API
Route::prefix('admin')->group(function () {
    Route::get('/tickets', [ViewAdminTicketController::class, 'getAllTickets']);
    Route::get('/tickets/{id}', [ViewAdminTicketController::class, 'getTicket']);
    Route::put('/tickets/{id}', [ViewAdminTicketController::class, 'editTicket']);
    // Route::put('/tickets/reassign/{id}', [ViewAdminTicketController::class, 'reassignTicket']);
    Route::delete('/tickets/{id}', [ViewAdminTicketController::class, 'deleteTicket']);
    // Dashboard Report API
    Route::post('/download-report', [DashboardReportController::class, 'downloadReport'])->name('download.report');
    // Hesk Users API
    Route::get('/hesk-users', [HeskUserController::class, 'index']);
    Route::get('/hesk-users/{id}', [HeskUserController::class, 'show']);
    Route::post('/hesk-users', [HeskUserController::class, 'store']);
    Route::put('/hesk-users/{id}', [HeskUserController::class, 'updateUser']);
    Route::delete('/hesk-users/{id}', [HeskUserController::class, 'deleteUser']);
    // Admin Categories API
    Route::get('/categories', [AdminCategoryController::class, 'index']);
    Route::get('/categories/{id}', [AdminCategoryController::class, 'show']);
    Route::post('/categories', [AdminCategoryController::class, 'store']);
    Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
    Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);
    // Export Tickets API
    Route::get('/export-tickets', [TicketExportController::class, 'exportTickets']);
    // Dashboard API
    Route::get('/dashboard-tickets', [AdminDashboardController::class, 'getTicketData']);
    // Fetch only "Submit a Request" tickets
    Route::get('/request-tickets', [RequestTicketController::class, 'getRequestTickets']);
    // Fetch only "Submit an incident" tickets
    Route::get('/incident-tickets', [IncidentTicketController::class, 'getIncidentTickets']);



    // Notify Emails API
    Route::get('/notify-email', [NotifyEmailsController::class, 'index']);
    Route::post('/notify-email', [NotifyEmailsController::class, 'store']);
    Route::put('/notify-email/{id}', [NotifyEmailsController::class, 'update']);
    Route::delete('/notify-email/{id}', [NotifyEmailsController::class, 'destroy']);

    // Env Config API
    Route::put('/update-smtp-config', [EnvConfigController::class, 'updateSmtpConfig']);
    Route::get('/smtp-config', [EnvConfigController::class, 'getSmtpConfig']);
    Route::get('/db-config', [EnvConfigController::class, 'getDbConfig']);
    Route::put('/update-db-config', [EnvConfigController::class, 'updateDbConfig']);
    
});

