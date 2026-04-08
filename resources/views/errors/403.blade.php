<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 - Forbidden</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
            background: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            text-align: center;
            max-width: 600px;
        }

        .error-code {
            font-size: 120px;
            font-weight: 700;
            color: #4a4a4a;
            margin-bottom: 10px;
            line-height: 1;
            letter-spacing: -2px;
        }

        h1 {
            font-size: 48px;
            color: #4a7c8f;
            margin-bottom: 20px;
            font-weight: 600;
            letter-spacing: 1px;
        }

        .message {
            font-size: 18px;
            color: #888888;
            margin-bottom: 40px;
            line-height: 1.6;
        }

        .btn-home {
            display: inline-block;
            padding: 12px 30px;
            background: #4a7c8f;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 500;
            transition: background 0.3s ease;
        }

        .btn-home:hover {
            background: #3a5f78;
        }

        @media (max-width: 600px) {
            .error-code {
                font-size: 80px;
            }

            h1 {
                font-size: 36px;
            }

            .message {
                font-size: 16px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="error-code">403</div>
        <h1>Forbidden</h1>
        <p class="message">Access to this resource on the server is denied!</p>
        @if (Auth::check())
        @if (Auth::user()->type === 'mentor')
        <a href="{{ route('mentor.dashboard') }}" class="btn-home">Kembali ke Dashboard Mentor</a>
        @elseif (Auth::user()->type === 'member')
        <a href="{{ route('member.dashboard') }}" class="btn-home">Kembali ke Dashboard Member</a>
        @elseif (Auth::user()->type === 'admin')
        <a href="{{ route('admin.dashboard') }}" class="btn-home">Kembali ke Dashboard Admin</a>
        @endif
        @else
        <a href="{{ route('welcome') }}" class="btn-home">Kembali ke Halaman Utama</a>
        @endif
    </div>
</body>

</html>