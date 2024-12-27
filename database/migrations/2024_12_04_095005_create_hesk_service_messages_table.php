<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskServiceMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_service_messages', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->unsignedSmallInteger('author'); 
            $table->string('title', 255);
            $table->mediumText('message');
            $table->string('language', 50)->nullable();
            $table->enum('style', ['0', '1', '2', '3', '4'])->default('0');
            $table->enum('type', ['0', '1'])->default('0');
            $table->unsignedSmallInteger('order')->default(0);

            // Index on `type`
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_service_messages');
    }
}
