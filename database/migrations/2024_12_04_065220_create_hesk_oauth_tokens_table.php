<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskOauthTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_oauth_tokens', function (Blueprint $table) {
            $table->increments('id'); 
            $table->unsignedInteger('provider_id'); 
            $table->text('token_value')->nullable();
            $table->string('token_type', 32);
            $table->timestamp('created')->default(DB::raw('CURRENT_TIMESTAMP')); 
            $table->timestamp('expires')->nullable(); 

            $table->primary('id');
            // Add foreign key constraint if needed
            $table->foreign('provider_id')->references('id')->on('hesk_oauth_providers');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_oauth_tokens');
    }
}
