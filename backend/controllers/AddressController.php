<?php

declare(strict_types=1);

namespace Backend\Controllers;

use Backend\Models\Address;
use Backend\Utils\Response;
use Backend\Utils\Validator;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/Address.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';

final class AddressController extends BaseController
{
    public function index(array $params = []): void
    {
        $auth = $this->currentAuth();
        if (!$auth) {
            Response::error('Unauthorized', 401);
        }

        $userId = (int) ($auth['id'] ?? 0);
        if ($userId <= 0) {
            Response::error('Invalid user.', 422);
        }

        $model = new Address();
        $addresses = $model->findByUserId($userId);

        Response::success(array_map([$this, 'serializeAddress'], $addresses), 'Addresses fetched successfully');
    }

    public function store(array $params = []): void
    {
        $auth = $this->currentAuth();
        if (!$auth) {
            Response::error('Unauthorized', 401);
        }

        $userId = (int) ($auth['id'] ?? 0);
        if ($userId <= 0) {
            Response::error('Invalid user.', 422);
        }

        $payload = Validator::sanitizeInput($this->body());

        $label = trim((string) ($payload['label'] ?? ''));
        $firstName = trim((string) ($payload['first_name'] ?? ''));
        $lastName = trim((string) ($payload['last_name'] ?? ''));
        $phone = trim((string) ($payload['phone'] ?? ''));
        $email = trim((string) ($payload['email'] ?? ''));
        $street = trim((string) ($payload['street_address'] ?? ''));
        $apartment = trim((string) ($payload['apartment'] ?? ''));
        $city = trim((string) ($payload['city'] ?? ''));
        $state = trim((string) ($payload['state'] ?? ''));
        $postal = trim((string) ($payload['postal_code'] ?? ''));
        $country = trim((string) ($payload['country'] ?? ''));
        $isDefault = (bool) ($payload['is_default'] ?? false);

        if ($firstName === '' || $phone === '' || $street === '' || $city === '' || $country === '') {
            Response::error('First name, phone, street address, city, and country are required.', 422);
        }

        if (!preg_match('/^[0-9\-\+\s\(\)]{7,}$/', $phone)) {
            Response::error('A valid phone number is required.', 422);
        }

        $model = new Address();
        $id = $model->create([
            'user_id' => $userId,
            'label' => $label,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'phone' => $phone,
            'email' => $email,
            'street_address' => $street,
            'apartment' => $apartment,
            'city' => $city,
            'state' => $state,
            'postal_code' => $postal,
            'country' => $country,
            'is_default' => $isDefault ? 1 : 0,
        ]);

        if ($isDefault) {
            $model->setDefaultAddress($userId, $id);
        }

        $created = $model->find($id);
        Response::success($this->serializeAddress($created ?: []), 'Address created successfully', 201);
    }

    public function show(array $params): void
    {
        $auth = $this->currentAuth();
        if (!$auth) {
            Response::error('Unauthorized', 401);
        }

        $userId = (int) ($auth['id'] ?? 0);
        $addressId = (int) ($params['id'] ?? 0);

        if ($addressId <= 0) {
            Response::error('Invalid address ID.', 422);
        }

        $model = new Address();
        $address = $model->find($addressId);

        if (!$address || (int) ($address['user_id'] ?? 0) !== $userId) {
            Response::error('Address not found.', 404);
        }

        Response::success($this->serializeAddress($address), 'Address fetched successfully');
    }

    public function update(array $params): void
    {
        $auth = $this->currentAuth();
        if (!$auth) {
            Response::error('Unauthorized', 401);
        }

        $userId = (int) ($auth['id'] ?? 0);
        $addressId = (int) ($params['id'] ?? 0);

        if ($addressId <= 0) {
            Response::error('Invalid address ID.', 422);
        }

        $model = new Address();
        $existing = $model->find($addressId);

        if (!$existing || (int) ($existing['user_id'] ?? 0) !== $userId) {
            Response::error('Address not found.', 404);
        }

        $payload = Validator::sanitizeInput($this->body());
        $update = [];

        if (array_key_exists('label', $payload)) {
            $update['label'] = trim((string) $payload['label']);
        }
        if (array_key_exists('first_name', $payload)) {
            $firstName = trim((string) $payload['first_name']);
            if ($firstName === '') Response::error('First name cannot be empty.', 422);
            $update['first_name'] = $firstName;
        }
        if (array_key_exists('last_name', $payload)) {
            $update['last_name'] = trim((string) $payload['last_name']);
        }
        if (array_key_exists('phone', $payload)) {
            $phone = trim((string) $payload['phone']);
            if ($phone === '' || !preg_match('/^[0-9\-\+\s\(\)]{7,}$/', $phone)) {
                Response::error('A valid phone number is required.', 422);
            }
            $update['phone'] = $phone;
        }
        if (array_key_exists('email', $payload)) {
            $email = trim((string) $payload['email']);
            if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                Response::error('A valid email is required.', 422);
            }
            $update['email'] = $email;
        }
        if (array_key_exists('street_address', $payload)) {
            $street = trim((string) $payload['street_address']);
            if ($street === '') Response::error('Street address cannot be empty.', 422);
            $update['street_address'] = $street;
        }
        if (array_key_exists('apartment', $payload)) {
            $update['apartment'] = trim((string) $payload['apartment']);
        }
        if (array_key_exists('city', $payload)) {
            $city = trim((string) $payload['city']);
            if ($city === '') Response::error('City cannot be empty.', 422);
            $update['city'] = $city;
        }
        if (array_key_exists('state', $payload)) {
            $update['state'] = trim((string) $payload['state']);
        }
        if (array_key_exists('postal_code', $payload)) {
            $update['postal_code'] = trim((string) $payload['postal_code']);
        }
        if (array_key_exists('country', $payload)) {
            $country = trim((string) $payload['country']);
            if ($country === '') Response::error('Country cannot be empty.', 422);
            $update['country'] = $country;
        }

        if (array_key_exists('is_default', $payload) && (bool) $payload['is_default']) {
            $model->setDefaultAddress($userId, $addressId);
        }

        if ($update === []) {
            Response::error('No changes provided.', 422);
        }

        $model->update($addressId, $update);
        $saved = $model->find($addressId);
        Response::success($this->serializeAddress($saved ?: []), 'Address updated successfully');
    }

    public function destroy(array $params): void
    {
        $auth = $this->currentAuth();
        if (!$auth) {
            Response::error('Unauthorized', 401);
        }

        $userId = (int) ($auth['id'] ?? 0);
        $addressId = (int) ($params['id'] ?? 0);

        if ($addressId <= 0) {
            Response::error('Invalid address ID.', 422);
        }

        $model = new Address();
        $existing = $model->find($addressId);

        if (!$existing || (int) ($existing['user_id'] ?? 0) !== $userId) {
            Response::error('Address not found.', 404);
        }

        $model->delete($addressId);
        Response::success(null, 'Address deleted successfully');
    }

    private function serializeAddress(array $row): array
    {
        return [
            'id' => (int) ($row['id'] ?? 0),
            'user_id' => (int) ($row['user_id'] ?? 0),
            'label' => (string) ($row['label'] ?? ''),
            'first_name' => (string) ($row['first_name'] ?? ''),
            'last_name' => (string) ($row['last_name'] ?? ''),
            'phone' => (string) ($row['phone'] ?? ''),
            'email' => (string) ($row['email'] ?? ''),
            'street_address' => (string) ($row['street_address'] ?? ''),
            'apartment' => (string) ($row['apartment'] ?? ''),
            'city' => (string) ($row['city'] ?? ''),
            'state' => (string) ($row['state'] ?? ''),
            'postal_code' => (string) ($row['postal_code'] ?? ''),
            'country' => (string) ($row['country'] ?? ''),
            'is_default' => (bool) ($row['is_default'] ?? false),
            'created_at' => $row['created_at'] ?? null,
            'updated_at' => $row['updated_at'] ?? null,
        ];
    }
}
