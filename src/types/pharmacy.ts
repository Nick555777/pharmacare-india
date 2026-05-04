export interface Patient {
  
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  registeredAt: string;
}



export interface PrescriptionMedicine {
  medicineId: string;
  name: string;
  dosage: string;
  quantity: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  medicines: PrescriptionMedicine[];
  status: "pending" | "dispensed";
}

export type MedicineType = "Tablet" | "Syrup";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number; // For backward compatibility / display
  pricePerStrip?: number;
  pricePerUnit: number;
  supplier: string;
  expiryDate: string;
  type: MedicineType;
  quantityPerStrip?: number; // Only for tablets
}

export interface InvoiceItem {
  description: string;
  amount: number;
  type: "Medicine" | "Consultation" | "Other";
  quantity?: number;
  pricePerUnit?: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discountApplied: boolean;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  status: "paid" | "pending" | "overdue";
    prescriptionId?: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalRevenue: number;
  pendingPrescriptions: number;
  lowStockItems: number;
  monthlyRevenue: number;
  revenueChange: number;
}

