import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Doctor, Patient, Prescription, Medicine, Invoice, InvoiceItem } from "@/types/pharmacy";
import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  getDocs,
  setDoc,
  getDoc
} from "firebase/firestore";
import { mockPatients, mockPrescriptions, mockMedicines, mockInvoices } from "@/data/mockData";

interface DataContextType {
  clinicName: string;
  updateClinicName: (name: string) => Promise<void>;
  patients: Patient[];
  addPatient: (p: Omit<Patient, "id">) => Promise<void>;
updatePatient: (id: string, p: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;



  prescriptions: Prescription[];
  addPrescription: (p: Omit<Prescription, "id">) => Promise<void>;
  updatePrescription: (id: string, p: Partial<Prescription>) => Promise<void>;
  deletePrescription: (id: string) => Promise<void>;

  medicines: Medicine[];
  addMedicine: (m: Omit<Medicine, "id">) => Promise<void>;
  updateMedicine: (id: string, m: Partial<Medicine>) => Promise<void>;
  deleteMedicine: (id: string) => Promise<void>;

  invoices: Invoice[];
  addInvoice: (i: Omit<Invoice, "id">) => Promise<void>;
  updateInvoice: (id: string, i: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  doctors: Doctor[];
  addDoctor: (d: Omit<Doctor, "id">) => Promise<void>;
  updateDoctor: (id: string, d: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;

  loading: boolean;
  clearAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to sync a collection
  const syncCollection = (collName: string, setter: (data: any[]) => void) => {
    return onSnapshot(query(collection(db, collName)), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setter(data);
    });
  };

  useEffect(() => {
    let syncedCount = 0;
    const totalCollections = 5;
    
    // Helper to track first sync for speed
    const onFirstSync = () => {
      syncedCount++;
      if (syncedCount >= totalCollections) {
        setLoading(false);
      }
    };

    const unsubPatients = onSnapshot(query(collection(db, "patients")), (snapshot) => {
      setPatients(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Patient)));
      onFirstSync();
    });



    const unsubPrescriptions = onSnapshot(query(collection(db, "prescriptions")), (snapshot) => {
      setPrescriptions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Prescription)));
      onFirstSync();
    });

    const unsubMedicines = onSnapshot(query(collection(db, "medicines")), (snapshot) => {
      setMedicines(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Medicine)));
      onFirstSync();
    });

    const unsubInvoices = onSnapshot(query(collection(db, "invoices")), (snapshot) => {
      setInvoices(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Invoice)));
      onFirstSync();
    });

    const unsubDoctors = onSnapshot(query(collection(db, "doctors")), (snapshot) => {
      setDoctors(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Doctor)));
      onFirstSync();
    });

    return () => {
      unsubPatients();
      unsubPrescriptions();
      unsubMedicines();
      unsubInvoices();
      unsubDoctors();
    };
  }, []);

  // Initialize data ONLY if absolutely empty (runs in background)
  useEffect(() => {
    // Mock data initialization disabled by request to "clear previous datas"
    /*
    const initialize = async () => {
      if (!loading && patients.length === 0 && medicines.length === 0) {
        mockPatients.forEach(p => addDoc(collection(db, "patients"), p));
        mockAppointments.forEach(a => addDoc(collection(db, "appointments"), { ...a, doctorName: "Dr. Pradeep Vind" }));
        mockPrescriptions.forEach(p => addDoc(collection(db, "prescriptions"), { ...p, doctorName: "Dr. Pradeep Vind" }));
        mockMedicines.forEach(m => addDoc(collection(db, "medicines"), { ...m, pricePerUnit: m.price, pricePerStrip: m.price * 10, quantityPerStrip: 10 }));
        mockInvoices.forEach(i => addDoc(collection(db, "invoices"), { 
          ...i, 
          subtotal: i.total, 
          discountApplied: false, 
          discountPercentage: 0, 
          discountAmount: 0 
        }));
        addDoc(collection(db, "doctors"), { name: "Dr. Pradeep Vind", specialty: "General Physician" });
      }
    };
    if (!loading) initialize();
    */
  }, [loading]);

  const [clinicName, setClinicName] = useState("PharmaCare India");

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, "settings", "clinic_info"), (doc) => {
      if (doc.exists()) {
        setClinicName(doc.data().name);
      }
    });
    return () => unsubSettings();
  }, []);

  const updateClinicName = async (name: string) => {
    await setDoc(doc(db, "settings", "clinic_info"), { name });
  };

    const syncPrescriptionWithBilling = async (prescriptionId: string, prescriptionData: Prescription) => {
          if (prescriptionData.status !== 'dispensed') return;

          const existingInvoice = invoices.find(inv => inv.prescriptionId === prescriptionId);

          const invoiceItems: InvoiceItem[] = prescriptionData.medicines.map(item => {
                  const med = medicines.find(m => m.id === item.medicineId);
                  return {
                            description: `${med?.name || 'Medicine'} x${item.quantity}`,
                            amount: (med?.pricePerUnit || 0) * item.quantity,
                            type: "Medicine"
                  };
          });

          const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
          const patient = patients.find(p => p.id === prescriptionData.patientId);

          const invoiceData: Omit<Invoice, 'id'> = {
                  patientId: prescriptionData.patientId,
                  patientName: patient?.name || 'Unknown',
                  date: new Date().toISOString(),
                  items: invoiceItems,
                  subtotal: subtotal,
                  discountApplied: false,
                  discountPercentage: 0,
                  discountAmount: 0,
                  total: subtotal,
                  status: 'pending',
                  prescriptionId: prescriptionId
          };

          if (existingInvoice) {
                  await updateDoc(doc(db, "invoices", existingInvoice.id), invoiceData);
          } else {
                  await addDoc(collection(db, "invoices"), invoiceData);

                  // Stock reduction
                  for (const item of prescriptionData.medicines) {
                            const med = medicines.find(m => m.id === item.medicineId);
                            if (med) {
                                      await updateDoc(doc(db, "medicines", item.medicineId), {
                                                      stock: Math.max(0, med.stock - item.quantity)
                                      });
                            }
                  }
          }
    };

  
  const value: DataContextType = {
    clinicName,
    updateClinicName,
    patients,
    addPatient: async (p) => { await addDoc(collection(db, "patients"), p); },
    updatePatient: async (id, p) => { await updateDoc(doc(db, "patients", id), p); },
    deletePatient: async (id) => { await deleteDoc(doc(db, "patients", id)); },



    prescriptions,
        addPrescription: async (p) => {
                const docRef = await addDoc(collection(db, "prescriptions"), p);
                await syncPrescriptionWithBilling(docRef.id, p as Prescription);
        },
    
    updatePrescription: async (id, p) => { 
      // Get current version from state
      const currentRx = prescriptions.find(rx => rx.id === id);
      if (!currentRx) return;

      const updatedRx = { ...currentRx, ...p };
      await updateDoc(doc(db, "prescriptions", id), p);

            // Automated Billing & Stock Reduction Logic
            if (updatedRx.status === "dispensed") {
                    await syncPrescriptionWithBilling(id, updatedRx);
          }    
    },
    deletePrescription: async (id) => { await deleteDoc(doc(db, "prescriptions", id)); },

    medicines,
    addMedicine: async (m) => { await addDoc(collection(db, "medicines"), m); },
    updateMedicine: async (id, m) => { await updateDoc(doc(db, "medicines", id), m); },
    deleteMedicine: async (id) => { await deleteDoc(doc(db, "medicines", id)); },

    invoices,
    addInvoice: async (i) => { await addDoc(collection(db, "invoices"), i); },
    updateInvoice: async (id, i) => { await updateDoc(doc(db, "invoices", id), i); },
    deleteInvoice: async (id) => { await deleteDoc(doc(db, "invoices", id)); },

    doctors,
    addDoctor: async (d) => { await addDoc(collection(db, "doctors"), d); },
    updateDoctor: async (id, d) => { await updateDoc(doc(db, "doctors", id), d); },
    deleteDoctor: async (id) => { await deleteDoc(doc(db, "doctors", id)); },

    loading,
    clearAllData: async () => {
      const collections = ["patients", "prescriptions", "medicines", "invoices", "doctors"];
      for (const coll of collections) {
        const snap = await getDocs(collection(db, coll));
        for (const d of snap.docs) {
          await deleteDoc(doc(db, coll, d.id));
        }
      }
      // Re-add default doctor
      await addDoc(collection(db, "doctors"), { name: "Dr. Pradeep Vind", specialty: "General Physician" });
    }
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

