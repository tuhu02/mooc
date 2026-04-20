<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Vimeo\Exceptions\VimeoRequestException;
use Vimeo\Exceptions\VimeoException;
use Vimeo\Vimeo;

class ModuleController extends Controller
{
    public function index(Request $request)
    {
        $courseId = $request->integer('course_id');

        $modules = Module::with('course')
            ->when($request->filled('course_id'), function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->orderBy('course_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->cursorPaginate(10)
            ->withQueryString();

        return Inertia::render('admin/modules/index', [
            'modules' => fn() => $modules,
            'courses' => fn() => Course::orderBy('title')->get(['id', 'title']),
            'filters' => [
                'course_id' => $request->input('course_id', ''),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/modules/create', [
            'courses' => Course::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'video' => 'nullable|file|mimes:mp4,mov,avi,mkv,webm|max:102400',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('modules', 'public');
        }

        if ($request->hasFile('video')) {
            $validated['video'] = $this->uploadVideoToVimeo(
                $request->file('video'),
                $validated['title'],
            );
        }

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('module-attachments', 'public');
        }

        $maxSortOrder = Module::where('course_id', $validated['course_id'])->max('sort_order') ?? 0;
        $validated['sort_order'] = $maxSortOrder + 1;

        Module::create($validated);

        return Redirect::route('admin.modules.index')
            ->with('success', 'Module Successfully Created!');
    }

    public function edit(Request $request, Module $module)
    {
        $module->load('course');

        return Inertia::render('admin/modules/edit', [
            'module' => $module,
            'courses' => Course::all(),
            'filters' => [
                'course_id' => $request->query('course_id', ''),
            ],
        ]);
    }

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'video' => 'nullable|file|mimes:mp4,mov,avi,mkv,webm|max:102400',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($module->thumbnail) {
                Storage::disk('public')->delete($module->thumbnail);
            }

            $validated['thumbnail'] = $request->file('thumbnail')->store('modules', 'public');
        }

        if ($request->hasFile('video')) {
            $validated['video'] = $this->uploadVideoToVimeo(
                $request->file('video'),
                $validated['title'],
            );
        }

        if ($request->hasFile('attachment')) {
            if ($module->attachment && !str_contains($module->attachment, '://')) {
                Storage::disk('public')->delete($module->attachment);
            }

            $validated['attachment'] = $request->file('attachment')->store('module-attachments', 'public');
        } else {
            unset($validated['attachment']);
        }

        $module->update($validated);

        $filterCourseId = $request->query('course_id');

        return Redirect::route('admin.modules.index', [
            'course_id' => $filterCourseId !== null && $filterCourseId !== '' ? $filterCourseId : null,
        ])
            ->with('success', 'Module Successfully Updated!');
    }


    public function destroy(Module $module)
    {
        if ($module->thumbnail) {
            Storage::disk('public')->delete($module->thumbnail);
        }

        if ($module->attachment && !str_contains($module->attachment, '://')) {
            Storage::disk('public')->delete($module->attachment);
        }

        $module->delete();

        return redirect()->back()->with('success', 'Module Successfully Deleted!');
    }

    private function uploadVideoToVimeo(UploadedFile $videoFile, string $title): string
    {
        $clientId = config('services.vimeo.client_id');
        $clientSecret = config('services.vimeo.client_secret');
        $accessToken = config('services.vimeo.access_token');

        $client = new Vimeo($clientId, $clientSecret, $accessToken);

        try {
            $videoUri = $client->upload($videoFile->getRealPath(), [
                'name' => $title,
                'privacy' => [
                    'view' => 'unlisted',
                ],
            ]);

            $response = $client->request($videoUri, ['fields' => 'link'], 'GET');

            if (($response['status'] ?? null) !== 200) {
                throw ValidationException::withMessages([
                    'video' => 'Video berhasil diupload, tetapi URL Vimeo gagal diambil.',
                ]);
            }

            return $response['body']['link'] ?? 'https://vimeo.com' . ltrim($videoUri, '/');
        } catch (VimeoRequestException $exception) {
            throw ValidationException::withMessages([
                'video' => 'Gagal upload video ke Vimeo: ' . $exception->getMessage(),
            ]);
        } catch (VimeoException $exception) {
            throw ValidationException::withMessages([
                'video' => 'Gagal upload video ke Vimeo: ' . $exception->getMessage(),
            ]);
        } catch (\Throwable $throwable) {
            throw ValidationException::withMessages([
                'video' => 'Gagal upload video ke Vimeo: ' . $throwable->getMessage(),
            ]);
        }
    }


    public function reorder(Request $request)
    {
        $request->validate([
            'items'             => 'required|array|min:1',
            'items.*.id'        => 'required|integer|exists:modules,id',
            'items.*.sort_order' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request): void {
            foreach ($request->input('items') as $item) {
                Module::where('id', $item['id'])
                    ->update(['sort_order' => $item['sort_order']]);
            }
        });

        return back();
    }
}
