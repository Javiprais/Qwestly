<?php
// Incluye la conexión a la base de datos (reutiliza el script anterior)
require_once 'db_connect.php';

// 1. Establece la cabecera para indicar que la respuesta será JSON
header('Content-Type: application/json');

// Opcional: permite solicitudes desde cualquier origen si fuera necesario (CORS)
// header('Access-Control-Allow-Origin: *'); 

// 2. Comprueba que el método de solicitud es GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Método no permitido
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

try {
    // 3. Consulta SQL: Selecciona los campos que necesitas y ordena por fecha de envío (últimos primero)
    $sql = "SELECT id, name, rating, comment FROM games ORDER BY submission_date DESC";
    $stmt = $pdo->prepare($sql);

    // 4. Ejecuta la consulta
    $stmt->execute();

    // 5. Obtiene todos los resultados como un array asociativo
    $games = $stmt->fetchAll();

    // 6. Envía una respuesta de éxito con los datos
    http_response_code(200); // OK
    echo json_encode([
        'success' => true,
        'data' => $games
    ]);
} catch (\PDOException $e) {
    // 7. Manejo de errores
    http_response_code(500); // Error interno del servidor
    error_log("Error de base de datos al obtener juegos: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener la lista de juegos.'
    ]);
}
