<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHeskUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_users', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('user', 255)->default('');
            $table->string('pass', 255)->default('');
            $table->enum('isadmin', ['0', '1'])->default('0');
            $table->string('name', 255)->default('');
            $table->string('email', 255)->default('');
            $table->string('signature', 1000)->default('');
            $table->string('language', 50)->nullable();
            $table->string('categories', 500)->default('');
            $table->enum('afterreply', ['0', '1', '2'])->default('0');
            $table->enum('autostart', ['0', '1'])->default('1');
            $table->unsignedSmallInteger('autoreload')->default(0);
            $table->enum('notify_customer_new', ['0', '1'])->default('1');
            $table->enum('notify_customer_reply', ['0', '1'])->default('1');
            $table->enum('show_suggested', ['0', '1'])->default('1');
            $table->enum('notify_new_unassigned', ['0', '1'])->default('1');
            $table->enum('notify_new_my', ['0', '1'])->default('1');
            $table->enum('notify_reply_unassigned', ['0', '1'])->default('1');
            $table->enum('notify_reply_my', ['0', '1'])->default('1');
            $table->enum('notify_assigned', ['0', '1'])->default('1');
            $table->enum('notify_pm', ['0', '1'])->default('1');
            $table->enum('notify_note', ['0', '1'])->default('1');
            $table->enum('notify_overdue_unassigned', ['0', '1'])->default('1');
            $table->enum('notify_overdue_my', ['0', '1'])->default('1');
            $table->string('default_list', 255)->default('');
            $table->enum('autoassign', ['0', '1'])->default('1');
            $table->string('heskprivileges', 1000)->nullable();
            $table->unsignedMediumInteger('ratingneg')->default(0);
            $table->unsignedMediumInteger('ratingpos')->default(0);
            $table->float('rating', 8, 2)->default(0);
            $table->unsignedMediumInteger('replies')->default(0);
            $table->unsignedSmallInteger('mfa_enrollment')->default(0);
            $table->string('mfa_secret', 255)->nullable();

            
            $table->index('autoassign'); // KEY `autoassign`
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_users');
    }
}

