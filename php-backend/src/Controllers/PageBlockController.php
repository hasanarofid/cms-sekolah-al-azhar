<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class PageBlockController extends BaseController
{
    public function all()
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $pageId = $_GET['pageId'] ?? null;
            
            if ($pageId) {
                $blocks = $this->db->fetchAll(
                    'SELECT * FROM PageBlock WHERE pageId = ? ORDER BY `order` ASC',
                    [$pageId]
                );
            } else {
                $blocks = $this->db->fetchAll('SELECT * FROM PageBlock ORDER BY `order` ASC');
            }

            // Parse data JSON
            foreach ($blocks as &$block) {
                $block['data'] = json_decode($block['data'] ?? '{}', true);
            }

            Response::json($blocks);
        }
    }

    public function index($pageId)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $blocks = $this->db->fetchAll(
                'SELECT * FROM PageBlock WHERE pageId = ? ORDER BY `order` ASC',
                [$pageId]
            );

            // Parse data JSON
            foreach ($blocks as &$block) {
                $block['data'] = json_decode($block['data'] ?? '{}', true);
            }

            Response::json($blocks);
        }
    }

    public function create($pageId = null)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $data = $this->getJsonInput();
        $id = Utils::generateId();
        
        // If pageId is not in URL, get from body
        if (!$pageId) {
            $pageId = $data['pageId'] ?? null;
        }

        if (!$pageId) {
            Response::error('pageId is required', 400);
        }

        // Get max order
        $maxOrder = $this->db->fetchOne(
            'SELECT MAX(`order`) as maxOrder FROM PageBlock WHERE pageId = ?',
            [$pageId]
        );
        $newOrder = isset($data['order']) ? $data['order'] : (($maxOrder['maxOrder'] ?? 0) + 1);

        $blockData = isset($data['data']) 
            ? (is_string($data['data']) ? $data['data'] : json_encode($data['data']))
            : '{}';

        $this->db->query(
            'INSERT INTO PageBlock (id, pageId, type, `order`, data, isActive) 
             VALUES (?, ?, ?, ?, ?, ?)',
            [
                $id,
                $pageId,
                $data['type'] ?? '',
                $newOrder,
                $blockData,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );

        $block = $this->db->fetchOne('SELECT * FROM PageBlock WHERE id = ?', [$id]);
        $block['data'] = json_decode($block['data'], true);
        Response::json($block);
    }

    public function show($id)
    {
        $this->requireAuth();

        $block = $this->db->fetchOne('SELECT * FROM PageBlock WHERE id = ?', [$id]);
        
        if (!$block) {
            Response::error('Block not found', 404);
        }

        $block['data'] = json_decode($block['data'] ?? '{}', true);
        Response::json($block);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM PageBlock WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Block not found', 404);
        }

        $data = $this->getJsonInput();
        $blockData = isset($data['data']) 
            ? (is_string($data['data']) ? $data['data'] : json_encode($data['data']))
            : $existing['data'];

        $this->db->query(
            'UPDATE PageBlock SET type = ?, `order` = ?, data = ?, isActive = ? WHERE id = ?',
            [
                $data['type'] ?? $existing['type'],
                $data['order'] ?? $existing['order'],
                $blockData,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
                $id,
            ]
        );

        $block = $this->db->fetchOne('SELECT * FROM PageBlock WHERE id = ?', [$id]);
        $block['data'] = json_decode($block['data'], true);
        Response::json($block);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM PageBlock WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Block not found', 404);
        }

        $this->db->query('DELETE FROM PageBlock WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

