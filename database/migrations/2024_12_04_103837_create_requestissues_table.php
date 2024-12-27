<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestissuesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('requestissues', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('subcategory_id')->nullable();
            $table->string('issue_description', 255);
            $table->foreign('subcategory_id')->references('id')->on('requestsubcategories')->onDelete('set null');
            $table->index('subcategory_id'); // Index for faster lookups
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('requestissues');
    }
}
