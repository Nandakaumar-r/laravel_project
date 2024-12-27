<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHeskTempAttachmentsLimitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hesk_temp_attachments_limits', function (Blueprint $table) {
            $table->string('ip', 45)->default('');
            $table->unsignedInteger('upload_count')->default(1);
            $table->timestamp('last_upload_at')->useCurrent();

            $table->primary('ip');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hesk_temp_attachments_limits');
    }
}
