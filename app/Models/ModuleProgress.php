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

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
