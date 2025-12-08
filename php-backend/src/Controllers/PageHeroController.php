<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class PageHeroController extends BaseController
{
    public function index($pageId)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $heroes = $this->db->fetchAll(
                'SELECT * FROM PageHero WHERE pageId = ? ORDER BY `order` ASC, createdAt ASC',
                [$pageId]
            );

            Response::json($heroes);
        }
    }

    public function create($pageId = null)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $data = $this->getJsonInput();
        
        // If pageId is not in URL, get from body
        if (!$pageId) {
            $pageId = $data['pageId'] ?? null;
        }

        if (!$pageId) {
            Response::error('pageId is required', 400);
        }

        // Validate pageId exists
        $page = $this->db->fetchOne('SELECT id FROM Page WHERE id = ?', [$pageId]);
        if (!$page) {
            Response::error('Page not found: ' . $pageId, 404);
        }

        // Get max order for this page
        $maxOrder = $this->db->fetchOne('SELECT MAX(`order`) as maxOrder FROM PageHero WHERE pageId = ?', [$pageId]);
        $nextOrder = ($maxOrder && $maxOrder['maxOrder'] !== null) ? ($maxOrder['maxOrder'] + 1) : 0;
        
        $id = Utils::generateId();

        // Create new hero
        $this->db->query(
            'INSERT INTO PageHero (id, pageId, title, titleEn, subtitle, subtitleEn, 
             image, videoUrl, videoFile, videoDuration, buttonText, buttonTextEn, buttonUrl, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $pageId,
                $data['title'] ?? null,
                $data['titleEn'] ?? null,
                $data['subtitle'] ?? null,
                $data['subtitleEn'] ?? null,
                $data['image'] ?? null,
                $data['videoUrl'] ?? null,
                $data['videoFile'] ?? null,
                $data['videoDuration'] ?? null,
                $data['buttonText'] ?? null,
                $data['buttonTextEn'] ?? null,
                $data['buttonUrl'] ?? null,
                $data['order'] ?? $nextOrder,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );
        $hero = $this->db->fetchOne('SELECT * FROM PageHero WHERE id = ?', [$id]);

        Response::json($hero);
    }

    public function show($id)
    {
        $hero = $this->db->fetchOne('SELECT * FROM PageHero WHERE id = ?', [$id]);
        
        if (!$hero) {
            Response::error('PageHero not found', 404);
            return;
        }

        Response::json($hero);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM PageHero WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('PageHero not found', 404);
        }

        $data = $this->getJsonInput();

        $this->db->query(
            'UPDATE PageHero SET title = ?, titleEn = ?, subtitle = ?, subtitleEn = ?, 
             image = ?, videoUrl = ?, videoFile = ?, videoDuration = ?, buttonText = ?, buttonTextEn = ?, buttonUrl = ?, 
             `order` = ?, isActive = ? WHERE id = ?',
            [
                $data['title'] ?? $existing['title'],
                $data['titleEn'] ?? $existing['titleEn'],
                $data['subtitle'] ?? $existing['subtitle'],
                $data['subtitleEn'] ?? $existing['subtitleEn'],
                $data['image'] ?? $existing['image'],
                $data['videoUrl'] ?? $existing['videoUrl'],
                $data['videoFile'] ?? $existing['videoFile'] ?? null,
                $data['videoDuration'] ?? $existing['videoDuration'] ?? null,
                $data['buttonText'] ?? $existing['buttonText'],
                $data['buttonTextEn'] ?? $existing['buttonTextEn'],
                $data['buttonUrl'] ?? $existing['buttonUrl'],
                $data['order'] ?? $existing['order'] ?? 0,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
                $id,
            ]
        );

        $hero = $this->db->fetchOne('SELECT * FROM PageHero WHERE id = ?', [$id]);
        Response::json($hero);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM PageHero WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('PageHero not found', 404);
        }

        $this->db->query('DELETE FROM PageHero WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

