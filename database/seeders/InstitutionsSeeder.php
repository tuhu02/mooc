<?php

namespace Database\Seeders;

use App\Models\Institution;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InstitutionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        $institutions = [
            ['name' => 'Universitas Pembangunan Nasional'],
            ['name' => 'Universitas Indonesia'],
            ['name' => 'Universitas Gadjah Mada'],
            ['name' => 'Institut Teknologi Bandung'],
            ['name' => 'Institut Pertanian Bogor'],
            ['name' => 'Universitas Brawijaya'],
            ['name' => 'Universitas Airlangga'],
            ['name' => 'Universitas Diponegoro'],
            ['name' => 'Universitas Padjadjaran'],
            ['name' => 'Universitas Sebelas Maret'],
            ['name' => 'Universitas Hasanuddin'],
            ['name' => 'Institut Teknologi Sepuluh Nopember'],
        ];

        foreach($institutions as $institution){
            Institution::create($institution);
        }
    }
}
