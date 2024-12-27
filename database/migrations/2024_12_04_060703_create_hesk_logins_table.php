<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHeskLoginsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_logins', function (Blueprint $table) {
            $table->increments('id');
            $table->string('ip', 45)->collation('utf8_unicode_ci');
            $table->unsignedTinyInteger('number')->default(1);
            $table->timestamp('last_attempt')->useCurrent()->useCurrentOnUpdate();
            $table->unique('ip');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_logins');
    }
}
