export function hasCircularDependency(
  movies,
  movieId,
  proposedPrerequisiteIds,
) {
  const graph = new Map();

  for (const movie of movies) {
    graph.set(
      movie._id.toString(),
      movie.prerequisiteIds.map((id) => id.toString()),
    );
  }

  graph.set(
    movieId.toString(),
    proposedPrerequisiteIds.map((id) => id.toString()),
  );

  const visiting = new Set();
  const visited = new Set();

  function visit(currentId) {
    if (visiting.has(currentId)) {
      return true;
    }

    if (visited.has(currentId)) {
      return false;
    }

    visiting.add(currentId);

    const prerequisiteIds = graph.get(currentId) ?? [];

    for (const prerequisiteId of prerequisiteIds) {
      if (visit(prerequisiteId)) {
        return true;
      }
    }

    visiting.delete(currentId);
    visited.add(currentId);

    return false;
  }

  return visit(movieId.toString());
}

export function buildRewatchOrder(movies, targetId) {
  const movieMap = new Map();

  for (const movie of movies) {
    movieMap.set(movie._id.toString(), movie);
  }

  const targetMovie = movieMap.get(targetId.toString());

  if (!targetMovie) {
    return [];
  }

  const visited = new Set();
  const orderedIds = [];

  function visit(movieId) {
    const id = movieId.toString();

    if (visited.has(id)) {
      return;
    }

    visited.add(id);

    const movie = movieMap.get(id);

    if (!movie) {
      return;
    }

    for (const prerequisiteId of movie.prerequisiteIds) {
      visit(prerequisiteId);
    }

    orderedIds.push(id);
  }

  for (const prerequisiteId of targetMovie.prerequisiteIds) {
    visit(prerequisiteId);
  }

  return orderedIds;
}