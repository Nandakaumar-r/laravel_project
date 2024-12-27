<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeskReply extends Model
{
    use HasFactory;

    protected $table = 'hesk_replies';

    public $timestamps = false;

    protected $fillable = [
        'replyto',
        'name',
        'message',
        'message_html',
        'dt',
        'attachments',
        'staffid',
        'rating',
        'read',
    ];
}
