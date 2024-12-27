<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskOnlineTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_online', function (Blueprint $table) {
            $table->increments('id'); 
            $table->unsignedSmallInteger('user_id'); 
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'))->useCurrent()->onUpdate(DB::raw('CURRENT_TIMESTAMP')); // Timestamp with auto-update
            $table->unsignedInteger('tmp')->default(0);

            $table->unique('user_id'); 
            $table->index('dt');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_online');
    }
}
