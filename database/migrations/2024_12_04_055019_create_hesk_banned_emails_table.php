<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskBannedEmailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_banned_emails', function (Blueprint $table) {
            $table->smallIncrements('id'); 
            $table->string('email', 191);
            $table->unsignedSmallInteger('banned_by');
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_banned_emails');
    }
}
