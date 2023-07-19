export const isExistCoordinate = (
  coordinate: number | null | undefined,
): coordinate is number => {
  return typeof coordinate === "number" && !Number.isNaN(coordinate);
};
