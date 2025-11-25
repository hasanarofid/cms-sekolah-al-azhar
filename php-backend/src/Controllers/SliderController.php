<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class SliderController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Check if this is admin request (has auth token)
            $isAdmin = false;
            $headers = getallheaders();
            if (isset($headers['Authorization']) || isset($headers['authorization'])) {
                $authHeader = $headers['Authorization'] ?? $headers['authorization'];
                if (strpos($authHeader, 'Bearer ') === 0) {
                    $isAdmin = true;
                }
            }
            
            // If admin, return all sliders. Otherwise, only active ones
            if ($isAdmin) {
                $sliders = $this->db->fetchAll(
                    'SELECT * FROM Slider ORDER BY `order` ASC'
                );
            } else {
                $sliders = $this->db->fetchAll(
                    'SELECT * FROM Slider WHERE isActive = 1 ORDER BY `order` ASC'
                );
            }

            Response::json($sliders);
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
            'INSERT INTO Slider (id, title, titleEn, subtitle, subtitleEn, image, buttonText, 
             buttonTextEn, buttonUrl, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['title'] ?? '',
                $data['titleEn'] ?? null,
                $data['subtitle'] ?? null,
                $data['subtitleEn'] ?? null,
                $data['image'] ?? '',
                $data['buttonText'] ?? null,
                $data['buttonTextEn'] ?? null,
                $data['buttonUrl'] ?? null,
                $data['order'] ?? 0,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );

        $slider = $this->db->fetchOne('SELECT * FROM Slider WHERE id = ?', [$id]);
        Response::json($slider);
    }

    public function show($id)
    {
        $slider = $this->db->fetchOne('SELECT * FROM Slider WHERE id = ?', [$id]);
        
        if (!$slider) {
            Response::error('Slider not found', 404);
        }

        Response::json($slider);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Slider WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Slider not found', 404);
        }

        $data = $this->getJsonInput();

        $this->db->query(
            'UPDATE Slider SET title = ?, titleEn = ?, subtitle = ?, subtitleEn = ?, image = ?, 
             buttonText = ?, buttonTextEn = ?, buttonUrl = ?, `order` = ?, isActive = ? WHERE id = ?',
            [
                $data['title'] ?? $existing['title'],
                $data['titleEn'] ?? $existing['titleEn'],
                $data['subtitle'] ?? $existing['subtitle'],
                $data['subtitleEn'] ?? $existing['subtitleEn'],
                $data['image'] ?? $existing['image'],
                $data['buttonText'] ?? $existing['buttonText'],
                $data['buttonTextEn'] ?? $existing['buttonTextEn'],
                $data['buttonUrl'] ?? $existing['buttonUrl'],
                $data['order'] ?? $existing['order'],
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
                $id,
            ]
        );

        $slider = $this->db->fetchOne('SELECT * FROM Slider WHERE id = ?', [$id]);
        Response::json($slider);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Slider WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Slider not found', 404);
        }

        $this->db->query('DELETE FROM Slider WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

