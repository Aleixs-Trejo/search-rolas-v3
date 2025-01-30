const isInFavorites = (id: number): boolean => {
  const storedData = JSON.parse(localStorage.getItem("mySongs") || "[]");
  return Array.isArray(storedData) ? storedData.some((song) => song.id === id) : false;
};

export { isInFavorites };