<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskMfaBackupCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_mfa_backup_codes', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->unsignedSmallInteger('user_id');
            $table->string('code', 255)->collation('utf8_unicode_ci');

            // Primary key
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
        Schema::dropIfExists('hesk_mfa_backup_codes');
    }
}
