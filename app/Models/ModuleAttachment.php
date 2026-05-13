<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleAttachment extends Model
{
    protected $fillable = [
        'module_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}