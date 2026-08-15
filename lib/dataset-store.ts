import { BusinessRow } from "./analytics";

export interface StoredDataset {
  id: string;
  name: string;
  description: string;
  rowCount: number;
  columns: string[];
  data: BusinessRow[];
  dataSourceName: string;
  updatedAt: string;
}

const globalForDatasetStore = globalThis as unknown as {
  activeDataset: StoredDataset | null;
  allDatasets: StoredDataset[];
};

if (!globalForDatasetStore.allDatasets) {
  globalForDatasetStore.allDatasets = [];
}

export function saveActiveDataset(dataset: StoredDataset) {
  globalForDatasetStore.activeDataset = dataset;
  globalForDatasetStore.allDatasets.unshift(dataset);
}

export function getActiveDataset(): StoredDataset | null {
  return globalForDatasetStore.activeDataset || globalForDatasetStore.allDatasets[0] || null;
}

export function getAllStoredDatasets(): StoredDataset[] {
  return globalForDatasetStore.allDatasets;
}
