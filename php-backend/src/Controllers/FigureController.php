<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class FigureController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $figures = $this->db->fetchAll(
                'SELECT * FROM Figure WHERE isActive = 1 ORDER BY `order` ASC'
            );

            Response::json($figures);
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
            'INSERT INTO Figure (id, name, nameEn, position, positionEn, image, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['name'] ?? '',
                $data['nameEn'] ?? null,
                $data['position'] ?? '',
                $data['positionEn'] ?? null,
                $data['image'] ?? '',
                $data['order'] ?? 0,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );

        $figure = $this->db->fetchOne('SELECT * FROM Figure WHERE id = ?', [$id]);
        Response::json($figure);
    }

    public function show($id)
    {
        $figure = $this->db->fetchOne('SELECT * FROM Figure WHERE id = ?', [$id]);
        
        if (!$figure) {
            Response::error('Figure not found', 404);
        }

        Response::json($figure);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Figure WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Figure not found', 404);
        }

        $data = $this->getJsonInput();

        $this->db->query(
            'UPDATE Figure SET name = ?, nameEn = ?, position = ?, positionEn = ?, image = ?, 
             `order` = ?, isActive = ? WHERE id = ?',
            [
                $data['name'] ?? $existing['name'],
                $data['nameEn'] ?? $existing['nameEn'],
                $data['position'] ?? $existing['position'],
                $data['positionEn'] ?? $existing['positionEn'],
                $data['image'] ?? $existing['image'],
                $data['order'] ?? $existing['order'],
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
                $id,
            ]
        );

        $figure = $this->db->fetchOne('SELECT * FROM Figure WHERE id = ?', [$id]);
        Response::json($figure);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Figure WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Figure not found', 404);
        }

        $this->db->query('DELETE FROM Figure WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

