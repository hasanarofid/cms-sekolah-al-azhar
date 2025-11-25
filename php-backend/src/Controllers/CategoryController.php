<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class CategoryController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $categories = $this->db->fetchAll(
                'SELECT * FROM Category WHERE parentId IS NULL ORDER BY `order` ASC'
            );

            // Get children for each category
            foreach ($categories as &$category) {
                $category['children'] = $this->db->fetchAll(
                    'SELECT * FROM Category WHERE parentId = ? ORDER BY `order` ASC',
                    [$category['id']]
                );
            }

            Response::json($categories);
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
            'INSERT INTO Category (id, name, nameEn, slug, description, descriptionEn, image, parentId, categoryType, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['name'] ?? '',
                $data['nameEn'] ?? null,
                $data['slug'] ?? Utils::slugify($data['name'] ?? ''),
                $data['description'] ?? null,
                $data['descriptionEn'] ?? null,
                $data['image'] ?? null,
                $data['parentId'] ?? null,
                $data['categoryType'] ?? 'general',
                $data['order'] ?? 0,
                $data['isActive'] ?? true ? 1 : 0,
            ]
        );

        $category = $this->db->fetchOne('SELECT * FROM Category WHERE id = ?', [$id]);
        Response::json($category);
    }

    public function show($id)
    {
        $category = $this->db->fetchOne('SELECT * FROM Category WHERE id = ?', [$id]);
        
        if (!$category) {
            Response::error('Category not found', 404);
        }

        Response::json($category);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Category WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Category not found', 404);
        }

        $data = $this->getJsonInput();

        $this->db->query(
            'UPDATE Category SET name = ?, nameEn = ?, slug = ?, description = ?, descriptionEn = ?, 
             image = ?, parentId = ?, categoryType = ?, `order` = ?, isActive = ? WHERE id = ?',
            [
                $data['name'] ?? $existing['name'],
                $data['nameEn'] ?? $existing['nameEn'],
                $data['slug'] ?? $existing['slug'],
                $data['description'] ?? $existing['description'],
                $data['descriptionEn'] ?? $existing['descriptionEn'],
                $data['image'] ?? $existing['image'],
                $data['parentId'] ?? $existing['parentId'],
                $data['categoryType'] ?? $existing['categoryType'],
                $data['order'] ?? $existing['order'],
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
                $id,
            ]
        );

        $category = $this->db->fetchOne('SELECT * FROM Category WHERE id = ?', [$id]);
        Response::json($category);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Category WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Category not found', 404);
        }

        $this->db->query('DELETE FROM Category WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

