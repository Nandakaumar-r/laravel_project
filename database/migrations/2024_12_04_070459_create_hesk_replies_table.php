<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskRepliesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_replies', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedMediumInteger('replyto')->default(0); 
            $table->string('name', 255)->default('');
            $table->mediumText('message');
            $table->mediumText('message_html')->nullable();
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->mediumText('attachments')->nullable();
            $table->unsignedSmallInteger('staffid')->default(0);
            $table->enum('rating', ['1', '5'])->nullable();
            $table->enum('read', ['0', '1'])->default('0');

            $table->primary('id');
            $table->index('replyto');
            $table->index('dt'); 
            $table->index('staffid');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_replies');
    }
}
