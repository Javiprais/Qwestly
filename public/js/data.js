// CLAVE para localStorage
const STORAGE_KEY = 'qwestly_games_v1';

// Datos iniciales (Seed data) para que la app no arranque vacía la primera vez
const initialData = [
    { id: 1, title: "Elden Ring", rating: 9.5, comment: "Obra maestra, el lore me lo descargo aparte." },
    { id: 2, title: "Hollow Knight", rating: 10, comment: "Mejor juego de la historia. Team Cherry mu bueno mu bueno mu bueno." },
    { id: 3, title: "Cyberpunk 2077", rating: 8.5, comment: "Mejoró mucho con los parches." }
];

// Función para obtener juegos (Lee de LocalStorage o usa los iniciales)
export const getGames = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        // Si no hay nada guardado, guardamos los iniciales y los devolvemos
        saveGames(initialData);
        return initialData;
    }
    return JSON.parse(stored);
};

// Función para guardar el array completo
export const saveGames = (gamesArray) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gamesArray));
};

// Función para añadir un juego nuevo
export const addGame = (gameObj) => {
    const games = getGames();
    // Generamos un ID único basado en el timestamp (Date.now)
    const newGame = { ...gameObj, id: Date.now() }; 
    games.push(newGame);
    saveGames(games);
    return games;
};

// Función para eliminar un juego por ID
export const removeGame = (id) => {
    const games = getGames();
    const filteredGames = games.filter(game => game.id !== id);
    saveGames(filteredGames);
    return filteredGames;
};