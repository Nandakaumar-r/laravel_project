<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskPipeLoopsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_pipe_loops', function (Blueprint $table) {
            $table->increments('id');
            $table->string('email', 191);
            $table->unsignedSmallInteger('hits')->default(0);
            $table->char('message_hash', 32);
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'));

            $table->primary('id');
            $table->index(['email', 'hits']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_pipe_loops');
    }
}
