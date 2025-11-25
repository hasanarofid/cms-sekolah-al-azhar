<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class PageController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $pages = $this->db->fetchAll(
                'SELECT p.*, u.name as authorName FROM Page p 
                 LEFT JOIN User u ON p.authorId = u.id 
                 ORDER BY p.createdAt DESC'
            );

            Response::json($pages);
        }
    }

    public function create()
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $data = $this->getJsonInput();
        $user = $this->getUser();
        $id = Utils::generateId();

        $this->db->query(
            'INSERT INTO Page (id, title, titleEn, slug, content, contentEn, excerpt, excerptEn, 
             featuredImage, menuId, pageType, template, seoTitle, seoDescription, seoKeywords, 
             isPublished, publishedAt, authorId) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['title'] ?? '',
                $data['titleEn'] ?? null,
                $data['slug'] ?? '',
                $data['content'] ?? '',
                $data['contentEn'] ?? null,
                $data['excerpt'] ?? null,
                $data['excerptEn'] ?? null,
                $data['featuredImage'] ?? null,
                $data['menuId'] ?? null,
                $data['pageType'] ?? 'standard',
                $data['template'] ?? null,
                $data['seoTitle'] ?? null,
                $data['seoDescription'] ?? null,
                $data['seoKeywords'] ?? null,
                $data['isPublished'] ?? false ? 1 : 0,
                ($data['isPublished'] ?? false) ? date('Y-m-d H:i:s') : null,
                $user['id'],
            ]
        );

        $page = $this->db->fetchOne('SELECT * FROM Page WHERE id = ?', [$id]);
        Response::json($page);
    }

    public function show($id)
    {
        $page = $this->db->fetchOne('SELECT * FROM Page WHERE id = ?', [$id]);
        
        if (!$page) {
            Response::error('Page not found', 404);
        }

        // Load blocks for this page
        $blocks = $this->db->fetchAll(
            'SELECT * FROM PageBlock WHERE pageId = ? ORDER BY `order` ASC',
            [$id]
        );
        
        // Parse JSON data for each block
        foreach ($blocks as &$block) {
            $block['data'] = json_decode($block['data'] ?? '{}', true);
        }
        
        $page['blocks'] = $blocks;

        Response::json($page);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Page WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Page not found', 404);
        }

        $data = $this->getJsonInput();

        $this->db->query(
            'UPDATE Page SET title = ?, titleEn = ?, slug = ?, content = ?, contentEn = ?, 
             excerpt = ?, excerptEn = ?, featuredImage = ?, menuId = ?, pageType = ?, 
             template = ?, seoTitle = ?, seoDescription = ?, seoKeywords = ?, 
             isPublished = ?, publishedAt = ? WHERE id = ?',
            [
                $data['title'] ?? $existing['title'],
                $data['titleEn'] ?? $existing['titleEn'],
                $data['slug'] ?? $existing['slug'],
                $data['content'] ?? $existing['content'],
                $data['contentEn'] ?? $existing['contentEn'],
                $data['excerpt'] ?? $existing['excerpt'],
                $data['excerptEn'] ?? $existing['excerptEn'],
                $data['featuredImage'] ?? $existing['featuredImage'],
                $data['menuId'] ?? $existing['menuId'],
                $data['pageType'] ?? $existing['pageType'],
                $data['template'] ?? $existing['template'],
                $data['seoTitle'] ?? $existing['seoTitle'],
                $data['seoDescription'] ?? $existing['seoDescription'],
                $data['seoKeywords'] ?? $existing['seoKeywords'],
                isset($data['isPublished']) ? ($data['isPublished'] ? 1 : 0) : $existing['isPublished'],
                (isset($data['isPublished']) && $data['isPublished']) 
                    ? ($existing['publishedAt'] ?? date('Y-m-d H:i:s')) 
                    : null,
                $id,
            ]
        );

        $page = $this->db->fetchOne('SELECT * FROM Page WHERE id = ?', [$id]);
        Response::json($page);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Page WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Page not found', 404);
        }

        $this->db->query('DELETE FROM Page WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

