<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $details;

    /**
     * Create a new message instance.
     *
     * @param array $details
     */
    public function __construct($details)
    {
        $this->details = $details;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $isAssignedUser  = isset($this->details['role']) && $this->details['role'] === 'Assigned User';
        $subject = $isAssignedUser
            ? 'New Ticket Assigned to You'
            : 'Your Ticket Has Been Created';


        $view = $isAssignedUser
            ? 'emails.ticket_assigned'
            : 'emails.ticket_created';


        return $this->subject($subject)
            ->view($view)
            ->with('details', $this->details);
    }
}
