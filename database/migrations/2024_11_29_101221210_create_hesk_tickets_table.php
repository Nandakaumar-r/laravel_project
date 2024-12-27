<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hesk_tickets', function (Blueprint $table) {
            $table->mediumIncrements('id');
            $table->string('trackid', 20);
            $table->string('name', 255)->default('');
            $table->string('email', 1000)->default('');
            $table->unsignedSmallInteger('category')->default(1);
            $table->string('emp_cat', 250)->nullable();
            $table->string('emp_sub_cat', 250)->nullable();
            $table->string('emp_issue', 250)->nullable();
            $table->enum('priority', ['0','1','2','3'])->default('3');
            $table->string('subject', 250)->default('');
            $table->mediumText('message');
            $table->mediumText('message_html')->nullable();
            $table->timestamp('dt')->useCurrent();
            $table->timestamp('lastchange')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('firstreply')->nullable();
            $table->timestamp('closedat')->nullable();
            $table->string('articles', 255)->nullable();
            $table->string('ip', 45)->default('');
            $table->string('language', 50)->nullable();
            $table->unsignedTinyInteger('status')->default(0);
            $table->unsignedMediumInteger('openedby')->default(0);
            $table->unsignedSmallInteger('firstreplyby')->nullable();
            $table->unsignedMediumInteger('closedby')->nullable();
            $table->unsignedSmallInteger('replies')->default(0);
            $table->unsignedSmallInteger('staffreplies')->default(0);
            $table->unsignedSmallInteger('owner')->default(0);
            $table->unsignedMediumInteger('assignedby')->nullable();
            $table->time('time_worked')->default('00:00:00');
            $table->enum('lastreplier',['0','1'])->default('0');
            $table->unsignedSmallInteger('replierid')->nullable();
            $table->enum('archive',['0','1'])->default('0');
            $table->enum('locked', ['0','1'])->default('0');
            $table->mediumText('attachments')->nullable();
            $table->string('merged')->default('');
            $table->string('history')->default('');
            // for ($i = 1; $i <= 50; $i++){
            //     $table->mediumText("custom$i");
            // }
            $table->timestamp('due_date')->nullable();
            $table->boolean('overdue_email_sent')->default(0);
            $table->boolean('satisfaction_email_sent')->default(0);
            $table->timestamp('satisfaction_email_dt')->nullable();
            $table->timestamps();
            

            // Indexes
            $table->index('trackid');
            $table->index('archive');
            $table->index('category');
            $table->index('status');
            $table->index('owner');
            $table->index(['openedby', 'firstreplyby', 'closedby']);
            $table->index('dt');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hesk_tickets');
    }
};
