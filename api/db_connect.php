<?php
// Configuración de la Base de Datos
$host = 'localhost'; // Tu host de MySQL, generalmente localhost con XAMPP
$db   = 'qwestly_db'; // Reemplaza con el nombre real de tu base de datos
$user = 'root';   // El usuario de MySQL, generalmente 'root' con XAMPP
$pass = '';   // La contraseña de MySQL, generalmente vacía con XAMPP
$charset = 'utf8mb4';

// Data Source Name (DSN)
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