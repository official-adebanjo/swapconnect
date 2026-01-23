export interface BaseTradeInFormData {
  brand: string;
  model: string;
  ram: string;
  autoOnOff: string;
  bodyCondition: string;
  screenCondition: string;
  repairVisits: string;
  biometricFunction: string;
}

export interface ComputerFormData extends BaseTradeInFormData {
  processor: string;
  storageType: string;
  storageSize: string;
  screenSize: string;
  operatingSystem: string;
  purchaseYear: string;
}

export interface MobileFormData extends BaseTradeInFormData {
  storage: string;
  batteryCapacity: string;
  batteryHours: string;
  phoneAge: string;
  deviceImage: string | File;
}

export interface TradeInField {
  label: string;
  name: string;
  type: "select" | "text" | "file";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  accept?: string;
  helperText?: string;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  availability: string;
  stock: number;
  isTopSale: boolean;
  tag: string;
}

export interface CalculationBreakdown {
  baseValue?: number;
  conditionMultiplier?: number;
  finalValue?: number;
}
