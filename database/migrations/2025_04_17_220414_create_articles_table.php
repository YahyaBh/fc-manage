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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('designation');

            $table->unsignedBigInteger('unite_id');
            $table->unsignedBigInteger('cat_family_id');
            $table->unsignedBigInteger('cat_sous_family_id');
            $table->unsignedBigInteger('user_id');

            $table->boolean('status')->default(true);
            $table->timestamps();

            $table->foreign('unite_id')->references('id')->on('unites')->onDelete('cascade');
            $table->foreign('cat_family_id')->references('id')->on('cat_family')->onDelete('cascade');
            $table->foreign('cat_sous_family_id')->references('id')->on('cat_sous_family')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
