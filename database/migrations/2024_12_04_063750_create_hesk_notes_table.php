<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskNotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_notes', function (Blueprint $table) {
            $table->mediumIncrements('id');
            $table->unsignedMediumInteger('ticket');
            $table->unsignedSmallInteger('who');
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->mediumText('message')->collation('utf8_unicode_ci');
            $table->mediumText('attachments')->collation('utf8_unicode_ci');

            $table->primary('id');
            $table->index('ticket'); // Index for ticket ID
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_notes');
    }
}
