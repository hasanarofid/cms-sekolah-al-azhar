<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class FAQController extends BaseController
{
    public function index()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $faqs = $this->db->fetchAll(
                'SELECT * FROM FAQ WHERE isActive = 1 ORDER BY `order` ASC'
            );

            Response::json($faqs);
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
            'INSERT INTO FAQ (id, question, questionEn, answer, answerEn, image, sectionTitle, 
             sectionTitleEn, `order`, isActive) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['question'] ?? '',
                $data['questionEn'] ?? null,
                $data['answer'] ?? '',
                $data['answerEn'] ?? null,
                $data['image'] ?? null,
                $data['sectionTitle'] ?? null,
                $data['sectionTitleEn'] ?? null,
                $data['order'] ?? 0,
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : 1,
            ]
        );

        $faq = $this->db->fetchOne('SELECT * FROM FAQ WHERE id = ?', [$id]);
        Response::json($faq);
    }

    public function show($id)
    {
        $faq = $this->db->fetchOne('SELECT * FROM FAQ WHERE id = ?', [$id]);
        
        if (!$faq) {
            Response::error('FAQ not found', 404);
        }

        Response::json($faq);
    }

    public function update($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM FAQ WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('FAQ not found', 404);
        }

        $data = $this->getJsonInput();

        $this->db->query(
            'UPDATE FAQ SET question = ?, questionEn = ?, answer = ?, answerEn = ?, image = ?, 
             sectionTitle = ?, sectionTitleEn = ?, `order` = ?, isActive = ? WHERE id = ?',
            [
                $data['question'] ?? $existing['question'],
                $data['questionEn'] ?? $existing['questionEn'],
                $data['answer'] ?? $existing['answer'],
                $data['answerEn'] ?? $existing['answerEn'],
                $data['image'] ?? $existing['image'],
                $data['sectionTitle'] ?? $existing['sectionTitle'],
                $data['sectionTitleEn'] ?? $existing['sectionTitleEn'],
                $data['order'] ?? $existing['order'],
                isset($data['isActive']) ? ($data['isActive'] ? 1 : 0) : $existing['isActive'],
                $id,
            ]
        );

        $faq = $this->db->fetchOne('SELECT * FROM FAQ WHERE id = ?', [$id]);
        Response::json($faq);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM FAQ WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('FAQ not found', 404);
        }

        $this->db->query('DELETE FROM FAQ WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

