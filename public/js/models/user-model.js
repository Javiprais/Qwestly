class UserModel {
  static addUser(user) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }

  static getAll() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  static findByEmail(email) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(u => u.email === email);
  }

  static initializeGames() {
    if (!localStorage.getItem("userGames")) {
      localStorage.setItem("userGames", JSON.stringify({}));
    }
  }

  static getUserGames(email) {
    const allData = JSON.parse(localStorage.getItem("userGames")) || {};
    return allData[email] || [];
  }

  static addGameToUser(email, game) {
    const allData = JSON.parse(localStorage.getItem("userGames")) || {};
    if (!allData[email]) allData[email] = [];
    allData[email].push(game);
    localStorage.setItem("userGames", JSON.stringify(allData));
  }
}

export { UserModel };
