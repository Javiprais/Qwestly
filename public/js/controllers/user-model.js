// user-model.js
// Modelo de usuario para manejar almacenamiento en localStorage

export class UserModel {
  // Obtener todos los usuarios guardados
  static getAll() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users;
  }

  // Añadir un nuevo usuario
  static add(user) {
    const users = UserModel.getAll();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  // (Opcional) Limpiar todos los usuarios guardados
  static clearAll() {
    localStorage.removeItem("users");
  }
}
