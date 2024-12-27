<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use Exception;

class AssetDetails extends Model
{
    // Method to fetch user by email
    public static function getUserByEmail($email, $bearerToken)
    {
        $apiUrl = 'https://fidelisam.in/api/v1/users';

        $response = Http::withToken($bearerToken)
            ->withOptions([
                'verify' => false, // Disable SSL verification temporarily
            ])
            ->get($apiUrl, ['search' => $email]);

        if ($response->failed()) {
            throw new Exception('Failed to fetch user data.');
        }

        $userData = $response->json();
        if (empty($userData['rows'])) {
            throw new Exception('No user associated with the given email.');
        }

        return $userData['rows'][0];
    }

    // Method to fetch assets by user ID
    public static function getAssetsByUserId($userId, $bearerToken)
    {
        $assetsApiUrl = "https://fidelisam.in/api/v1/users/$userId/assets";

        $response = Http::withToken($bearerToken)
            ->withOptions([
                'verify' => false, // Disable SSL verification temporarily
            ])
            ->get($assetsApiUrl);

        if ($response->failed()) {
            throw new Exception('Failed to fetch assets.');
        }

        $assetsData = $response->json();
        if (empty($assetsData['rows'])) {
            throw new Exception('No assets found for this user.');
        }

        return $assetsData['rows'];
    }
}
