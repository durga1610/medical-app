import {
  User, Medicine, Pharmacy, PharmacyInventoryItem,
  Reservation, Order, OcrCandidate, DeliveryStats
} from '../types';


const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('mediaccess_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = 'An unexpected error occurred.';
    try {
      const errData = await res.json();
      if (errData.detail) {
        if (Array.isArray(errData.detail)) {
          errorDetail = errData.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
        } else {
          errorDetail = errData.detail;
        }
      }
    } catch {
      errorDetail = `Server error (${res.status} ${res.statusText})`;
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  // Auth
  async register(data: any): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async login(credentials: { email: string; password: string }): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updateProfile(data: { full_name?: string; phone?: string; address?: string }): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Medicines
  async searchMedicines(params?: { q?: string; category?: string; limit?: number }): Promise<Medicine[]> {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.category) query.append('category', params.category);
    if (params?.limit) query.append('limit', params.limit.toString());
    const res = await fetch(`${API_BASE}/medicines?${query.toString()}`);
    return handleResponse(res);
  },

  async getSuggestions(q: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/medicines/suggestions?q=${encodeURIComponent(q)}`);
    return handleResponse(res);
  },

  async getCategories(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/medicines/categories`);
    return handleResponse(res);
  },

  async getMedicineDetail(id: number, lat?: number, lng?: number): Promise<{ medicine: Medicine; available_pharmacies: Pharmacy[] }> {
    const query = new URLSearchParams();
    if (lat !== undefined) query.append('user_lat', lat.toString());
    if (lng !== undefined) query.append('user_lng', lng.toString());
    const res = await fetch(`${API_BASE}/medicines/${id}?${query.toString()}`);
    return handleResponse(res);
  },

  async matchOcr(extractedText: string): Promise<{
    extracted_text: string;
    clean_tokens: string[];
    candidates: OcrCandidate[];
    message: string;
  }> {
    const res = await fetch(`${API_BASE}/medicines/match-ocr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ extracted_text: extractedText }),
    });
    return handleResponse(res);
  },

  // Pharmacies
  async getPharmacies(params?: {
    lat?: number;
    lng?: number;
    delivery_only?: boolean;
    medicine_id?: number;
    available_only?: boolean;
    sort_by?: string;
  }): Promise<Pharmacy[]> {
    const query = new URLSearchParams();
    if (params?.lat !== undefined) query.append('user_lat', params.lat.toString());
    if (params?.lng !== undefined) query.append('user_lng', params.lng.toString());
    if (params?.delivery_only) query.append('delivery_only', 'true');
    if (params?.medicine_id) query.append('medicine_id', params.medicine_id.toString());
    if (params?.available_only) query.append('available_only', 'true');
    if (params?.sort_by) query.append('sort_by', params.sort_by);

    const res = await fetch(`${API_BASE}/pharmacies?${query.toString()}`);
    return handleResponse(res);
  },

  async getPharmacyDetail(id: number, lat?: number, lng?: number): Promise<{ pharmacy: Pharmacy; inventory: PharmacyInventoryItem[] }> {
    const query = new URLSearchParams();
    if (lat !== undefined) query.append('user_lat', lat.toString());
    if (lng !== undefined) query.append('user_lng', lng.toString());
    const res = await fetch(`${API_BASE}/pharmacies/${id}?${query.toString()}`);
    return handleResponse(res);
  },

  // Reservations
  async createReservation(data: {
    pharmacy_id: number;
    customer_name: string;
    customer_phone: string;
    delivery_type: 'COLLECTION' | 'DELIVERY';
    delivery_address?: string;
    notes?: string;
    items: { medicine_id: number; quantity: number }[];
  }): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getUserReservations(): Promise<Reservation[]> {
    const res = await fetch(`${API_BASE}/reservations`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getReservationById(id: number): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async cancelReservation(id: number): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/reservations/${id}/cancel`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  // Orders
  async getUserOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/reservations/user/orders`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async trackOrderByCode(orderCode: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/reservations/orders/track/${encodeURIComponent(orderCode)}`);
    return handleResponse(res);
  },

  // Pharmacy Management Admin
  async getPharmacyAdminProfile(): Promise<Pharmacy> {
    const res = await fetch(`${API_BASE}/pharmacy-admin/profile`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updatePharmacyAdminProfile(data: Partial<Pharmacy>): Promise<Pharmacy> {
    const res = await fetch(`${API_BASE}/pharmacy-admin/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getPharmacyInventory(): Promise<PharmacyInventoryItem[]> {
    const res = await fetch(`${API_BASE}/pharmacy-admin/inventory`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updatePharmacyInventoryItem(medicineId: number, data: { price: number; stock_quantity: number; is_available: boolean }): Promise<PharmacyInventoryItem> {
    const res = await fetch(`${API_BASE}/pharmacy-admin/inventory/${medicineId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getPharmacyAdminReservations(): Promise<Reservation[]> {
    const res = await fetch(`${API_BASE}/pharmacy-admin/reservations`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updateReservationStatus(reservationId: number, status: string, notes?: string): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/pharmacy-admin/reservations/${reservationId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(res);
  },

  async getPharmacyAdminOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/pharmacy-admin/orders`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updateOrderStatus(orderId: number, status: string, tracking_notes?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/pharmacy-admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, tracking_notes }),
    });
    return handleResponse(res);
  },

  // Phase 3: Delivery Partner Portal Endpoints
  async getAvailableDeliveryJobs(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/delivery/available-jobs`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async getMyDeliveries(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/delivery/my-deliveries`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async acceptDeliveryJob(orderId: number): Promise<Order> {
    const res = await fetch(`${API_BASE}/delivery/accept/${orderId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },

  async updateDeliveryStatus(orderId: number, status: string, tracking_notes?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/delivery/status/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, tracking_notes }),
    });
    return handleResponse(res);
  },

  async getDeliveryStats(): Promise<DeliveryStats> {
    const res = await fetch(`${API_BASE}/delivery/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  },
};

