export type RequestStatus = 'missing' | 'uploaded' | 'unavailable' | 'needs_review';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  firmName: string;
  role: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface DocumentRequest {
  id: string;
  userId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  title: string;
  dueDate: string;
  publicToken: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

export interface RequestItem {
  id: string;
  requestId: string;
  title: string;
  description?: string;
  status: RequestStatus;
  clientNote?: string;
  uploadedFileName?: string;
  uploadedAt?: string;
}

export interface EarlyAccessLead {
  id: string;
  email: string;
  name: string;
  company: string;
  role: string;
  planClicked: string;
  currentTool?: string;
  hasMissingDocsNow?: boolean;
  createdAt: string;
}
