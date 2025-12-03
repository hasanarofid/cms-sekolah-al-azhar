<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class PageSectionController extends BaseController
{
    public function index($pageId)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Get all sections
            $sections = $this->db->fetchAll(
                'SELECT * FROM PageSection WHERE pageId = ? ORDER BY `order` ASC',
                [$pageId]
            );
            
            // Check if this is an admin request (authenticated)
            // For admin, show all sections (including inactive)
            // For public, only show active sections
            $isAdmin = $this->isAuthenticated();
            
            if (!$isAdmin) {
                // Public: filter active sections (handle both boolean and integer)
                $sections = array_filter($sections, function($section) {
                    return $section['isActive'] !== false && $section['isActive'] !== 0 && $section['isActive'] !== '0';
                });
                
                // Re-index array after filtering
                $sections = array_values($sections);
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
                // Parse navigationItems JSON to array
                if (isset($section['navigationItems']) && $section['navigationItems']) {
                    $decoded = json_decode($section['navigationItems'], true);
                    $section['navigationItems'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['navigationItems'] = [];
                }
                // Parse programItems JSON to array
                if (isset($section['programItems']) && $section['programItems']) {
                    $decoded = json_decode($section['programItems'], true);
                    $section['programItems'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['programItems'] = [];
                }
                // Parse facilityItems JSON to array
                if (isset($section['facilityItems']) && $section['facilityItems']) {
                    $decoded = json_decode($section['facilityItems'], true);
                    $section['facilityItems'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['facilityItems'] = [];
                }
                // Parse extracurricularItems JSON to array
                if (isset($section['extracurricularItems']) && $section['extracurricularItems']) {
                    $decoded = json_decode($section['extracurricularItems'], true);
                    $section['extracurricularItems'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['extracurricularItems'] = [];
                }
                // Parse organizationItems JSON to array
                if (isset($section['organizationItems']) && $section['organizationItems']) {
                    $decoded = json_decode($section['organizationItems'], true);
                    $section['organizationItems'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['organizationItems'] = [];
                }
                // Parse achievementItems JSON to array
                if (isset($section['achievementItems']) && $section['achievementItems']) {
                    $decoded = json_decode($section['achievementItems'], true);
                    $section['achievementItems'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['achievementItems'] = [];
                }
                // Parse curriculumItems JSON to array
                if (isset($section['curriculumItems']) && $section['curriculumItems']) {
                    $decoded = json_decode($section['curriculumItems'], true);
                    $section['curriculumItems'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['curriculumItems'] = [];
                }
                // Parse calendarItems JSON to array
                if (isset($section['calendarItems']) && $section['calendarItems']) {
                    $decoded = json_decode($section['calendarItems'], true);
                    $section['calendarItems'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['calendarItems'] = [];
                }
                // Parse documentItems JSON to array
                if (isset($section['documentItems']) && $section['documentItems']) {
                    $decoded = json_decode($section['documentItems'], true);
                    $section['documentItems'] = $decoded !== null ? $decoded : [];
                } else {
                    $section['documentItems'] = [];
                }
            }

            Response::json($sections);
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

        // Get max order
        $maxOrder = $this->db->fetchOne(
            'SELECT MAX(`order`) as maxOrder FROM PageSection WHERE pageId = ?',
            [$pageId]
        );
        $newOrder = isset($data['order']) ? $data['order'] : (($maxOrder['maxOrder'] ?? 0) + 1);

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
        
        $navigationItems = isset($data['navigationItems']) 
            ? (is_string($data['navigationItems']) ? $data['navigationItems'] : json_encode($data['navigationItems']))
            : null;
        
        $programItems = isset($data['programItems']) 
            ? (is_string($data['programItems']) ? $data['programItems'] : json_encode($data['programItems']))
            : null;
        
        $facilityItems = isset($data['facilityItems']) 
            ? (is_string($data['facilityItems']) ? $data['facilityItems'] : json_encode($data['facilityItems']))
            : null;
        
        $extracurricularItems = isset($data['extracurricularItems']) 
            ? (is_string($data['extracurricularItems']) ? $data['extracurricularItems'] : json_encode($data['extracurricularItems']))
            : null;
        
        $organizationItems = isset($data['organizationItems']) 
            ? (is_string($data['organizationItems']) ? $data['organizationItems'] : json_encode($data['organizationItems']))
            : null;
        
        $achievementItems = isset($data['achievementItems']) 
            ? (is_string($data['achievementItems']) ? $data['achievementItems'] : json_encode($data['achievementItems']))
            : null;
        
        $curriculumItems = isset($data['curriculumItems']) 
            ? (is_string($data['curriculumItems']) ? $data['curriculumItems'] : json_encode($data['curriculumItems']))
            : null;
        
        $calendarItems = isset($data['calendarItems']) 
            ? (is_string($data['calendarItems']) ? $data['calendarItems'] : json_encode($data['calendarItems']))
            : null;
        
        $documentItems = isset($data['documentItems']) 
            ? (is_string($data['documentItems']) ? $data['documentItems'] : json_encode($data['documentItems']))
            : null;

        $this->db->query(
            'INSERT INTO PageSection (id, pageId, type, title, titleEn, subtitle, subtitleEn, content, 
             contentEn, image, imageLeft, imageRight, images, videoUrl, buttonText, buttonTextEn, buttonUrl, 
             badgeImage, accreditationNumber, accreditationBody, faqItems, figures, navigationItems, programItems, 
             facilityItems, extracurricularItems, organizationItems, achievementItems, curriculumItems, calendarItems, documentItems, 
             address, addressEn, email, phone, mapEmbedUrl, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $pageId,
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
                $data['badgeImage'] ?? null,
                $data['accreditationNumber'] ?? null,
                $data['accreditationBody'] ?? null,
                $faqItems,
                $figures,
                $navigationItems,
                $programItems,
                $facilityItems,
                $extracurricularItems,
                $organizationItems,
                $achievementItems,
                $curriculumItems,
                $calendarItems,
                $documentItems,
                $data['address'] ?? null,
                $data['addressEn'] ?? null,
                $data['email'] ?? null,
                $data['phone'] ?? null,
                $data['mapEmbedUrl'] ?? null,
                $newOrder,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );

        $section = $this->db->fetchOne('SELECT * FROM PageSection WHERE id = ?', [$id]);
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
        // Decode curriculumItems JSON to array
        if (isset($section['curriculumItems']) && $section['curriculumItems']) {
            $decoded = json_decode($section['curriculumItems'], true);
            $section['curriculumItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['curriculumItems'] = [];
        }
        Response::json($section);
    }

    public function show($id)
    {
        $section = $this->db->fetchOne('SELECT * FROM PageSection WHERE id = ?', [$id]);
        
        if (!$section) {
            Response::error('PageSection not found', 404);
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
        // Decode navigationItems JSON to array
        if (isset($section['navigationItems']) && $section['navigationItems']) {
            $decoded = json_decode($section['navigationItems'], true);
            $section['navigationItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['navigationItems'] = [];
        }
        // Decode programItems JSON to array
        if (isset($section['programItems']) && $section['programItems']) {
            $decoded = json_decode($section['programItems'], true);
            $section['programItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['programItems'] = [];
        }
        // Decode facilityItems JSON to array
        if (isset($section['facilityItems']) && $section['facilityItems']) {
            $decoded = json_decode($section['facilityItems'], true);
            $section['facilityItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['facilityItems'] = [];
        }
        // Decode extracurricularItems JSON to array
        if (isset($section['extracurricularItems']) && $section['extracurricularItems']) {
            $decoded = json_decode($section['extracurricularItems'], true);
            $section['extracurricularItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['extracurricularItems'] = [];
        }
        // Decode organizationItems JSON to array
        if (isset($section['organizationItems']) && $section['organizationItems']) {
            $decoded = json_decode($section['organizationItems'], true);
            $section['organizationItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['organizationItems'] = [];
        }
        // Decode achievementItems JSON to array
        if (isset($section['achievementItems']) && $section['achievementItems']) {
            $decoded = json_decode($section['achievementItems'], true);
            $section['achievementItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['achievementItems'] = [];
        }
        // Decode curriculumItems JSON to array
        if (isset($section['curriculumItems']) && $section['curriculumItems']) {
            $decoded = json_decode($section['curriculumItems'], true);
            $section['curriculumItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['curriculumItems'] = [];
        }
        // Decode calendarItems JSON to array
        if (isset($section['calendarItems']) && $section['calendarItems']) {
            $decoded = json_decode($section['calendarItems'], true);
            $section['calendarItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['calendarItems'] = [];
        }
        // Decode documentItems JSON to array
        if (isset($section['documentItems']) && $section['documentItems']) {
            $decoded = json_decode($section['documentItems'], true);
            $section['documentItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['documentItems'] = [];
        }

        Response::json($section);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM PageSection WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('PageSection not found', 404);
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
        
        $navigationItems = isset($data['navigationItems']) 
            ? (is_string($data['navigationItems']) ? $data['navigationItems'] : json_encode($data['navigationItems']))
            : ($existing['navigationItems'] ?? null);
        
        $programItems = isset($data['programItems']) 
            ? (is_string($data['programItems']) ? $data['programItems'] : json_encode($data['programItems']))
            : ($existing['programItems'] ?? null);
        
        $facilityItems = isset($data['facilityItems']) 
            ? (is_string($data['facilityItems']) ? $data['facilityItems'] : json_encode($data['facilityItems']))
            : ($existing['facilityItems'] ?? null);
        
        $extracurricularItems = isset($data['extracurricularItems']) 
            ? (is_string($data['extracurricularItems']) ? $data['extracurricularItems'] : json_encode($data['extracurricularItems']))
            : ($existing['extracurricularItems'] ?? null);
        
        $organizationItems = isset($data['organizationItems']) 
            ? (is_string($data['organizationItems']) ? $data['organizationItems'] : json_encode($data['organizationItems']))
            : ($existing['organizationItems'] ?? null);
        
        $achievementItems = isset($data['achievementItems']) 
            ? (is_string($data['achievementItems']) ? $data['achievementItems'] : json_encode($data['achievementItems']))
            : ($existing['achievementItems'] ?? null);
        
        $curriculumItems = isset($data['curriculumItems']) 
            ? (is_string($data['curriculumItems']) ? $data['curriculumItems'] : json_encode($data['curriculumItems']))
            : ($existing['curriculumItems'] ?? null);
        
        $calendarItems = isset($data['calendarItems']) 
            ? (is_string($data['calendarItems']) ? $data['calendarItems'] : json_encode($data['calendarItems']))
            : ($existing['calendarItems'] ?? null);
        
        $documentItems = isset($data['documentItems']) 
            ? (is_string($data['documentItems']) ? $data['documentItems'] : json_encode($data['documentItems']))
            : ($existing['documentItems'] ?? null);

        $this->db->query(
            'UPDATE PageSection SET type = ?, title = ?, titleEn = ?, subtitle = ?, subtitleEn = ?, 
             content = ?, contentEn = ?, image = ?, imageLeft = ?, imageRight = ?, images = ?, videoUrl = ?, buttonText = ?, 
             buttonTextEn = ?, buttonUrl = ?, badgeImage = ?, accreditationNumber = ?, accreditationBody = ?, 
             faqItems = ?, figures = ?, navigationItems = ?, programItems = ?, facilityItems = ?, extracurricularItems = ?, 
             organizationItems = ?, achievementItems = ?, curriculumItems = ?, calendarItems = ?, documentItems = ?, 
             address = ?, addressEn = ?, email = ?, phone = ?, mapEmbedUrl = ?, `order` = ?, isActive = ? WHERE id = ?',
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
                $data['badgeImage'] ?? $existing['badgeImage'] ?? null,
                $data['accreditationNumber'] ?? $existing['accreditationNumber'] ?? null,
                $data['accreditationBody'] ?? $existing['accreditationBody'] ?? null,
                $faqItems,
                $figures,
                $navigationItems,
                $programItems,
                $facilityItems,
                $extracurricularItems,
                $organizationItems,
                $achievementItems,
                $curriculumItems,
                $calendarItems,
                $documentItems,
                $data['address'] ?? $existing['address'] ?? null,
                $data['addressEn'] ?? $existing['addressEn'] ?? null,
                $data['email'] ?? $existing['email'] ?? null,
                $data['phone'] ?? $existing['phone'] ?? null,
                $data['mapEmbedUrl'] ?? $existing['mapEmbedUrl'] ?? null,
                $data['order'] ?? $existing['order'],
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
                $id,
            ]
        );

        $section = $this->db->fetchOne('SELECT * FROM PageSection WHERE id = ?', [$id]);
        // Decode images JSON to array
        if ($section['images']) {
            $decoded = json_decode($section['images'], true);
            $section['images'] = $decoded !== null ? $decoded : [];
        } else {
            $section['images'] = [];
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
        // Decode navigationItems JSON to array
        if (isset($section['navigationItems']) && $section['navigationItems']) {
            $decoded = json_decode($section['navigationItems'], true);
            $section['navigationItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['navigationItems'] = [];
        }
        // Decode programItems JSON to array
        if (isset($section['programItems']) && $section['programItems']) {
            $decoded = json_decode($section['programItems'], true);
            $section['programItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['programItems'] = [];
        }
        // Decode facilityItems JSON to array
        if (isset($section['facilityItems']) && $section['facilityItems']) {
            $decoded = json_decode($section['facilityItems'], true);
            $section['facilityItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['facilityItems'] = [];
        }
        // Decode extracurricularItems JSON to array
        if (isset($section['extracurricularItems']) && $section['extracurricularItems']) {
            $decoded = json_decode($section['extracurricularItems'], true);
            $section['extracurricularItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['extracurricularItems'] = [];
        }
        // Decode organizationItems JSON to array
        if (isset($section['organizationItems']) && $section['organizationItems']) {
            $decoded = json_decode($section['organizationItems'], true);
            $section['organizationItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['organizationItems'] = [];
        }
        // Decode achievementItems JSON to array
        if (isset($section['achievementItems']) && $section['achievementItems']) {
            $decoded = json_decode($section['achievementItems'], true);
            $section['achievementItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['achievementItems'] = [];
        }
        // Decode curriculumItems JSON to array
        if (isset($section['curriculumItems']) && $section['curriculumItems']) {
            $decoded = json_decode($section['curriculumItems'], true);
            $section['curriculumItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['curriculumItems'] = [];
        }
        // Decode calendarItems JSON to array
        if (isset($section['calendarItems']) && $section['calendarItems']) {
            $decoded = json_decode($section['calendarItems'], true);
            $section['calendarItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['calendarItems'] = [];
        }
        // Decode documentItems JSON to array
        if (isset($section['documentItems']) && $section['documentItems']) {
            $decoded = json_decode($section['documentItems'], true);
            $section['documentItems'] = $decoded !== null ? $decoded : [];
        } else {
            $section['documentItems'] = [];
        }
        Response::json($section);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM PageSection WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('PageSection not found', 404);
        }

        $this->db->query('DELETE FROM PageSection WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

