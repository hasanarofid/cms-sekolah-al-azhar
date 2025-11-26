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
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Support POST directly to /blocks for RESTful API
            $this->create($pageId);
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

        error_log("PageBlockController::create - pageId from URL: " . ($pageId ?? 'null') . ", pageId from body: " . ($data['pageId'] ?? 'null'));

        if (!$pageId) {
            Response::error('pageId is required', 400);
        }

        // Validate pageId exists
        $page = $this->db->fetchOne('SELECT id FROM Page WHERE id = ?', [$pageId]);
        if (!$page) {
            error_log("PageBlockController::create - Page not found: " . $pageId);
            Response::error('Page not found: ' . $pageId, 404);
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

        $httpMethod = strtoupper($_SERVER['REQUEST_METHOD']);
        if ($httpMethod !== 'PUT' && $httpMethod !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        if (!$id || trim($id) === '') {
            Response::error('Block ID is required', 400);
        }

        // Trim and validate ID
        $id = trim($id);
        error_log("PageBlockController::update - Received ID parameter: " . $id . " (length: " . strlen($id) . ")");

        // First check if this ID is actually a Page ID (common mistake)
        $pageCheck = $this->db->fetchOne('SELECT id FROM Page WHERE id = ?', [$id]);
        if ($pageCheck) {
            error_log("PageBlockController::update - ERROR: Page ID was passed instead of Block ID. Page ID: " . $id);
            Response::error('Invalid request: Page ID was provided instead of Block ID. Please check the block ID.', 400);
        }

        $existing = $this->db->fetchOne('SELECT * FROM PageBlock WHERE id = ?', [$id]);
        if (!$existing) {
            // Log untuk debugging - check if similar IDs exist
            $similar = $this->db->fetchAll('SELECT id FROM PageBlock WHERE id LIKE ? LIMIT 5', [$id . '%']);
            error_log("PageBlockController::update - Block not found. Block ID: " . $id . " (length: " . strlen($id) . "). Similar IDs: " . json_encode($similar));
            Response::error('Block not found. Block ID: ' . $id, 404);
        }
        
        error_log("PageBlockController::update - Block found. Block ID: " . $id . ", Page ID: " . $existing['pageId']);

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

        $httpMethod = strtoupper($_SERVER['REQUEST_METHOD']);
        if ($httpMethod !== 'DELETE' && $httpMethod !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        if (!$id) {
            Response::error('Block ID is required', 400);
        }

        $existing = $this->db->fetchOne('SELECT * FROM PageBlock WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Block not found', 404);
        }

        $this->db->query('DELETE FROM PageBlock WHERE id = ?', [$id]);
        Response::json(['success' => true, 'message' => 'Block deleted successfully']);
    }
}

