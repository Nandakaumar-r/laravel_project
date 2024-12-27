<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user' => 'required|string|max:255|unique:hesk_users',
            'pass' => 'required|string|min:6',
            'isadmin' => 'required|in:0,1',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:hesk_users',
            'signature' => 'nullable|string|max:1000',
            'language' => 'nullable|string|max:50',
            'categories' => 'required|integer|exists:hesk_categories,id',
            // Add other validation rules as needed
        ];
    }
}
