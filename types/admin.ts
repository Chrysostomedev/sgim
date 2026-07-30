/**
 * SGIM — Types partagés (compatibilité legacy)
 * -----------------------------------------------------------------------
 * Types référencés par les composants hérités via `@/types/admin`.
 */

export interface ProjectType {
  id: number;
  name: string;
}

export interface Coordinator {
  id: number;
  first_name: string;
  last_name: string;
}

export interface ProjectStatus {
  id: number;
  code: string;
  name: string;
}

export interface ProjectStatusPayload {
  name: string;
  code: string;
  color: string;
  project_id: number;
  target_status_id: number;
  position_type?: "before" | "after";
}

export interface Project {
  id: number;
  title: string;
  status: string;
  priority: string;
  project_type?: ProjectType;
  coordinator?: Coordinator;
  start_date?: string;
  end_date?: string;
  progress?: number;
  members_count?: number;
}
