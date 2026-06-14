type MetadataSource = {
  metadata?: Record<string, unknown> | null;
  publicMetadata?: Record<string, unknown> | null;
  privateMetadata?: Record<string, unknown> | null;
  unsafeMetadata?: Record<string, unknown> | null;
} | null | undefined;

const isAdminValue = (value: unknown) =>
  value === true || value === "true" || value === 1 || value === "1";

export function hasAdminAccess(...sources: MetadataSource[]) {
  return sources.some((source) =>
    isAdminValue(source?.metadata?.isAdmin) ||
    isAdminValue(source?.publicMetadata?.isAdmin) ||
    isAdminValue(source?.privateMetadata?.isAdmin) ||
    isAdminValue(source?.unsafeMetadata?.isAdmin),
  );
}
