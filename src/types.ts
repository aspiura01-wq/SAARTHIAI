/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Language {
  ENGLISH = 'en-IN',
  HINDI = 'hi-IN',
  KANNADA = 'kn-IN',
  TELUGU = 'te-IN',
  TAMIL = 'ta-IN',
  BENGALI = 'bn-IN',
}

export type AppView = 
  | 'home' 
  | 'assistant' 
  | 'medical' 
  | 'gov-schemes' 
  | 'nearby' 
  | 'travel' 
  | 'jobs' 
  | 'emergency' 
  | 'history'
  | 'settings'
  | 'education'
  | 'finance'
  | 'other-services'
  | 'doc-scanner'
  | 'fraud-shield'
  | 'complaints'
  | 'tasks'
  | 'records';

export interface EducationResource {
  type: 'material' | 'career' | 'scholarship' | 'homework';
  title: string;
  description: string;
  details: string;
}

export interface FinanceIssue {
  type: 'card' | 'cash' | 'loan';
  title: string;
  steps: string[];
  helplines: { name: string; number: string }[];
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  reminder?: string;
}

export interface ScannedRecord {
  id: string;
  name: string;
  type: string;
  date: number;
  url: string;
}

export interface MedicineInfo {
  name: string;
  salt: string;
  price: string;
  uses: string;
  benefits: string;
  sideEffects: string;
  safetyWarnings: string;
  whoShouldAvoid: string;
  prescriptionRequired: boolean;
  category: string;
  alternatives: string[];
  warning: string;
}

export interface GovScheme {
  name: string;
  eligibility: string;
  documents: string[];
  benefits: string;
  applicationSteps: string[];
  officialLink: string;
  nearbyOffice: string;
}

export interface NearbyService {
  name: string;
  type: 'police' | 'hospital' | 'pharmacy' | 'food' | 'shelter' | 'gov' | 'ngo' | 'bloodbank' | 'emergency' | 'rural' | 'vet';
  distance: string;
  address: string;
  contact: string;
}

export interface JobListing {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  applyLink: string;
}

export interface TravelInfo {
  mode: string;
  station: string;
  distance: string;
  fareEstimate: string;
  link: string;
}

export interface EmergencyContact {
  id?: string;
  name: string;
  number: string;
  relation: string;
}

export interface ActivityHistory {
  id: string;
  type: AppView;
  title: string;
  timestamp: number;
  data?: any;
}
