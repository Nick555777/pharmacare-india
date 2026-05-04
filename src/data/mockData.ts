import { Patient, Appointment, Prescription, Medicine, Invoice, DashboardStats } from "@/types/pharmacy";

export const mockPatients: Patient[] = [
  { id: "P001", name: "Sarah Johnson", age: 34, gender: "Female", phone: "9876543210", email: "sarah@email.com", address: "123 Mumbai St", bloodGroup: "A+", registeredAt: "2024-01-15" },
  { id: "P002", name: "Michael Chen", age: 45, gender: "Male", phone: "9876543211", email: "michael@email.com", address: "456 Delhi Ave", bloodGroup: "O+", registeredAt: "2024-02-20" },
  { id: "P003", name: "Emily Davis", age: 28, gender: "Female", phone: "9876543212", email: "emily@email.com", address: "789 Bangalore Rd", bloodGroup: "B-", registeredAt: "2024-03-05" },
  { id: "P004", name: "James Wilson", age: 62, gender: "Male", phone: "9876543213", email: "james@email.com", address: "321 Chennai Dr", bloodGroup: "AB+", registeredAt: "2024-03-10" },
  { id: "P005", name: "Maria Garcia", age: 51, gender: "Female", phone: "9876543214", email: "maria@email.com", address: "654 Hyderabad Ln", bloodGroup: "O-", registeredAt: "2024-03-15" },
];

export const mockAppointments: Appointment[] = [
  { id: "A001", patientId: "P001", patientName: "Sarah Johnson", doctorName: "Dr. Smith", date: "2024-03-20", time: "09:00", status: "completed", reason: "Regular checkup" },
  { id: "A002", patientId: "P002", patientName: "Michael Chen", doctorName: "Dr. Patel", date: "2024-03-20", time: "10:30", status: "completed", reason: "Blood pressure follow-up" },
  { id: "A003", patientId: "P003", patientName: "Emily Davis", doctorName: "Dr. Smith", date: "2024-03-21", time: "14:00", status: "scheduled", reason: "Skin rash consultation" },
  { id: "A004", patientId: "P004", patientName: "James Wilson", doctorName: "Dr. Lee", date: "2024-03-21", time: "11:00", status: "scheduled", reason: "Diabetes management" },
  { id: "A005", patientId: "P005", patientName: "Maria Garcia", doctorName: "Dr. Patel", date: "2024-03-22", time: "09:30", status: "scheduled", reason: "Joint pain" },
];

export const mockMedicines: Medicine[] = [
  { id: "M001", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 245, price: 120, supplier: "PharmaCo", expiryDate: "2025-06-15", type: "Tablet", quantityPerStrip: 10 },
  { id: "M002", name: "Metformin 850mg", category: "Antidiabetic", stock: 180, price: 85, supplier: "MedSupply", expiryDate: "2025-09-20", type: "Tablet", quantityPerStrip: 15 },
  { id: "M003", name: "Lisinopril 10mg", category: "Antihypertensive", stock: 320, price: 150, supplier: "PharmaCo", expiryDate: "2025-12-01", type: "Tablet", quantityPerStrip: 10 },
  { id: "M004", name: "Ibuprofen 400mg", category: "NSAID", stock: 12, price: 60, supplier: "HealthDist", expiryDate: "2025-03-30", type: "Tablet", quantityPerStrip: 10 },
  { id: "M005", name: "Omeprazole 20mg", category: "Antacid", stock: 95, price: 110, supplier: "MedSupply", expiryDate: "2025-08-10", type: "Tablet", quantityPerStrip: 15 },
  { id: "M006", name: "Cetirizine 10mg", category: "Antihistamine", stock: 5, price: 45, supplier: "HealthDist", expiryDate: "2024-12-15", type: "Tablet", quantityPerStrip: 10 },
];

export const mockPrescriptions: Prescription[] = [
  { id: "RX001", patientId: "P001", patientName: "Sarah Johnson", doctorName: "Dr. Smith", date: "2024-03-20", medicines: [{ medicineId: "M001", name: "Amoxicillin 500mg", dosage: "1 cap 3x daily", quantity: 21 }], status: "dispensed" },
  { id: "RX002", patientId: "P002", patientName: "Michael Chen", doctorName: "Dr. Patel", date: "2024-03-20", medicines: [{ medicineId: "M003", name: "Lisinopril 10mg", dosage: "1 tab daily", quantity: 30 }], status: "dispensed" },
  { id: "RX003", patientId: "P004", patientName: "James Wilson", doctorName: "Dr. Lee", date: "2024-03-18", medicines: [{ medicineId: "M002", name: "Metformin 850mg", dosage: "1 tab 2x daily", quantity: 60 }, { medicineId: "M005", name: "Omeprazole 20mg", dosage: "1 cap before breakfast", quantity: 30 }], status: "pending" },
];

export const mockInvoices: Invoice[] = [
  { id: "INV001", patientId: "P001", patientName: "Sarah Johnson", date: "2024-03-20", items: [{ description: "Consultation Fee", amount: 500, type: "Consultation" }, { description: "Amoxicillin 500mg x21", amount: 2520, type: "Medicine" }], subtotal: 3020, discountApplied: false, discountPercentage: 0, discountAmount: 0, total: 3020, status: "paid" },
  { id: "INV002", patientId: "P002", patientName: "Michael Chen", date: "2024-03-20", items: [{ description: "Consultation Fee", amount: 500, type: "Consultation" }, { description: "Lisinopril 10mg x30", amount: 4500, type: "Medicine" }], subtotal: 5000, discountApplied: true, discountPercentage: 10, discountAmount: 500, total: 4500, status: "paid" },
];

export const mockDashboardStats: DashboardStats = {
  totalPatients: 1247,
  todayAppointments: 18,
  pendingPrescriptions: 7,
  lowStockItems: 3,
  monthlyRevenue: 452800,
  revenueChange: 12.5,
};

