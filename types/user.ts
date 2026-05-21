export interface Address {
  street: string;
  city: string;
  pin: string;
  state: string;
  country: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

export interface NotificationSettings {
  newJob: boolean;
  newsletter: boolean;
  promotions: boolean;
}

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  address: Address;
  jobDomain: string;
  skills: string[];
  summary?: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  languages?: string[];
  socialLinks?: SocialLinks;
  isVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  notificationSettings: NotificationSettings;
  whatsappNumber?: string;
  telegramNumber?: string;
  whatsappNotification: boolean;
  telegramNotification: boolean;
  createdAt: Date;
  updatedAt: Date;
}
