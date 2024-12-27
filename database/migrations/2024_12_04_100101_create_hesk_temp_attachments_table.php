<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHeskTempAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_temp_attachments', function (Blueprint $table) {
            $table->mediumIncrements('att_id');
            $table->string('unique_id', 255)->default('');
            $table->string('saved_name', 255)->default('');
            $table->string('real_name', 255)->default('');
            $table->unsignedInteger('size')->default(0);
            $table->timestamp('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_temp_attachments');
    }
}
