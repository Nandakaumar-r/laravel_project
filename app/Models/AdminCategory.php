<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminCategory extends Model
{
    use HasFactory;

    protected $table = 'hesk_categories';

    protected $fillable = [
        'name',
        'cat_order',
        'autoassign',
        'autoassign_config',
        'type',
        'priority',
        'default_due_date_amount',
        'default_due_date_unit',
    ];
}
