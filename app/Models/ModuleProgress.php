<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleProgress extends Model
{
    protected $table = 'module_progress';

    protected $fillable = [
        'member_id',
        'module_id',
        'course_id',
        'completed_at',
    ];
}