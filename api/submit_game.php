<?php
// 1. Incluye la conexión a la base de datos
require_once 'db_connect.php';

// Establece la cabecera para indicar que la respuesta será JSON
header('Content-Type: application/json');

// 2. Comprueba si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método no permitido
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

// 3. Obtén los datos JSON enviados desde JavaScript
// Esto es necesario para solicitudes AJAX enviadas con JSON
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// 4. Valida y sanitiza los datos (EJEMPLO SIMPLE)
$game_name = $data['name'] ?? null;
$game_rating = $data['rating'] ?? null;
$game_comment = $data['comment'] ?? null;

if (empty($game_name) || !is_numeric($game_rating) || $game_rating < 1 || $game_rating > 10 || empty($game_comment)) {
    http_response_code(400); // Solicitud incorrecta
    echo json_encode(['success' => false, 'message' => 'Datos inválidos o faltantes.']);
    exit;
}

try {
    // 5. Prepara la consulta SQL usando sentencias preparadas (¡SEGURIDAD!)
    $sql = "INSERT INTO games (name, rating, comment) VALUES (:name, :rating, :comment)";
    $stmt = $pdo->prepare($sql);

    // 6. Ejecuta la consulta vinculando los parámetros
    $stmt->execute([
        ':name' => $game_name,
        ':rating' => (int)$game_rating, // Aseguramos que es un entero
        ':comment' => $game_comment
    ]);

    // 7. Envía una respuesta de éxito
    http_response_code(201); // Creado
    echo json_encode(['success' => true, 'message' => 'Juego guardado con éxito!', 'id' => $pdo->lastInsertId()]);
} catch (\PDOException $e) {
    // 8. Manejo de errores de base de datos
    http_response_code(500); // Error interno del servidor
    error_log("Error de base de datos: " . $e->getMessage()); // Para logs
    echo json_encode(['success' => false, 'message' => 'Error al guardar el juego.']);
}
