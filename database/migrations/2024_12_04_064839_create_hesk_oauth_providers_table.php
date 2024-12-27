<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHeskOauthProvidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_oauth_providers', function (Blueprint $table) {
            $table->increments('id'); 
            $table->string('name', 255); 
            $table->text('authorization_url');
            $table->text('token_url');
            $table->text('client_id'); 
            $table->text('client_secret');
            $table->text('scope');
            $table->tinyInteger('no_val_ssl')->default(0);
            $table->smallInteger('verified')->default(0);

            $table->primary('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_oauth_providers');
    }
}
