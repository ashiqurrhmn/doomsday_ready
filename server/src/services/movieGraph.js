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