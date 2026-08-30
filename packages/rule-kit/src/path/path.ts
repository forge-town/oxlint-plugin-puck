export const normalizePath = (filename: string): string => filename.replaceAll("\\", "/");

export const isTsxFile = (filename: string): boolean => normalizePath(filename).endsWith(".tsx");
