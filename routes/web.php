<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

// Frontend Routes
Route::get('/', function () {
    return Inertia::render('Frontend/Home');
});
Route::get('/about', function () {
    return Inertia::render('Frontend/About');
});
Route::get('/create-ticket', function () {
    return Inertia::render('Frontend/CreateTicket');
});
Route::get('/view-ticket', function () {
    return Inertia::render('Frontend/ViewTicketFrom');
});
Route::get('/ticket-details', function () {
    return Inertia::render('Frontend/TicketDetails');
});
Route::get('/ticket-submitted', function () {
    return Inertia::render('Frontend/TicketSubmitted');
});
// Dashboard Routes
// Admin Routes
Route::prefix('admin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard/Login');
    });

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/AdminDashboard');
    });

    Route::get('/categories', function () {
        return Inertia::render('Dashboard/Admincategories');
    });

    Route::get('/emails', function () {
        return Inertia::render('Dashboard/AdminEmailList');
    });
    Route::get('/users', function () {
        return Inertia::render('Dashboard/Users');
    });
    Route::get('/tickets', function () {
        return Inertia::render('Dashboard/AdminTickets');
    });
    Route::get('/request-tickets', function () {
        return Inertia::render('Dashboard/RequestTickets');
    });
    Route::get('/incident-tickets', function () {
        return Inertia::render('Dashboard/IncidentTickets');
    });
    Route::get('/smtp-config', function () {
        return Inertia::render('Dashboard/SmtpConfig');
    });
    Route::get('/db-config', function () {
        return Inertia::render('Dashboard/DbConfig');
    });
    Route::get('/notify-email', function () {
        return Inertia::render('Dashboard/NotificationConfig');
    });
    Route::get('/profile', function () {
        return Inertia::render('Dashboard/AdminProfile');
    });
    Route::get('/tickets/{id}', function ($id) {
        return Inertia::render('Dashboard/AdminTicketDetails', [
            'ticketId' => $id, // Pass ticket ID or other data you need to the React component
        ]);
    });    
});

Route::get('/{any}', function () {
    return view('app'); // Make sure this points to your React app's entry view
})->where('any', '.*'); // Catch-all route for any route not found in the backend
require __DIR__.'/auth.php';
