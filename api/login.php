<?php
require_once 'db_connect.php'; 
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Credenciales incompletas.']);
    exit;
}

try {
    // 1. Buscar usuario por email
    $stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        // 2. Éxito: Contraseña verificada
        
        // ¡IMPORTANTE!: En lugar de guardar credenciales, guardamos la sesión o datos del usuario
        // Aquí simulamos un token simple o devolvemos los datos necesarios para la sesión en JS
        
        http_response_code(200); 
        echo json_encode([
            'success' => true,
            'message' => 'Login exitoso.',
            // Datos a almacenar temporalmente en JS (sustituyendo localStorage)
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);

    } else {
        // Fallo: Usuario no encontrado o contraseña incorrecta
        http_response_code(401); // Unauthorized
        echo json_encode(['success' => false, 'message' => 'Email o contraseña incorrectos.']);
    }

} catch (\PDOException $e) {
    http_response_code(500);
    error_log("Error de login: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor al iniciar sesión.']);
}