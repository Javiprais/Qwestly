<?php
// api/delete_game.php
require_once 'db_connect.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$game_id = $data['id'] ?? null;

if (!$game_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Falta el ID del juego']);
    exit;
}

try {
    // Preparamos la sentencia SQL
    $sql = "DELETE FROM games WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $game_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Juego eliminado']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Juego no encontrado']);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error SQL: ' . $e->getMessage()]);
}
?>