<?php
require_once 'db_connect.php'; 
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

// 1. Validación básica
if (empty($name) || empty($email) || empty($password) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos de registro incompletos o inválidos.']);
    exit;
}

// 2. Seguridad: Hashear la contraseña
$password_hash = password_hash($password, PASSWORD_DEFAULT);

try {
    // 3. Comprobar si el correo ya existe
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['success' => false, 'message' => 'El email ya está registrado.']);
        exit;
    }

    // 4. Insertar nuevo usuario
    $sql = "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$name, $email, $password_hash]);

    http_response_code(201); // Created
    echo json_encode(['success' => true, 'message' => 'Usuario registrado con éxito.']);

} catch (\PDOException $e) {
    http_response_code(500);
    error_log("Error de registro: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor al registrar.']);
}