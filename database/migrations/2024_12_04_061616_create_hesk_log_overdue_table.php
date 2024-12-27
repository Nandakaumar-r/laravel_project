<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateHeskLogOverdueTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_log_overdue', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('dt')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->mediumInteger('ticket')->unsigned();
            $table->smallInteger('category')->unsigned();
            $table->enum('priority', ['0', '1', '2', '3'])->collation('utf8_unicode_ci');
            $table->unsignedTinyInteger('status');
            $table->smallInteger('owner')->unsigned()->default(0);
            $table->timestamp('due_date')->default('1999-12-31 18:30:00');
            $table->string('comments', 255)->nullable()->collation('utf8_unicode_ci');

            // Indexes
            $table->index('ticket');
            $table->index('category');
            $table->index('priority');
            $table->index('status');
            $table->index('owner');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_log_overdue');
    }
}
