<?php
// submit_game.php
require_once 'db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$game_name = trim($data['name'] ?? null);
$game_rating = $data['rating'] ?? null;
$game_comment = trim($data['comment'] ?? null);

// VALIDACIÓN
$errors = [];

// Validar Nombre
if (empty($game_name)) {
    $errors['name'] = 'El nombre del juego no puede estar vacío.';
} elseif (strlen($game_name) > 255) {
    $errors['name'] = 'El nombre es demasiado largo.';
}

// Validar Rating
if (!is_numeric($game_rating)) {
    $errors['rating'] = 'La calificación debe ser un número.';
} else {
    $rating = (int)$game_rating;
    if ($rating < 1 || $rating > 10) {
        $errors['rating'] = 'La calificación debe estar entre 1 y 10.';
    }
}

// Validar Comentario
if (!empty($game_comment) && strlen($game_comment) > 500) {
    $errors['comment'] = 'El comentario es demasiado largo (máximo 500 caracteres).';
}

// Si hay errores, devolver 400 Bad Request
if (!empty($errors)) {
    http_response_code(400);
    // Devolvemos el array de errores, esto es crucial para JavaScript
    echo json_encode(['success' => false, 'message' => 'Errores de validación.', 'errors' => $errors]);
    exit;
}

try {
    $sql = "INSERT INTO games (name, rating, comment) VALUES (:name, :rating, :comment)";
    $stmt = $pdo->prepare($sql);

    // Los datos ya están limpios y validados, listos para la inserción
    $stmt->execute([
        ':name' => $game_name,
        ':rating' => $rating,
        ':comment' => $game_comment
    ]);

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Juego guardado con éxito!', 'id' => $pdo->lastInsertId()]);
} catch (\PDOException $e) {
    http_response_code(500);
    error_log("Error de base de datos: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error al guardar el juego.']);
}
