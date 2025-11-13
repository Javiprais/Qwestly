// user-model.js
// uso de localStorage

export const UserModel = (() => {

  const STORAGE_KEY = "users"; // Clave para almacenar los usuarios en localStorage

  const loadUsers = () => { // Carga la lista de usuarios desde localStorage
    try {
      const data = localStorage.getItem(STORAGE_KEY); // Obtiene los datos almacenados del localStorage

      // Si data existe, devuelve el array de usuarios, si no, un array vacío y mensaje de error por consola
      if (data) {
        return JSON.parse(data);
      } else {
        return [];
      }
    } catch (error) {
      console.log("Error al cargar usuarios:", error);
      return [];
    }
  };

  const saveUsers = (list) => { // Guarda la lista de usuarios en localStorage
    try {
      // Convierte la lista a JSON y la guarda en localStorage gracias a setItem
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
      console.log("Error al guardar usuarios:", error);
    }
  };

  const getAll = () => { // Devuelve todos los usuarios
    try {
      return loadUsers();
    } catch (error) {
      console.log("Error al obtener todos los usuarios:", error);
      return [];
    }
  };

  const findByEmail = (email) => { // Busca un usuario por su email
    try {
      const users = loadUsers(); // Carga los usuarios actuales

      // si no encuentra ninguno, devuelve null
      const foundUser = users.find((u) => {
        return u.email === email;
      });

      if (foundUser) {
        return foundUser;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error al buscar usuario por email:", error);
      return null;
    }
  };

  const addUser = (userObj) => { // Añade un nuevo usuario
    try {
      const users = loadUsers();

      users.push(userObj); // Añade el nuevo usuario al array users

      saveUsers(users); // Guarda la lista actualizada en localStorage

      return userObj; // Devuelve el usuario recién añadido
    } catch (error) {
      console.log("Error al añadir usuario:", error);
      return null;
    }
  };

  const clearAll = () => { // Elimina todos los usuarios del localStorage para esa clave
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.log("Error al eliminar todos los usuarios:", error);
    }
  };

  return {
    getAll: getAll,
    findByEmail: findByEmail,
    addUser: addUser,
    clearAll: clearAll
  }; // Exposición de los métodos públicos. Ej: UserModel.getAll(), userModel.addUser({name: 'Javi', email: ...'

})();
