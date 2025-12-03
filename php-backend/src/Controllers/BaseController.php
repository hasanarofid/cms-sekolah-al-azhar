<?php

namespace App\Controllers;

use App\Auth;
use App\Database;
use App\Response;

class BaseController
{
    protected $db;
    protected $auth;

    public function __construct()
    {
        $this->db = Database::getInstance();
        $this->auth = new Auth();
    }

    /**
     * Check if user is authenticated
     */
    protected function requireAuth()
    {
        if (!$this->auth->check()) {
            Response::error('Unauthorized', 401);
        }
    }

    /**
     * Check if user is authenticated (returns boolean, doesn't throw error)
     */
    protected function isAuthenticated()
    {
        return $this->auth->check();
    }

    /**
     * Get authenticated user
     */
    protected function getUser()
    {
        return $this->auth->getUser();
    }

    /**
     * Get JSON input
     */
    protected function getJsonInput()
    {
        return \App\Utils::getJsonInput();
    }

    /**
     * Get request method
     */
    protected function getMethod()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method === 'POST' && isset($_POST['_method'])) {
            return strtoupper($_POST['_method']);
        }
        return $method;
    }
}

