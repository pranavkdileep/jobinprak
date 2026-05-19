export interface JobDetails {
  min_experience: number;
  max_experience: number;
  small_description: string;
  skill_set: string[];
  responsibilities: string[];
  apply_email: string;
}

export interface Job {
  _id?: string;
  job_title: string;
  company_name: string;
  posted_date: string;
  closing_date: string;
  details: JobDetails;
  job_id: number;
  company_id: number;
  source: string;
}
