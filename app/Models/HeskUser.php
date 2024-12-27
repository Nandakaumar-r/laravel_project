<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeskUser extends Model
{
    use HasFactory;

    protected $table = 'hesk_users';

    protected $fillable = [
        'user',
        'pass',
        'isadmin',
        'name',
        'email',
        'signature',
        'language',
        'categories',
        'afterreply',
        'autostart',
        'autoreload',
        'notify_customer_new',
        'notify_customer_reply',
        'show_suggested',
        'notify_new_unassigned',
        'notify_new_my',
        'notify_reply_unassigned',
        'notify_reply_my',
        'notify_assigned',
        'notify_pm',
        'notify_note',
        'notify_overdue_unassigned',
        'notify_overdue_my',
        'default_list',
        'autoassign',
        'heskprivileges',
        'ratingneg',
        'ratingpos',
        'rating',
        'replies',
        'mfa_enrollment',
        'mfa_secret',
    ];

    public $timestamps = false;
}
