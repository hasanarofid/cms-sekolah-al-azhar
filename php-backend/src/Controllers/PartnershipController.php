<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class PartnershipController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $partnerships = $this->db->fetchAll(
                'SELECT * FROM Partnership WHERE isActive = 1 ORDER BY category ASC, `order` ASC'
            );

            Response::json($partnerships);
        }
    }

    public function create()
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $data = $this->getJsonInput();
        $id = Utils::generateId();

        $this->db->query(
            'INSERT INTO Partnership (id, name, nameEn, logo, category, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['name'] ?? '',
                $data['nameEn'] ?? null,
                $data['logo'] ?? '',
                $data['category'] ?? '',
                $data['order'] ?? 0,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );

        $partnership = $this->db->fetchOne('SELECT * FROM Partnership WHERE id = ?', [$id]);
        Response::json($partnership);
    }

    public function show($id)
    {
        $partnership = $this->db->fetchOne('SELECT * FROM Partnership WHERE id = ?', [$id]);
        
        if (!$partnership) {
            Response::error('Partnership not found', 404);
        }

        Response::json($partnership);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Partnership WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Partnership not found', 404);
        }

        $data = $this->getJsonInput();

        $this->db->query(
            'UPDATE Partnership SET name = ?, nameEn = ?, logo = ?, category = ?, `order` = ?, 
             isActive = ? WHERE id = ?',
            [
                $data['name'] ?? $existing['name'],
                $data['nameEn'] ?? $existing['nameEn'],
                $data['logo'] ?? $existing['logo'],
                $data['category'] ?? $existing['category'],
                $data['order'] ?? $existing['order'],
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
                $id,
            ]
        );

        $partnership = $this->db->fetchOne('SELECT * FROM Partnership WHERE id = ?', [$id]);
        Response::json($partnership);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Partnership WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Partnership not found', 404);
        }

        $this->db->query('DELETE FROM Partnership WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

