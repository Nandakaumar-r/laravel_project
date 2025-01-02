<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Artisan;

class EnvConfigController extends Controller
{


    /**
     * Retrieve SMTP configuration from the .env file.
     *
     * @return \Illuminate\Http\Response
     */
    public function getSmtpConfig()
    {
        $envFile = base_path('.env');

        if (File::exists($envFile)) {
            return response()->json([
                //'data' => Config::get('mail'),
                'smtp_host' => env('MAIL_HOST'),
                'smtp_port' => env('MAIL_PORT'),
                'smtp_username' => env('MAIL_USERNAME'),
                'smtp_password' => env('MAIL_PASSWORD'),
                'smtp_encryption' => env('MAIL_ENCRYPTION'),
                'smtp_from_address' => env('MAIL_FROM_ADDRESS'),
                'smtp_from_name' => env('MAIL_FROM_NAME'),
            ], 200);
        }

        return response()->json(['message' => 'Unable to fetch SMTP configuration.'], 500);
    }

    /**
     * Retrieve SMTP configuration from the .env file.
     *
     * @return \Illuminate\Http\Response
     */
    public function getDbConfig()
    {
        $envFile = base_path('.env');

        if (File::exists($envFile)) {
            return response()->json([
                //'data' => Config::get('mail'),
                'db_host' => env('DB_HOST'),
                'db_name' => env('DB_DATABASE'),
                'db_username' => env('DB_USERNAME'),
                'db_password' => env('DB_PASSWORD'),
                'db_port' => env('DB_PORT'),
                'app_url' => env('APP_URL'),
                'app_name' => env('APP_NAME'),
            ], 200);
        }

        return response()->json(['message' => 'Unable to fetch Database configuration.'], 500);
    }

    /**
     * Update SMTP configuration in the .env file.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */ public function updateDbConfig(Request $request)
    {
        // Validate incoming data
        $validatedData = $request->validate([
            'db_host' => 'nullable|string',
            'db_name' => 'nullable|string',
            'db_username' => 'nullable|string',
            'db_password' => 'nullable|string',
            'db_port' => 'nullable|integer',
            'app_url' => 'nullable|string',
            'app_name' => 'nullable|string',
        ]);

        $envFile = base_path('.env');

        if (File::exists($envFile)) {
            // Update the .env file with SMTP configuration
            $this->updateEnvFile('DB_HOST', $validatedData['db_host']);
            $this->updateEnvFile('DB_DATABASE', $validatedData['db_name']);
            $this->updateEnvFile('DB_USERNAME', $validatedData['db_username']);
            $this->updateEnvFile('DB_PASSWORD', $validatedData['db_password']);
            $this->updateEnvFile('DB_PORT', $validatedData['db_port']);
            $this->updateEnvFile('APP_URL', $validatedData['app_url']);
            $this->updateEnvFile('APP_NAME', $validatedData['app_name']);

            // Optionally, clear cache after updating the .env file
            // Artisan::call('config:clear');

            return response()->json([
                'success' => true,
                'message' => 'Database configuration updated successfully.',
                'data' => $validatedData,
            ], 200);
        }

        return response()->json(['message' => 'Failed to update the .env file.'], 500);
    }

    /**
     * Update SMTP configuration in the .env file.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */ public function updateSmtpConfig(Request $request)
    {
        // Validate incoming data
        $validatedData = $request->validate([
            'smtp_host' => 'nullable|string',
            'smtp_port' => 'nullable|integer',
            'smtp_username' => 'nullable|string',
            'smtp_password' => 'nullable|string',
            'smtp_encryption' => 'nullable|string',
            'smtp_from_address' => 'required|string',
            'smtp_from_name' => 'required|string',
        ]);

        $envFile = base_path('.env');

        if (File::exists($envFile)) {
            // Update the .env file with SMTP configuration
            $this->updateEnvFile('MAIL_HOST', $validatedData['smtp_host']);
            $this->updateEnvFile('MAIL_PORT', $validatedData['smtp_port']);
            $this->updateEnvFile('MAIL_USERNAME', $validatedData['smtp_username']);
            $this->updateEnvFile('MAIL_PASSWORD', $validatedData['smtp_password']);
            $this->updateEnvFile('MAIL_ENCRYPTION', $validatedData['smtp_encryption']);

            // Save only these two fields as quoted strings
            $this->updateEnvFile('MAIL_FROM_ADDRESS', $validatedData['smtp_from_address'], true);
            $this->updateEnvFile('MAIL_FROM_NAME', $validatedData['smtp_from_name'], true);

            // Optionally, clear cache after updating the .env file
            // Artisan::call('config:clear');

            return response()->json([
                'success' => true,
                'message' => 'SMTP configuration updated successfully.',
                'data' => $validatedData,
            ], 200);
        }

        return response()->json(['message' => 'Failed to update the .env file.'], 500);
    }


    /**
     * Helper function to update values in the .env file.
     *
     * @param string $key
     * @param string $value
     * @param bool $quoted Determines if the value should be enclosed in double quotes.
     * @return void
     */
    protected function updateEnvFile($key, $value, $quoted = false)
    {
        $envPath = base_path('.env');

        if (file_exists($envPath)) {
            $content = file_get_contents($envPath);

            // If the value needs to be quoted, wrap it in double quotes
            if ($quoted) {
                $value = addslashes($value); // Escape special characters
                $value = "\"{$value}\"";     // Wrap in double quotes
            }

            // Check if the key exists, and update it; otherwise, append it
            if (preg_match("/^{$key}=.*/m", $content)) {
                $content = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $content);
            } else {
                $content .= "\n{$key}={$value}";
            }

            file_put_contents($envPath, $content);
        }
    }
}
