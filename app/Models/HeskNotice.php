<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeskNotice extends Model
{
    protected $fillable = ['title', 'message'];

    public $timestamps = false;
}
