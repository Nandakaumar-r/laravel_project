<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHeskStdRepliesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_std_replies', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('title', 100)->default('');
            $table->mediumText('message');
            $table->mediumText('message_html')->nullable();
            $table->unsignedSmallInteger('reply_order')->default(0);
            // Adding the primary key is implicit via smallIncrements
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_std_replies');
    }
}
