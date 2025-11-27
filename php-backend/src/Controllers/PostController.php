<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class PostController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $posts = $this->db->fetchAll(
                'SELECT p.*, u.name as authorName FROM Post p 
                 LEFT JOIN User u ON p.authorId = u.id 
                 ORDER BY p.createdAt DESC'
            );

            // Parse tags JSON
            foreach ($posts as &$post) {
                $post['tags'] = json_decode($post['tags'] ?? '[]', true);
            }

            Response::json($posts);
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
        $slug = $data['slug'] ?? Utils::slugify($data['title'] ?? '');

        $tags = isset($data['tags']) ? json_encode($data['tags']) : '[]';

        $this->db->query(
            'INSERT INTO Post (id, title, titleEn, slug, content, contentEn, excerpt, excerptEn, 
             featuredImage, category, categoryId, tags, postType, seoTitle, seoDescription, seoKeywords, 
             isPublished, publishedAt, authorId) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['title'] ?? '',
                $data['titleEn'] ?? null,
                $slug,
                $data['content'] ?? '',
                $data['contentEn'] ?? null,
                $data['excerpt'] ?? null,
                $data['excerptEn'] ?? null,
                $data['featuredImage'] ?? null,
                $data['category'] ?? null,
                $data['categoryId'] ?? null,
                $tags,
                $data['postType'] ?? 'post',
                $data['seoTitle'] ?? null,
                $data['seoDescription'] ?? null,
                $data['seoKeywords'] ?? null,
                $data['isPublished'] ?? false ? 1 : 0,
                ($data['isPublished'] ?? false) ? date('Y-m-d H:i:s') : null,
                $user['id'],
            ]
        );

        $post = $this->db->fetchOne('SELECT * FROM Post WHERE id = ?', [$id]);
        $post['tags'] = json_decode($post['tags'], true);
        Response::json($post);
    }

    public function show($id)
    {
        $post = $this->db->fetchOne('SELECT * FROM Post WHERE id = ?', [$id]);
        
        if (!$post) {
            Response::error('Post not found', 404);
        }

        $post['tags'] = json_decode($post['tags'] ?? '[]', true);
        Response::json($post);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Post WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Post not found', 404);
        }

        $data = $this->getJsonInput();
        $tags = isset($data['tags']) ? json_encode($data['tags']) : $existing['tags'];

        $this->db->query(
            'UPDATE Post SET title = ?, titleEn = ?, slug = ?, content = ?, contentEn = ?, 
             excerpt = ?, excerptEn = ?, featuredImage = ?, category = ?, categoryId = ?, 
             tags = ?, postType = ?, seoTitle = ?, seoDescription = ?, seoKeywords = ?,
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
                $data['category'] ?? $existing['category'],
                $data['categoryId'] ?? $existing['categoryId'],
                $tags,
                $data['postType'] ?? $existing['postType'],
                $data['seoTitle'] ?? $existing['seoTitle'] ?? null,
                $data['seoDescription'] ?? $existing['seoDescription'] ?? null,
                $data['seoKeywords'] ?? $existing['seoKeywords'] ?? null,
                isset($data['isPublished']) ? ($data['isPublished'] ? 1 : 0) : $existing['isPublished'],
                (isset($data['isPublished']) && $data['isPublished']) 
                    ? ($existing['publishedAt'] ?? date('Y-m-d H:i:s')) 
                    : null,
                $id,
            ]
        );

        $post = $this->db->fetchOne('SELECT * FROM Post WHERE id = ?', [$id]);
        $post['tags'] = json_decode($post['tags'], true);
        Response::json($post);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Post WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Post not found', 404);
        }

        $this->db->query('DELETE FROM Post WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

