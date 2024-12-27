<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskResetPasswordTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_reset_password', function (Blueprint $table) {
            $table->mediumIncrements('id'); 
            $table->unsignedSmallInteger('user'); 
            $table->char('hash', 40); 
            $table->string('ip', 45); 
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'));

            // Index for the `user` column
            $table->index('user');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_reset_password');
    }
}
