import { router as compressPreviewRouter } from './preview.ts';
import { router as compressBatchRouter } from './batch.ts';

export const compress = {
  preview: compressPreviewRouter,
  batch: compressBatchRouter
};

export { compressPreviewRouter, compressBatchRouter };

