<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailList extends Model

{
    use HasFactory;

    protected $table = 'email_list';
    protected $fillable = ['email', 'lock'];

    public $timestamps = false;
}
