export interface PrintSettings {
  paper_size: string;
  color_mode: 'bw' | 'color';
  duplex: boolean;
  orientation: 'portrait' | 'landscape';
  copies: number;
  page_range?: string;
  aadhaar_mode?: 'front' | 'same_page' | 'duplex';
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  mobile: string;
  email: string;
  is_active: boolean;
  file_size_limit_mb: number;
  accepted_file_types: string[];
  services_enabled: string[];
}

export interface PricingRule {
  id: string;
  shop_id: string;
  paper_size: string;
  color_mode: 'bw' | 'color';
  price_per_page: number;
}
