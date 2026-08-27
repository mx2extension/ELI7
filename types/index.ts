export interface StoreProduct {
  id: string;
  title: string;
  category: 't-shirts' | 'sweatshirts' | 'face-caps';
  price: number;
  description: string | null;
  image_url: string;
  sizes: string[];
  colors: string[];
  is_available: boolean;
  created_at: string;
}

export interface OrderPayload {
  product_id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  delivery_address: string;
  size: string;
  color: string;
  quantity: number;
  total_price: number;
}