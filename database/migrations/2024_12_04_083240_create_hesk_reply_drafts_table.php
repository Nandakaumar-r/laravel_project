<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskReplyDraftsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_reply_drafts', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedSmallInteger('owner'); 
            $table->unsignedMediumInteger('ticket');
            $table->mediumText('message');
            $table->mediumText('message_html')->nullable();
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'));

            // Indexes for `owner` and `ticket` columns
            $table->index('owner');
            $table->index('ticket');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_reply_drafts');
    }
}
