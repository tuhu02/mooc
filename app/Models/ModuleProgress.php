<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleProgress extends Model
{
    protected $fillable = ['member_id', 'module_id', 'course_id', 'completed_at'];
    
    public function moduleProgress()
    {
        return $this->hasMany(\App\Models\ModuleProgress::class);
    }
}
