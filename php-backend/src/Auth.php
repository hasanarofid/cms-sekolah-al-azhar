<?php

namespace App;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Login user dengan email dan password
     */
    public function login($email, $password)
    {
        $user = $this->db->fetchOne(
            'SELECT * FROM User WHERE email = ?',
            [$email]
        );

        if (!$user) {
            return null;
        }

        if (!password_verify($password, $user['password'])) {
            return null;
        }

        // Generate JWT token
        $token = $this->generateToken($user);

        return [
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role'],
            ],
            'token' => $token,
        ];
    }

    /**
     * Generate JWT token
     */
    private function generateToken($user)
    {
        $payload = [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + (30 * 24 * 60 * 60), // 30 days
        ];

        $secret = defined('JWT_SECRET') ? JWT_SECRET : (getenv('JWT_SECRET') ?: 'your-secret-key-change-this-in-production');
        return JWT::encode($payload, $secret, 'HS256');
    }

    /**
     * Verify JWT token
     */
    public function verifyToken($token)
    {
        try {
            $secret = defined('JWT_SECRET') ? JWT_SECRET : (getenv('JWT_SECRET') ?: 'your-secret-key-change-this-in-production');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get current user from token
     */
    public function getUser()
    {
        $token = $this->getTokenFromRequest();

        if (!$token) {
            return null;
        }

        $decoded = $this->verifyToken($token);

        if (!$decoded) {
            return null;
        }

        // Get fresh user data from database
        $user = $this->db->fetchOne(
            'SELECT id, email, name, role FROM User WHERE id = ?',
            [$decoded['id']]
        );

        return $user;
    }

    /**
     * Get token from Authorization header
     */
    private function getTokenFromRequest()
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

        if (!$authHeader) {
            return null;
        }

        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Check if user is authenticated
     */
    public function check()
    {
        return $this->getUser() !== null;
    }
}

