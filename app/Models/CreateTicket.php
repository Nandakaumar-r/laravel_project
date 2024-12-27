<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CreateTicket extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'hesk_tickets';

    protected $fillable = [
        'trackid',
        'name',
        'email',
        'category',
        'emp_cat',
        'emp_sub_cat',
        'emp_issue',
        'priority',
        'subject',
        'message',
        'message_html',
        'dt',
        'lastchange',
        'firstreply',
        'closedat',
        'status',
        'owner',
        'due_date',
        'attachments',
        'time_worked',
        'replies',
        'staffreplies',
    ];

    /**
     * Get a ticket with details.
     */
    public static function getTicketWithDetails($id)
    {
        return DB::table('hesk_tickets as tickets')
            ->leftJoin('hesk_categories as c', 'tickets.category', '=', 'c.id')
            ->leftJoin('hesk_users as u', 'tickets.owner', '=', 'u.id')
            ->select(
                'tickets.*',
                'c.name as category_name',
                'u.name as owner_name'
            )
            ->where('tickets.id', $id)
            ->first();
    }

    /** 
     * Get all tickets with optional category and owner filters
     */
    public static function getAllTickets($category = null, $owner = null, $searchTerm = null)
    {
        $query = DB::table('hesk_tickets as t')
            ->leftJoin('hesk_categories as c', 't.category', '=', 'c.id')
            ->leftJoin('hesk_users as u', 't.owner', '=', 'u.id')
            ->select(
                't.*',
                'c.name as category_name',
                'u.name as owner_name'
            )
            ->orderBy('t.dt', 'desc');

        if ($category) {
            $query->where('t.category', $category);
        }

        if ($owner) {
            $query->where('t.owner', $owner);
        }

        if ($searchTerm) {
            $query->where(function ($query) use ($searchTerm) {
                $query->where('t.trackid', 'like', '%' . $searchTerm . '%')
                    ->orWhere('t.email', 'like', '%' . $searchTerm . '%'); 
            });
        }

        return $query->paginate(10);
    }
}
