<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHeskMfaVerificationTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_mfa_verification_tokens', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedSmallInteger('user_id');
            $table->string('verification_token', 255)->collation('utf8_unicode_ci');
            $table->timestamp('expires_at')->default('1999-12-31 18:30:00');

            $table->primary('id');
            $table->index('user_id');
            $table->index('verification_token');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_mfa_verification_tokens');
    }
}
