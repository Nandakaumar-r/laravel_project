<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeskAttachment extends Model
{
    use HasFactory;

    protected $table = 'hesk_attachments';

    public $timestamps = false;

    protected $fillable = [
        'ticket_id',
        'saved_name',
        'real_name',
        'size',
        'type',
    ];
}
