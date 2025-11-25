<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class SettingController extends BaseController
{
    public function index()
    {
        // Public access untuk frontend, tidak perlu auth
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $settings = $this->db->fetchAll('SELECT * FROM Setting');
            Response::json($settings);
        }
    }

    public function create()
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $data = $this->getJsonInput();
        $key = $data['key'] ?? '';

        if (empty($key)) {
            Response::error('Key is required', 400);
        }

        // Check if exists
        $existing = $this->db->fetchOne('SELECT * FROM Setting WHERE `key` = ?', [$key]);

        if ($existing) {
            // Update
            $id = $existing['id'];
            $this->db->query(
                'UPDATE Setting SET value = ?, valueEn = ?, type = ? WHERE id = ?',
                [
                    $data['value'] ?? '',
                    $data['valueEn'] ?? null,
                    $data['type'] ?? 'text',
                    $id,
                ]
            );
        } else {
            // Create
            $id = Utils::generateId();
            $this->db->query(
                'INSERT INTO Setting (id, `key`, value, valueEn, type) VALUES (?, ?, ?, ?, ?)',
                [
                    $id,
                    $key,
                    $data['value'] ?? '',
                    $data['valueEn'] ?? null,
                    $data['type'] ?? 'text',
                ]
            );
        }

        $setting = $this->db->fetchOne('SELECT * FROM Setting WHERE id = ?', [$id]);
        Response::json($setting);
    }

    public function show($key)
    {
        $setting = $this->db->fetchOne('SELECT * FROM Setting WHERE `key` = ?', [$key]);
        
        if (!$setting) {
            Response::error('Setting not found', 404);
        }

        Response::json($setting);
    }

    public function update($key)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Setting WHERE `key` = ?', [$key]);
        if (!$existing) {
            Response::error('Setting not found', 404);
        }

        $data = $this->getJsonInput();

        $this->db->query(
            'UPDATE Setting SET value = ?, valueEn = ?, type = ? WHERE `key` = ?',
            [
                $data['value'] ?? $existing['value'],
                $data['valueEn'] ?? $existing['valueEn'],
                $data['type'] ?? $existing['type'],
                $key,
            ]
        );

        $setting = $this->db->fetchOne('SELECT * FROM Setting WHERE `key` = ?', [$key]);
        Response::json($setting);
    }
}

