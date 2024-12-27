<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskAuthTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_auth_tokens', function (Blueprint $table) {
            $table->increments('id');
            $table->char('selector', 12)->nullable();
            $table->char('token', 64)->nullable();
            $table->unsignedSmallInteger('user_id');
            $table->timestamp('created')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('expires')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_auth_tokens');
    }
}
