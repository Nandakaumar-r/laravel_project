<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHeskCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_categories', function (Blueprint $table) {
            $table->smallIncrements('id'); 
            $table->string('name', 255)->default(''); 
            $table->smallInteger('cat_order', false, true)->default(0); 
            $table->enum('autoassign', ['0', '1'])->default('1'); 
            $table->string('autoassign_config', 1000)->nullable(); 
            $table->enum('type', ['0', '1'])->default('0'); 
            $table->enum('priority', ['0', '1', '2', '3'])->default('3');
            $table->integer('default_due_date_amount', false, true)->nullable();
            $table->string('default_due_date_unit', 10)->nullable();
            $table->primary('id');
            $table->index('type');
              $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_categories');
    }
}
