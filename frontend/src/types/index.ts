export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: 'user' | 'pharmacy' | 'delivery' | 'admin';
  pharmacy_id?: number;
  created_at: string;
}


export interface Medicine {
  id: number;
  name: string;
  generic_name: string;
  strength: string;
  dosage_form: string;
  manufacturer: string;
  category: string;
  description?: string;
  usage_instructions?: string;
  side_effects?: string;
  image_url?: string;
  ocr_keywords?: string;
  created_at: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  home_delivery_available: boolean;
  delivery_fee: number;
  rating: number;
  created_at: string;
  distance_km?: number;
  medicine_price?: number;
  medicine_stock?: number;
  medicine_available?: boolean;
}

export interface PharmacyInventoryItem {
  id: number;
  medicine_id: number;
  medicine_name: string;
  generic_name: string;
  strength: string;
  dosage_form: string;
  category: string;
  price: number;
  stock_quantity: number;
  is_available: boolean;
  updated_at: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  unit_price: number;
}

export interface ReservationItem {
  id: number;
  medicine_id: number;
  medicine_name: string;
  strength: string;
  dosage_form: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Reservation {
  id: number;
  reservation_code: string;
  pharmacy_id: number;
  pharmacy_name: string;
  pharmacy_address: string;
  pharmacy_phone: string;
  customer_name: string;
  customer_phone: string;
  delivery_type: 'COLLECTION' | 'DELIVERY';
  delivery_address?: string;
  notes?: string;
  total_amount: number;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Ready for Collection' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at: string;
  items: ReservationItem[];
}

export interface OrderItem {
  id: number;
  medicine_id: number;
  medicine_name: string;
  strength: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_code: string;
  reservation_id?: number;
  pharmacy_id: number;
  pharmacy_name: string;
  pharmacy_address?: string;
  pharmacy_phone?: string;
  delivery_user_id?: number;
  delivery_partner_name?: string;
  delivery_partner_phone?: string;
  customer_name: string;
  customer_phone: string;
  delivery_type: 'DELIVERY' | 'COLLECTION';
  delivery_address?: string;
  total_amount: number;
  status: 'Order Placed' | 'Pharmacy Confirmed' | 'Preparing' | 'Picked up from Pharmacy' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

  tracking_notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface DeliveryStats {
  total_completed: number;
  active_deliveries: number;
  total_earnings: number;
  rating: number;
}


export interface OcrCandidate {
  medicine: Medicine;
  confidence: number;
  match_reasons: string[];
  matched_tokens: string[];
}

export interface LocationCoords {
  lat: number;
  lng: number;
  label: string;
}
