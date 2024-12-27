<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHeskAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_attachments', function (Blueprint $table) {
            $table->mediumIncrements('att_id');
            $table->string('ticket_id', 13)->default('');
            $table->string('saved_name', 255)->default('');
            $table->string('real_name', 255)->default('');
            $table->unsignedInteger('size')->default(0); 
            $table->enum('type', ['0', '1'])->default('0');
            $table->index('ticket_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_attachments');
    }
}
