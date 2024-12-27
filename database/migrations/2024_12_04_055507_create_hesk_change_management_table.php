<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHeskChangeManagementTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_change_management', function (Blueprint $table) {
            $table->increments('id');
            $table->string('ticket_id', 13)->nullable();
            $table->string('emp_email', 255)->nullable();
            $table->string('emp_name', 255)->nullable();
            $table->mediumText('emp_message')->nullable();
            $table->text('staff_message')->nullable();
            $table->string('owner_email', 255)->nullable(); 
            $table->string('owner_name', 255)->nullable();
            $table->string('approver_email', 255)->nullable();
            $table->string('approval_status', 50)->nullable();
            $table->text('approver_message')->nullable(); 
            $table->timestamps();
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
        Schema::dropIfExists('hesk_change_management');
    }
}
