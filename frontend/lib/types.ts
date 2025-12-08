export type UserRole = 'admin' | 'manager' | 'member';
export type Country = 'india' | 'america' | 'global';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  country: Country;
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  image_url: string;
  country: Country;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export interface RestaurantDetail extends Restaurant {
  menu_items: MenuItem[];
}

export interface OrderItem {
  id: number;
  menu_item_id: number;
  menu_item_name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'cart' | 'placed' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  status: OrderStatus;
  total_amount: number;
  country: Country;
  created_at: string;
  items: OrderItem[];
}

export type PaymentType = 'card' | 'upi' | 'netbanking';

export interface PaymentMethod {
  id: number;
  type: PaymentType;
  last_four: string;
  is_default: boolean;
}
