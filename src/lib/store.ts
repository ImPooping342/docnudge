import { 
  DocumentRequest, 
  RequestItem, 
  EarlyAccessLead, 
  UserProfile,
  RequestStatus
} from '../types';
import { generateToken } from './utils';

const STORAGE_KEYS = {
  REQUESTS: 'docnudge_requests',
  ITEMS: 'docnudge_items',
  LEADS: 'docnudge_leads',
  USER: 'docnudge_user',
};

// Initialize with some demo data if empty
const initDemoData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    const demoUser: UserProfile = {
      id: 'user_1',
      email: 'nicola.kosturski@gmail.com',
      name: 'Nicola',
      firmName: 'Premium Bookkeeping',
      role: 'Senior Accountant',
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));

    const demoRequests: DocumentRequest[] = [
      {
        id: 'req_1',
        userId: 'user_1',
        clientId: 'cli_1',
        clientName: 'Oak Cafe',
        clientEmail: 'manager@oakcafe.com',
        title: 'March bookkeeping cleanup',
        dueDate: '2026-05-15',
        publicToken: 'oak-cafe-march',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'req_2',
        userId: 'user_1',
        clientId: 'cli_2',
        clientName: 'Sarah Miller',
        clientEmail: 'sarah@millerconsulting.com',
        title: '2025 tax prep',
        dueDate: '2026-06-01',
        publicToken: 'sarah-miller-2025',
        status: 'active',
        createdAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(demoRequests));

    const demoItems: RequestItem[] = [
      { id: 'item_1', requestId: 'req_1', title: 'March bank statement', status: 'missing' },
      { id: 'item_2', requestId: 'req_1', title: 'Missing Uber receipt from 12 March', status: 'uploaded', uploadedFileName: 'uber_receipt_12_03.pdf' },
      { id: 'item_3', requestId: 'req_1', title: 'Supplier invoice from ACME Ltd', status: 'missing' },
      { id: 'item_4', requestId: 'req_2', title: 'Form 1099-NEC from AWS', status: 'missing' },
      { id: 'item_5', requestId: 'req_2', title: 'Rent agreement 2025', status: 'uploaded', uploadedFileName: 'lease_contract.docx' },
    ];
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(demoItems));
  }
};

initDemoData();

export const DocNudgeStore = {
  // User
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  // Requests
  getRequests: async (): Promise<DocumentRequest[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return data ? JSON.parse(data) : [];
  },

  getRequestById: async (id: string): Promise<DocumentRequest | null> => {
    const requests = await DocNudgeStore.getRequests();
    return requests.find(r => r.id === id) || null;
  },

  getRequestByToken: async (token: string): Promise<DocumentRequest | null> => {
    const requests = await DocNudgeStore.getRequests();
    return requests.find(r => r.publicToken === token) || null;
  },

  saveRequest: async (request: Omit<DocumentRequest, 'id' | 'createdAt' | 'publicToken' | 'status'>, items: string[]): Promise<DocumentRequest> => {
    const requests = await DocNudgeStore.getRequests();
    const newRequest: DocumentRequest = {
      ...request,
      id: `req_${generateToken(8)}`,
      publicToken: generateToken(10),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    requests.push(newRequest);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

    const allItems = await DocNudgeStore.getRequestItems(newRequest.id);
    const newItems: RequestItem[] = items.map(title => ({
      id: `item_${generateToken(8)}`,
      requestId: newRequest.id,
      title: title.trim(),
      status: 'missing' as RequestStatus
    })).filter(i => i.title !== '');

    const existingItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]');
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify([...existingItems, ...newItems]));

    return newRequest;
  },

  // Items
  getRequestItems: async (requestId: string): Promise<RequestItem[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
    const items: RequestItem[] = data ? JSON.parse(data) : [];
    return items.filter(i => i.requestId === requestId);
  },

  getAllItems: async (): Promise<RequestItem[]> => {
    const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
    return data ? JSON.parse(data) : [];
  },

  updateRequestItem: async (itemId: string, updates: Partial<RequestItem>): Promise<RequestItem | null> => {
    const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
    const items: RequestItem[] = data ? JSON.parse(data) : [];
    const index = items.findIndex(i => i.id === itemId);
    
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    return items[index];
  },

  // Early Access
  saveEarlyAccessLead: async (lead: Omit<EarlyAccessLead, 'id' | 'createdAt'>): Promise<EarlyAccessLead> => {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    const leads: EarlyAccessLead[] = data ? JSON.parse(data) : [];
    
    const newLead: EarlyAccessLead = {
      ...lead,
      id: `lead_${generateToken(8)}`,
      createdAt: new Date().toISOString(),
    };

    leads.push(newLead);
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    console.log('Early access lead saved:', newLead);
    return newLead;
  }
};
