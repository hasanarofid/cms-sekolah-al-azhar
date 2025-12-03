<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

class ContactController extends BaseController
{
    public function index()
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $contacts = $this->db->fetchAll(
                'SELECT * FROM Contact ORDER BY createdAt DESC'
            );

            Response::json($contacts);
        }
    }

    public function create()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $data = $this->getJsonInput();
        
        $missing = Utils::validateRequired($data, ['name', 'email', 'message']);
        if (!empty($missing)) {
            Response::error('Nama, email, dan pesan wajib diisi', 400);
        }

        $id = Utils::generateId();

        $this->db->query(
            'INSERT INTO Contact (id, name, email, phone, subject, message) 
             VALUES (?, ?, ?, ?, ?, ?)',
            [
                $id,
                $data['name'],
                $data['email'],
                $data['phone'] ?? null,
                $data['subject'] ?? null,
                $data['message'],
            ]
        );

        $contact = $this->db->fetchOne('SELECT * FROM Contact WHERE id = ?', [$id]);
        Response::json($contact);
    }

    public function markAsRead($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Contact WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Contact not found', 404);
        }

        $this->db->query('UPDATE Contact SET isRead = 1 WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }

    public function delete($id)
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $existing = $this->db->fetchOne('SELECT * FROM Contact WHERE id = ?', [$id]);
        if (!$existing) {
            Response::error('Contact not found', 404);
        }

        $this->db->query('DELETE FROM Contact WHERE id = ?', [$id]);
        Response::json(['success' => true]);
    }
}

