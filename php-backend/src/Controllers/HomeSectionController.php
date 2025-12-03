<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class HomeSectionController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Check if this is an admin request (authenticated)
            // For admin, show all sections (including inactive)
            // For public, only show active sections
            $isAdmin = $this->isAuthenticated();
            
            if ($isAdmin) {
                // Admin: show all sections
                $sections = $this->db->fetchAll(
                    'SELECT * FROM HomeSection ORDER BY `order` ASC'
                );
            } else {
                // Public: only show active sections
                $sections = $this->db->fetchAll(
                    'SELECT * FROM HomeSection WHERE isActive = 1 ORDER BY `order` ASC'
                );
            }

            // Parse images JSON to array
            foreach ($sections as &$section) {
                if ($section['images']) {
                    $decoded = json_decode($section['images'], true);
                    $section['images'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['images'] = [];
                }
                // Parse faqItems JSON to array
                if (isset($section['faqItems']) && $section['faqItems']) {
                    $decoded = json_decode($section['faqItems'], true);
                    $section['faqItems'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['faqItems'] = [];
                }
                // Parse figures JSON to array
                if (isset($section['figures']) && $section['figures']) {
                    $decoded = json_decode($section['figures'], true);
                    $section['figures'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['figures'] = [];
                }
                // Parse partnerships JSON to array
                if (isset($section['partnerships']) && $section['partnerships']) {
                    $decoded = json_decode($section['partnerships'], true);
                    $section['partnerships'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['partnerships'] = [];
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
        
        $faqItems = isset($data['faqItems']) 
            ? (is_string($data['faqItems']) ? $data['faqItems'] : json_encode($data['faqItems']))
            : null;
        
        $figures = isset($data['figures']) 
            ? (is_string($data['figures']) ? $data['figures'] : json_encode($data['figures']))
            : null;
        
        $partnerships = isset($data['partnerships']) 
            ? (is_string($data['partnerships']) ? $data['partnerships'] : json_encode($data['partnerships']))
            : null;

        $this->db->query(
            'INSERT INTO HomeSection (id, type, title, titleEn, subtitle, subtitleEn, content, 
             contentEn, image, imageLeft, imageRight, images, videoUrl, buttonText, buttonTextEn, buttonUrl, faqItems, figures, partnerships, mapEmbedUrl, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
                $data['imageLeft'] ?? null,
                $data['imageRight'] ?? null,
                $images,
                $data['videoUrl'] ?? null,
                $data['buttonText'] ?? null,
                $data['buttonTextEn'] ?? null,
                $data['buttonUrl'] ?? null,
                $faqItems,
                $figures,
                $partnerships,
                $data['mapEmbedUrl'] ?? null,
                $data['order'] ?? 0,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );

        $section = $this->db->fetchOne('SELECT * FROM HomeSection WHERE id = ?', [$id]);
        if ($section['images']) {
            $section['images'] = json_decode($section['images'], true);
        }
        if (isset($section['faqItems']) && $section['faqItems']) {
            $section['faqItems'] = json_decode($section['faqItems'], true);
        } else {
            $section['faqItems'] = [];
        }
        if (isset($section['figures']) && $section['figures']) {
            $section['figures'] = json_decode($section['figures'], true);
        } else {
            $section['figures'] = [];
        }
        if (isset($section['partnerships']) && $section['partnerships']) {
            $section['partnerships'] = json_decode($section['partnerships'], true);
        } else {
            $section['partnerships'] = [];
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
        // Decode faqItems JSON to array
        if (isset($section['faqItems']) && $section['faqItems']) {
            $decoded = json_decode($section['faqItems'], true);
            $section['faqItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['faqItems'] = [];
        }
        // Decode figures JSON to array
        if (isset($section['figures']) && $section['figures']) {
            $decoded = json_decode($section['figures'], true);
            $section['figures'] = $decoded !== null ? $decoded : [];
        } else {
            $section['figures'] = [];
        }
        // Decode partnerships JSON to array
        if (isset($section['partnerships']) && $section['partnerships']) {
            $decoded = json_decode($section['partnerships'], true);
            $section['partnerships'] = $decoded !== null ? $decoded : [];
        } else {
            $section['partnerships'] = [];
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
        
        $faqItems = isset($data['faqItems']) 
            ? (is_string($data['faqItems']) ? $data['faqItems'] : json_encode($data['faqItems']))
            : ($existing['faqItems'] ?? null);
        
        $figures = isset($data['figures']) 
            ? (is_string($data['figures']) ? $data['figures'] : json_encode($data['figures']))
            : ($existing['figures'] ?? null);
        
        $partnerships = isset($data['partnerships']) 
            ? (is_string($data['partnerships']) ? $data['partnerships'] : json_encode($data['partnerships']))
            : ($existing['partnerships'] ?? null);

        $this->db->query(
            'UPDATE HomeSection SET type = ?, title = ?, titleEn = ?, subtitle = ?, subtitleEn = ?, 
             content = ?, contentEn = ?, image = ?, imageLeft = ?, imageRight = ?, images = ?, videoUrl = ?, buttonText = ?, 
             buttonTextEn = ?, buttonUrl = ?, faqItems = ?, figures = ?, partnerships = ?, mapEmbedUrl = ?, `order` = ?, isActive = ? WHERE id = ?',
            [
                $data['type'] ?? $existing['type'],
                $data['title'] ?? $existing['title'],
                $data['titleEn'] ?? $existing['titleEn'],
                $data['subtitle'] ?? $existing['subtitle'],
                $data['subtitleEn'] ?? $existing['subtitleEn'],
                $data['content'] ?? $existing['content'],
                $data['contentEn'] ?? $existing['contentEn'],
                $data['image'] ?? $existing['image'],
                $data['imageLeft'] ?? $existing['imageLeft'],
                $data['imageRight'] ?? $existing['imageRight'],
                $images,
                $data['videoUrl'] ?? $existing['videoUrl'],
                $data['buttonText'] ?? $existing['buttonText'],
                $data['buttonTextEn'] ?? $existing['buttonTextEn'],
                $data['buttonUrl'] ?? $existing['buttonUrl'],
                $faqItems,
                $figures,
                $partnerships,
                $data['mapEmbedUrl'] ?? $existing['mapEmbedUrl'] ?? null,
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
        // Decode partnerships JSON to array
        if (isset($section['partnerships']) && $section['partnerships']) {
            $decoded = json_decode($section['partnerships'], true);
            $section['partnerships'] = $decoded !== null ? $decoded : [];
        } else {
            $section['partnerships'] = [];
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

