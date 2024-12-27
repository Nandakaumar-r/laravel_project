<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskMailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_mail', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedSmallInteger('from');
            $table->unsignedSmallInteger('to');
            $table->string('subject', 255)->collation('utf8_unicode_ci');
            $table->mediumText('message')->collation('utf8_unicode_ci');
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->enum('read', ['0', '1'])->default('0')->collation('utf8_unicode_ci');
            $table->unsignedSmallInteger('deletedby')->default(0);   

            // Indexes
            $table->index('from');
            $table->index(['to', 'read', 'deletedby']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_mail');
    }
}
