<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Authorization is handled here via the UserPolicy — only an
     * Admin can reach this request successfully.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('user'));
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
            'role' => ['required', Rule::in(['admin', 'encoder'])],
        ];
    }

    /**
     * Extra safety net beyond the policy: even if somehow reached,
     * an Admin should never be able to demote or reject themselves —
     * that could lock the system with zero active admins.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $targetUser = $this->route('user');

            if ($this->user()->id === $targetUser->id) {
                if ($this->input('role') !== 'admin' || $this->input('status') !== 'approved') {
                    $validator->errors()->add('role', 'You cannot change your own role or approval status.');
                }
            }
        });
    }
}