<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class SEOController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $pageType = $_GET['pageType'] ?? 'global';
            $pageId = $_GET['pageId'] ?? null;
            $pageSlug = $_GET['pageSlug'] ?? null;

            // Get SEO by pageType and pageId/pageSlug
            if ($pageId) {
                $seo = $this->db->fetchOne(
                    'SELECT * FROM SEO WHERE pageType = ? AND pageId = ?',
                    [$pageType, $pageId]
                );
            } elseif ($pageSlug) {
                $seo = $this->db->fetchOne(
                    'SELECT * FROM SEO WHERE pageType = ? AND pageSlug = ?',
                    [$pageType, $pageSlug]
                );
            } else {
                // Get global SEO
                $seo = $this->db->fetchOne(
                    'SELECT * FROM SEO WHERE pageType = ? AND pageId IS NULL AND pageSlug IS NULL',
                    [$pageType]
                );
            }

            // If not found, return global SEO as fallback
            if (!$seo && $pageType !== 'global') {
                $seo = $this->db->fetchOne(
                    'SELECT * FROM SEO WHERE pageType = ? AND pageId IS NULL AND pageSlug IS NULL',
                    ['global']
                );
            }

            Response::json($seo ?: null);
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

        $pageType = $data['pageType'] ?? 'global';
        $pageId = $data['pageId'] ?? null;
        $pageSlug = $data['pageSlug'] ?? null;

        // Check if SEO already exists for this page
        if ($pageId) {
            $existing = $this->db->fetchOne(
                'SELECT * FROM SEO WHERE pageType = ? AND pageId = ?',
                [$pageType, $pageId]
            );
        } elseif ($pageSlug) {
            $existing = $this->db->fetchOne(
                'SELECT * FROM SEO WHERE pageType = ? AND pageSlug = ?',
                [$pageType, $pageSlug]
            );
        } else {
            $existing = $this->db->fetchOne(
                'SELECT * FROM SEO WHERE pageType = ? AND pageId IS NULL AND pageSlug IS NULL',
                [$pageType]
            );
        }

        if ($existing) {
            // Update existing
            $id = $existing['id'];
            $this->updateSEO($id, $data);
            $seo = $this->db->fetchOne('SELECT * FROM SEO WHERE id = ?', [$id]);
            Response::json($seo);
            return;
        }

        // Create new
        $this->db->query(
            'INSERT INTO SEO (
                id, pageType, pageId, pageSlug,
                title, description, keywords, author, image, robots, canonical,
                ogTitle, ogDescription, ogImage, ogType, ogSiteName, ogUrl,
                twitterCard, twitterSite, twitterCreator
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $pageType,
                $pageId,
                $pageSlug,
                $data['title'] ?? null,
                $data['description'] ?? null,
                $data['keywords'] ?? null,
                $data['author'] ?? null,
                $data['image'] ?? null,
                $data['robots'] ?? 'index, follow',
                $data['canonical'] ?? null,
                $data['ogTitle'] ?? null,
                $data['ogDescription'] ?? null,
                $data['ogImage'] ?? null,
                $data['ogType'] ?? 'website',
                $data['ogSiteName'] ?? null,
                $data['ogUrl'] ?? null,
                $data['twitterCard'] ?? 'summary_large_image',
                $data['twitterSite'] ?? null,
                $data['twitterCreator'] ?? null,
            ]
        );

        $seo = $this->db->fetchOne('SELECT * FROM SEO WHERE id = ?', [$id]);
        Response::json($seo);
    }

    public function show($id)
    {
        $seo = $this->db->fetchOne('SELECT * FROM SEO WHERE id = ?', [$id]);
        
        if (!$seo) {
            Response::error('SEO not found', 404);
        }

        Response::json($seo);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM SEO WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('SEO not found', 404);
        }

        $data = $this->getJsonInput();
        $this->updateSEO($id, $data);

        $seo = $this->db->fetchOne('SELECT * FROM SEO WHERE id = ?', [$id]);
        Response::json($seo);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM SEO WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('SEO not found', 404);
        }

        // Don't allow deleting global SEO
        if ($existing['pageType'] === 'global' && !$existing['pageId'] && !$existing['pageSlug']) {
            Response::error('Cannot delete global SEO settings', 400);
        }

        $this->db->query('DELETE FROM SEO WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }

    private function updateSEO($id, $data)
    {
        $this->db->query(
            'UPDATE SEO SET
                title = ?,
                description = ?,
                keywords = ?,
                author = ?,
                image = ?,
                robots = ?,
                canonical = ?,
                ogTitle = ?,
                ogDescription = ?,
                ogImage = ?,
                ogType = ?,
                ogSiteName = ?,
                ogUrl = ?,
                twitterCard = ?,
                twitterSite = ?,
                twitterCreator = ?
            WHERE id = ?',
            [
                $data['title'] ?? null,
                $data['description'] ?? null,
                $data['keywords'] ?? null,
                $data['author'] ?? null,
                $data['image'] ?? null,
                $data['robots'] ?? 'index, follow',
                $data['canonical'] ?? null,
                $data['ogTitle'] ?? null,
                $data['ogDescription'] ?? null,
                $data['ogImage'] ?? null,
                $data['ogType'] ?? 'website',
                $data['ogSiteName'] ?? null,
                $data['ogUrl'] ?? null,
                $data['twitterCard'] ?? 'summary_large_image',
                $data['twitterSite'] ?? null,
                $data['twitterCreator'] ?? null,
                $id,
            ]
        );
    }
}

