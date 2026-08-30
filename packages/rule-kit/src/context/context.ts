type SourceCodeWithFilename = {
  filename?: string;
};

export type FilenameContext = {
  filename?: string;
  physicalFilename?: string;
  getFilename?: () => string;
  sourceCode?: unknown;
};

export const getFilename = (context: FilenameContext): string =>
  context.filename ??
  context.physicalFilename ??
  context.getFilename?.() ??
  (context.sourceCode as SourceCodeWithFilename | undefined)?.filename ??
  "";
