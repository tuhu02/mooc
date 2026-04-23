<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    protected $fillable = [
        'assignment_id',
        'member_id',
        'submission_name',
        'description',
        'file',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }
}
