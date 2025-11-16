// user-model.js
class UserModel {
  // Obtener todos los usuarios
  static getAll() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  // Añadir nuevo usuario
  static addUser(user) {
    const users = UserModel.getAll();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Obtener juegos de un usuario específico
  static getUserGames(email) {
    const allData = JSON.parse(localStorage.getItem("userGames")) || {};
    return allData[email] || [];
  }

  // Añadir juego a un usuario específico
  static addGameToUser(email, gameObj) {
    const allData = JSON.parse(localStorage.getItem("userGames")) || {};
    if (!allData[email]) allData[email] = [];
    allData[email].push(gameObj);
    localStorage.setItem("userGames", JSON.stringify(allData));
  }
}

export { UserModel };
