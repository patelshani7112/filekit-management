export type JobStatus = "queued" | "processing" | "done" | "error";

export interface JobRecord {
  id: string;
  tool: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  inputInfo: any;
  outputInfo: any;
  error?: string;
}

export interface JobStore {
  get(id: string): JobRecord | undefined;
  set(job: JobRecord): void;
  update(id: string, patch: Partial<JobRecord>): void;
}

export function createJobStore(): JobStore {
  const map = new Map<string, JobRecord>();

  return {
    get(id) {
      return map.get(id);
    },
    set(job) {
      map.set(job.id, job);
    },
    update(id, patch) {
      const existing = map.get(id);
      if (!existing) return;
      const updated: JobRecord = { ...existing, ...patch, updatedAt: new Date().toISOString() };
      map.set(id, updated);
    }
  };
}
