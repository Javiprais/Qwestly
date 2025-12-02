<?php

require_once 'db_connect.php';
header('Content-Type: application/json');

// Comprueba que el método de solicitud es GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Método no permitido
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

// Recibimos el user_id de la URL
$user_id = $_GET['user_id'] ?? null;

if (empty($user_id) || !is_numeric($user_id)) {
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'ID de usuario no válido']);
    exit;
}
$user_id = (int)$user_id;


try {
    $sql = "SELECT id, name, rating, comment FROM games WHERE user_id = :user_id ORDER BY submission_date DESC";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([':user_id' => $user_id]);

    $games = $stmt->fetchAll();

    http_response_code(200); // OK
    echo json_encode([
        'success' => true,
        'data' => $games
    ]);
} catch (\PDOException $e) {

    http_response_code(500); // Error interno del servidor
    error_log("Error de base de datos al obtener juegos: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener la lista de juegos.'
    ]);
}
