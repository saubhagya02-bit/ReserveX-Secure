import api from "./api";

export const getAllGenres = async () => {
  return [
    { id: 1, name: "Fiction" },
    { id: 2, name: "Non-Fiction" },
    { id: 3, name: "Children's Books" },
    { id: 4, name: "Educational" },
    { id: 5, name: "Religious" },
    { id: 6, name: "Science" },
    { id: 7, name: "History" },
    { id: 8, name: "Biography" },
    { id: 9, name: "Poetry" },
    { id: 10, name: "Comics" },
    { id: 11, name: "Self Help" },
    { id: 12, name: "Technology" },
  ];
};
/**
 * Get literary genres added by the current user for the exhibition.
 */
export const getMyGenres = async () => {
  const { data } = await api.get("/genres");
  return data;
};

/**
 * Add a genre for the current user.
 * @param {string} genreName - e.g. "Fiction", "Children's"
 */
export const addGenre = async (genreName) => {
  const { data } = await api.post("/genres", { genreName });
  return data;
};

/**
 * Replace all genres for the current user.
 * @param {string[]} genreNames - Array of genre names
 */
export const setGenres = async (genreNames) => {
  const { data } = await api.put("/genres", genreNames);
  return data;
};
