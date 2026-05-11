export type EndpointMeta = {
  name: string;
  path: string;
  fetchedAt: string;    // ISO 8601
  recordCount: number;
};

export type DataMetadata = {
  generatedAt: string;   // ISO 8601 build time
  schemaVersion: number; // bump when shape changes
  endpoints: Record<"capacidad" | "pipeline" | "netBilling", EndpointMeta>;
};
