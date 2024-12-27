<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotifyTickets extends Model
{
    use HasFactory;

    protected $table = 'email_settings';

    protected $fillable = 
    [
        'tech_team_email', 
        'tech_leader_email', 
        'hr_officer_email'
    ];
}

