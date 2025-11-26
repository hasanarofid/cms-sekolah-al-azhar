<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class SliderController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // Check if this is admin request (has auth token)
            $isAdmin = false;
            $headers = getallheaders();
            if (isset($headers['Authorization']) || isset($headers['authorization'])) {
                $authHeader = $headers['Authorization'] ?? $headers['authorization'];
                if (strpos($authHeader, 'Bearer ') === 0) {
                    $isAdmin = true;
                }
            }
            
            // If admin, return all sliders. Otherwise, only active ones
            if ($isAdmin) {
                $sliders = $this->db->fetchAll(
                    'SELECT * FROM Slider ORDER BY `order` ASC'
                );
            } else {
                $sliders = $this->db->fetchAll(
                    'SELECT * FROM Slider WHERE isActive = 1 ORDER BY `order` ASC'
                );
            }

            Response::json($sliders);
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

        // Get video duration if videoFile is provided
        $videoDuration = null;
        if (!empty($data['videoFile'])) {
            $videoPath = __DIR__ . '/../../public' . $data['videoFile'];
            if (file_exists($videoPath)) {
                try {
                    $duration = Utils::getVideoDuration($videoPath);
                    if ($duration !== null && $duration > 0) {
                        $videoDuration = $duration;
                    }
                } catch (\Exception $e) {
                    error_log('Failed to get video duration: ' . $e->getMessage());
                }
            }
        }
        // If duration is provided in data, use it (from upload response)
        if (isset($data['videoDuration']) && $data['videoDuration'] > 0) {
            $videoDuration = (int) $data['videoDuration'];
        }

        $this->db->query(
            'INSERT INTO Slider (id, title, titleEn, subtitle, subtitleEn, image, videoUrl, videoFile, videoDuration, buttonText, 
             buttonTextEn, buttonUrl, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['title'] ?? '',
                $data['titleEn'] ?? null,
                $data['subtitle'] ?? null,
                $data['subtitleEn'] ?? null,
                $data['image'] ?? '',
                $data['videoUrl'] ?? null,
                $data['videoFile'] ?? null,
                $videoDuration,
                $data['buttonText'] ?? null,
                $data['buttonTextEn'] ?? null,
                $data['buttonUrl'] ?? null,
                $data['order'] ?? 0,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );

        $slider = $this->db->fetchOne('SELECT * FROM Slider WHERE id = ?', [$id]);
        Response::json($slider);
    }

    public function show($id)
    {
        $slider = $this->db->fetchOne('SELECT * FROM Slider WHERE id = ?', [$id]);
        
        if (!$slider) {
            Response::error('Slider not found', 404);
        }

        Response::json($slider);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Slider WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Slider not found', 404);
        }

        $data = $this->getJsonInput();

        // Get video duration if videoFile is changed
        $videoDuration = $existing['videoDuration'] ?? null;
        if (isset($data['videoFile']) && $data['videoFile'] !== $existing['videoFile']) {
            if (!empty($data['videoFile'])) {
                $videoPath = __DIR__ . '/../../public' . $data['videoFile'];
                if (file_exists($videoPath)) {
                    try {
                        $duration = Utils::getVideoDuration($videoPath);
                        if ($duration !== null && $duration > 0) {
                            $videoDuration = $duration;
                        }
                    } catch (\Exception $e) {
                        error_log('Failed to get video duration: ' . $e->getMessage());
                    }
                }
            } else {
                $videoDuration = null;
            }
        }
        // If duration is explicitly provided in data, use it (from upload response)
        if (isset($data['videoDuration'])) {
            if ($data['videoDuration'] > 0) {
                $videoDuration = (int) $data['videoDuration'];
            } else {
                $videoDuration = null;
            }
        }

        // Prepare update data - use provided values or keep existing
        $updateData = [
            'title' => $data['title'] ?? $existing['title'],
            'titleEn' => isset($data['titleEn']) ? ($data['titleEn'] ?: null) : $existing['titleEn'],
            'subtitle' => isset($data['subtitle']) ? ($data['subtitle'] ?: null) : $existing['subtitle'],
            'subtitleEn' => isset($data['subtitleEn']) ? ($data['subtitleEn'] ?: null) : $existing['subtitleEn'],
            'image' => $data['image'] ?? $existing['image'],
            'videoUrl' => isset($data['videoUrl']) ? ($data['videoUrl'] ?: null) : $existing['videoUrl'],
            'videoFile' => isset($data['videoFile']) ? ($data['videoFile'] ?: null) : $existing['videoFile'],
            'videoDuration' => $videoDuration,
            'buttonText' => isset($data['buttonText']) ? ($data['buttonText'] ?: null) : $existing['buttonText'],
            'buttonTextEn' => isset($data['buttonTextEn']) ? ($data['buttonTextEn'] ?: null) : $existing['buttonTextEn'],
            'buttonUrl' => isset($data['buttonUrl']) ? ($data['buttonUrl'] ?: null) : $existing['buttonUrl'],
            'order' => isset($data['order']) ? (int)$data['order'] : $existing['order'],
            'isActive' => isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
        ];

        $this->db->query(
            'UPDATE Slider SET title = ?, titleEn = ?, subtitle = ?, subtitleEn = ?, image = ?, videoUrl = ?, videoFile = ?, videoDuration = ?,
             buttonText = ?, buttonTextEn = ?, buttonUrl = ?, `order` = ?, isActive = ? WHERE id = ?',
            [
                $updateData['title'],
                $updateData['titleEn'],
                $updateData['subtitle'],
                $updateData['subtitleEn'],
                $updateData['image'],
                $updateData['videoUrl'],
                $updateData['videoFile'],
                $updateData['videoDuration'],
                $updateData['buttonText'],
                $updateData['buttonTextEn'],
                $updateData['buttonUrl'],
                $updateData['order'],
                $updateData['isActive'],
                $id,
            ]
        );

        $slider = $this->db->fetchOne('SELECT * FROM Slider WHERE id = ?', [$id]);
        Response::json($slider);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Slider WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Slider not found', 404);
        }

        $this->db->query('DELETE FROM Slider WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

