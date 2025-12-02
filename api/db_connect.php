<?php
// Configuración de la Base de Datos
$host = 'localhost'; 
$db   = 'qwestly_db'; 
$user = 'root';   
$pass = '';   
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lanzar excepciones en errores
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Devolver filas como arrays asociativos
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // Si la conexión falla, detén el script y muestra un mensaje de error
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>