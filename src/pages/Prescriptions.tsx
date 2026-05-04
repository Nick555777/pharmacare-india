import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pill, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Prescription, PrescriptionMedicine } from "@/types/pharmacy";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "@/hooks/use-toast";

const Prescriptions = () => {
  const { prescriptions, addPrescription, updatePrescription, deletePrescription, patients, doctors, medicines: medList } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Prescription | null>(null);
  const [form, setForm] = useState({ patientId: "", patientName: "", doctorName: "", date: "", status: "pending" as "pending" | "dispensed", medicines: [] as PrescriptionMedicine[] });
  const [medForm, setMedForm] = useState({ medicineId: "", name: "", dosage: "", quantity: 1 });

  const openNew = () => { setEditing(null); setForm({ patientId: "", patientName: "", doctorName: "", date: new Date().toISOString().split("T")[0], status: "pending", medicines: [] }); setDialogOpen(true); };
  const openEdit = (rx: Prescription) => { setEditing(rx); setForm({ patientId: rx.patientId, patientName: rx.patientName, doctorName: rx.doctorName, date: rx.date, status: rx.status, medicines: [...rx.medicines] }); setDialogOpen(true); };

  const addMed = () => {
    if (!medForm.name) return;
    setForm({ ...form, medicines: [...form.medicines, { ...medForm }] });
    setMedForm({ medicineId: "", name: "", dosage: "", quantity: 1 });
  };
  const removeMed = (i: number) => setForm({ ...form, medicines: form.medicines.filter((_, idx) => idx !== i) });

  const handleSave = async () => {
    if (!form.patientName || !form.doctorName || form.medicines.length === 0) { 
      toast({ title: "Fill all fields and add at least 1 medicine", variant: "destructive" }); 
      return; 
    }
    
    try {
      if (editing) { 
        await updatePrescription(editing.id, form); 
        toast({ title: "Prescription updated" }); 
      } else { 
        await addPrescription(form); 
        toast({ title: "Prescription created" }); 
      }
      setDialogOpen(false);
    } catch (error) {
      toast({ title: "Error saving prescription", variant: "destructive" });
    }
  };

  const handleDelete = () => { if (deleteId) { deletePrescription(deleteId); toast({ title: "Prescription deleted" }); } setDeleteId(null); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Pill className="w-6 h-6 text-primary" /> Prescriptions</h1>
          <p className="text-muted-foreground text-sm mt-1">{prescriptions.length} prescriptions</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> New Prescription</Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rx ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Medicines</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((rx) => (
              <TableRow key={rx.id}>
                <TableCell className="font-mono text-xs">{rx.id}</TableCell>
                <TableCell className="font-medium">{rx.patientName}</TableCell>
                <TableCell>{rx.doctorName}</TableCell>
                <TableCell>{rx.date}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {rx.medicines.map((m, i) => (
                      <div key={i} className="text-xs"><span className="font-medium">{m.name}</span> <span className="text-muted-foreground">— {m.dosage} (×{m.quantity})</span></div>
                    ))}
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={rx.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(rx)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(rx.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {prescriptions.length === 0 && (<TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No prescriptions</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Prescription" : "New Prescription"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient *</Label>
              <Select value={form.patientName} onValueChange={(v) => { const p = patients.find((x) => x.name === v); setForm({ ...form, patientName: v, patientId: p?.id || "" }); }}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>{patients.map((p) => (<SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Doctor *</Label>
              <Select value={form.doctorName} onValueChange={(v) => setForm({ ...form, doctorName: v })}>
                <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>{doctors.map((d) => (<SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            {editing && (
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: "pending" | "dispensed") => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="dispensed">Dispensed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="border rounded-lg p-3 space-y-3">
              <Label className="text-sm font-semibold">Medicines</Label>
              {form.medicines.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-muted rounded p-2">
                  <span className="flex-1">{m.name} — {m.dosage} (×{m.quantity})</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeMed(i)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              ))}
              <div className="grid grid-cols-4 gap-2">
                <Select value={medForm.name} onValueChange={(v) => { const med = medList.find((x) => x.name === v); setMedForm({ ...medForm, name: v, medicineId: med?.id || "" }); }}>
                  <SelectTrigger className="col-span-2"><SelectValue placeholder="Medicine" /></SelectTrigger>
                  <SelectContent>{medList.map((m) => (<SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>))}</SelectContent>
                </Select>
                <Input placeholder="Dosage" value={medForm.dosage} onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })} />
                <div className="flex gap-1">
                  <Input type="number" placeholder="Qty" value={medForm.quantity} onChange={(e) => setMedForm({ ...medForm, quantity: parseInt(e.target.value) || 1 })} className="w-16" />
                  <Button size="sm" onClick={addMed} disabled={!medForm.name}>+</Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Prescription?</AlertDialogTitle><AlertDialogDescription>This will permanently remove this prescription.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Prescriptions;
