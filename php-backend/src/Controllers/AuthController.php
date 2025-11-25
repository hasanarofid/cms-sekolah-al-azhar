<?php

namespace App\Controllers;

use App\Auth;
use App\Response;
use App\Utils;

class AuthController extends BaseController
{
    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        $data = $this->getJsonInput();
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            Response::error('Email dan password wajib diisi', 400);
        }

        $auth = new Auth();
        $result = $auth->login($email, $password);

        if (!$result) {
            Response::error('Email atau password salah', 401);
        }

        Response::json($result);
    }

    public function session()
    {
        $user = $this->getUser();
        
        if (!$user) {
            Response::json(['user' => null]);
        }

        Response::json(['user' => $user]);
    }
}

