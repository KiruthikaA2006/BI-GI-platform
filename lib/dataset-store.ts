import { BusinessRow } from "./analytics";

export interface StoredDataset {
  id: string;
  organizationId: string;
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
  // Replace if existing dataset with same ID or add to front
  const idx = globalForDatasetStore.allDatasets.findIndex((d) => d.id === dataset.id);
  if (idx >= 0) {
    globalForDatasetStore.allDatasets[idx] = dataset;
  } else {
    globalForDatasetStore.allDatasets.unshift(dataset);
  }
}

export function getActiveDataset(orgId?: string): StoredDataset | null {
  if (orgId) {
    if (globalForDatasetStore.activeDataset?.organizationId === orgId) {
      return globalForDatasetStore.activeDataset;
    }
    const found = globalForDatasetStore.allDatasets.find((d) => d.organizationId === orgId);
    return found || null;
  }
  return null;
}

export function getAllStoredDatasets(orgId?: string): StoredDataset[] {
  if (!orgId) return globalForDatasetStore.allDatasets;
  return globalForDatasetStore.allDatasets.filter((d) => d.organizationId === orgId);
}
