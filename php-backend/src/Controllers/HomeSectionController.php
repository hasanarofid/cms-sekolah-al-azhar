<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class HomeSectionController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $sections = $this->db->fetchAll(
                'SELECT * FROM HomeSection WHERE isActive = 1 ORDER BY `order` ASC'
            );

            // Parse images JSON to array
            foreach ($sections as &$section) {
                if ($section['images']) {
                    $decoded = json_decode($section['images'], true);
                    $section['images'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['images'] = [];
                }
            }

            Response::json($sections);
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

        $images = isset($data['images']) 
            ? (is_string($data['images']) ? $data['images'] : json_encode($data['images']))
            : null;

        $this->db->query(
            'INSERT INTO HomeSection (id, type, title, titleEn, subtitle, subtitleEn, content, 
             contentEn, image, images, videoUrl, buttonText, buttonTextEn, buttonUrl, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['type'] ?? '',
                $data['title'] ?? null,
                $data['titleEn'] ?? null,
                $data['subtitle'] ?? null,
                $data['subtitleEn'] ?? null,
                $data['content'] ?? null,
                $data['contentEn'] ?? null,
                $data['image'] ?? null,
                $images,
                $data['videoUrl'] ?? null,
                $data['buttonText'] ?? null,
                $data['buttonTextEn'] ?? null,
                $data['buttonUrl'] ?? null,
                $data['order'] ?? 0,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );

        $section = $this->db->fetchOne('SELECT * FROM HomeSection WHERE id = ?', [$id]);
        if ($section['images']) {
            $section['images'] = json_decode($section['images'], true);
        }
        Response::json($section);
    }

    public function show($id)
    {
        $section = $this->db->fetchOne('SELECT * FROM HomeSection WHERE id = ?', [$id]);
        
        if (!$section) {
            Response::error('HomeSection not found', 404);
        }

        // Decode images JSON to array
        if ($section['images']) {
            $decoded = json_decode($section['images'], true);
            $section['images'] = $decoded !== null ? $decoded : [];
        } else {
            $section['images'] = [];
        }

        Response::json($section);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM HomeSection WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('HomeSection not found', 404);
        }

        $data = $this->getJsonInput();
        $images = isset($data['images']) 
            ? (is_string($data['images']) ? $data['images'] : json_encode($data['images']))
            : $existing['images'];

        $this->db->query(
            'UPDATE HomeSection SET type = ?, title = ?, titleEn = ?, subtitle = ?, subtitleEn = ?, 
             content = ?, contentEn = ?, image = ?, images = ?, videoUrl = ?, buttonText = ?, 
             buttonTextEn = ?, buttonUrl = ?, `order` = ?, isActive = ? WHERE id = ?',
            [
                $data['type'] ?? $existing['type'],
                $data['title'] ?? $existing['title'],
                $data['titleEn'] ?? $existing['titleEn'],
                $data['subtitle'] ?? $existing['subtitle'],
                $data['subtitleEn'] ?? $existing['subtitleEn'],
                $data['content'] ?? $existing['content'],
                $data['contentEn'] ?? $existing['contentEn'],
                $data['image'] ?? $existing['image'],
                $images,
                $data['videoUrl'] ?? $existing['videoUrl'],
                $data['buttonText'] ?? $existing['buttonText'],
                $data['buttonTextEn'] ?? $existing['buttonTextEn'],
                $data['buttonUrl'] ?? $existing['buttonUrl'],
                $data['order'] ?? $existing['order'],
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
                $id,
            ]
        );

        $section = $this->db->fetchOne('SELECT * FROM HomeSection WHERE id = ?', [$id]);
        // Decode images JSON to array
        if ($section['images']) {
            $decoded = json_decode($section['images'], true);
            $section['images'] = $decoded !== null ? $decoded : [];
        } else {
            $section['images'] = [];
        }
        Response::json($section);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM HomeSection WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('HomeSection not found', 404);
        }

        $this->db->query('DELETE FROM HomeSection WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

