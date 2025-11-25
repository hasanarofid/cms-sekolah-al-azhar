<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class MenuController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $menus = $this->db->fetchAll(
                'SELECT * FROM Menu WHERE parentId IS NULL ORDER BY `order` ASC'
            );

            // Get children for each menu (level 1)
            foreach ($menus as &$menu) {
                $menu['children'] = $this->db->fetchAll(
                    'SELECT * FROM Menu WHERE parentId = ? ORDER BY `order` ASC',
                    [$menu['id']]
                );
                
                // Get grandchildren for each child (level 2)
                foreach ($menu['children'] as &$child) {
                    $child['children'] = $this->db->fetchAll(
                        'SELECT * FROM Menu WHERE parentId = ? ORDER BY `order` ASC',
                        [$child['id']]
                    );
                }
            }

            Response::json($menus);
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
        $slug = $data['slug'] ?? '';

        // Handle special slug "#"
        if ($slug === '#' && !isset($data['parentId'])) {
            $slug = '#-' . time() . '-' . bin2hex(random_bytes(4));
        } elseif ($slug !== '#') {
            // Check if slug exists
            $existing = $this->db->fetchOne('SELECT * FROM Menu WHERE slug = ?', [$slug]);
            if ($existing) {
                Response::error('Slug sudah digunakan', 400);
            }
        }

        $this->db->query(
            'INSERT INTO Menu (id, title, titleEn, slug, parentId, menuType, externalUrl, icon, 
             description, descriptionEn, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['title'] ?? '',
                $data['titleEn'] ?? null,
                $slug,
                $data['parentId'] ?? null,
                $data['menuType'] ?? 'page',
                $data['externalUrl'] ?? null,
                $data['icon'] ?? null,
                $data['description'] ?? null,
                $data['descriptionEn'] ?? null,
                $data['order'] ?? 0,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );

        $menu = $this->db->fetchOne('SELECT * FROM Menu WHERE id = ?', [$id]);
        Response::json($menu);
    }

    public function show($id)
    {
        $menu = $this->db->fetchOne('SELECT * FROM Menu WHERE id = ?', [$id]);
        
        if (!$menu) {
            Response::error('Menu not found', 404);
        }

        Response::json($menu);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Menu WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Menu not found', 404);
        }

        $data = $this->getJsonInput();

        $this->db->query(
            'UPDATE Menu SET title = ?, titleEn = ?, slug = ?, parentId = ?, menuType = ?, 
             externalUrl = ?, icon = ?, description = ?, descriptionEn = ?, `order` = ?, isActive = ? 
             WHERE id = ?',
            [
                $data['title'] ?? $existing['title'],
                $data['titleEn'] ?? $existing['titleEn'],
                $data['slug'] ?? $existing['slug'],
                $data['parentId'] ?? $existing['parentId'],
                $data['menuType'] ?? $existing['menuType'],
                $data['externalUrl'] ?? $existing['externalUrl'],
                $data['icon'] ?? $existing['icon'],
                $data['description'] ?? $existing['description'],
                $data['descriptionEn'] ?? $existing['descriptionEn'],
                $data['order'] ?? $existing['order'],
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
                $id,
            ]
        );

        $menu = $this->db->fetchOne('SELECT * FROM Menu WHERE id = ?', [$id]);
        Response::json($menu);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Menu WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Menu not found', 404);
        }

        $this->db->query('DELETE FROM Menu WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

