import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Package, Plus, Pencil, Trash2, AlertTriangle, Pill, Droplet } from "lucide-react";
import { useState } from "react";
import { Medicine, MedicineType } from "@/types/pharmacy";
import { toast } from "@/hooks/use-toast";

const emptyMed = { name: "", category: "", stock: 0, pricePerStrip: 0, pricePerUnit: 0, supplier: "", expiryDate: "", type: "Tablet" as MedicineType, quantityPerStrip: 10 };

const Inventory = () => {
  const { medicines, addMedicine, updateMedicine, deleteMedicine } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [form, setForm] = useState(emptyMed);

  const openNew = () => { setEditing(null); setForm(emptyMed); setDialogOpen(true); };
  const openEdit = (m: Medicine) => { 
    setEditing(m); 
    setForm({ 
      name: m.name, 
      category: m.category, 
      stock: m.stock, 
      pricePerStrip: m.pricePerStrip || 0,
      pricePerUnit: m.pricePerUnit || 0,
      supplier: m.supplier, 
      expiryDate: m.expiryDate, 
      type: m.type || "Tablet",
      quantityPerStrip: m.quantityPerStrip || 10
    }); 
    setDialogOpen(true); 
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    
    const medData = { 
      ...form, 
      price: form.pricePerUnit // Keep price for UI consistency
    };
    
    if (medData.type === "Tablet" && medData.quantityPerStrip && medData.pricePerStrip) {
      medData.pricePerUnit = medData.pricePerStrip / medData.quantityPerStrip;
      medData.price = medData.pricePerUnit;
    }

    if (medData.type === "Syrup") {
      delete medData.quantityPerStrip;
      medData.pricePerUnit = medData.pricePerStrip; // For syrup, strip price = unit price (bottle price)
    }

    if (editing) { await updateMedicine(editing.id, medData); toast({ title: "Medicine updated" }); }
    else { await addMedicine(medData as Omit<Medicine, "id">); toast({ title: "Medicine added" }); }
    setDialogOpen(false);
  };

  const handleDelete = async () => { if (deleteId) { await deleteMedicine(deleteId); toast({ title: "Medicine deleted" }); } setDeleteId(null); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Package className="w-6 h-6 text-primary" /> Inventory</h1>
          <p className="text-muted-foreground text-sm mt-1">{medicines.length} medicines in stock</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Medicine</Button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Medicine</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock (Units)</TableHead>
              <TableHead>Price/Unit</TableHead>
              <TableHead>Strip Config</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((m) => (
              <TableRow key={m.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-secondary w-fit">
                    {m.type === "Tablet" ? <Pill className="w-3 h-3 text-blue-500" /> : <Droplet className="w-3 h-3 text-orange-500" />}
                    {m.type}
                  </div>
                </TableCell>
                <TableCell><span className="text-muted-foreground text-xs">{m.category}</span></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {m.stock < 20 && <AlertTriangle className="w-3.5 h-3.5 text-warning" />}
                    <span className={m.stock < 20 ? "text-warning font-semibold" : ""}>{m.stock}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-primary">₹{(m.pricePerUnit || 0).toFixed(2)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {m.type === "Tablet" ? (
                    <div className="flex flex-col">
                      <span>₹{m.pricePerStrip} / strip</span>
                      <span className="text-[10px]">{m.quantityPerStrip} tabs/strip</span>
                    </div>
                  ) : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{m.expiryDate}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => openEdit(m)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteId(m.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {medicines.length === 0 && (<TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-12">No medicines in inventory</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border-none shadow-2xl">
          <DialogHeader><DialogTitle className="text-xl font-bold">{editing ? "Edit Medicine" : "Add New Medicine"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-5 py-4">
            <div className="col-span-2 space-y-2">
              <Label>Medicine Name *</Label>
              <Input placeholder="Paracetamol 500mg" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            
            <div className="space-y-2">
              <Label>Medicine Type</Label>
              <Select value={form.type} onValueChange={(v: MedicineType) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tablet">Tablet</SelectItem>
                  <SelectItem value="Syrup">Syrup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input placeholder="Analgesic" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>{form.type === "Tablet" ? "Price per Strip (₹)" : "Price per Bottle (₹)"}</Label>
              <Input type="number" step="0.01" value={form.pricePerStrip} onChange={(e) => setForm({ ...form, pricePerStrip: parseFloat(e.target.value) || 0 })} />
            </div>

            {form.type === "Tablet" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                <Label>Quantity Multiplier (Tabs/Strip)</Label>
                <Input type="number" value={form.quantityPerStrip} onChange={(e) => setForm({ ...form, quantityPerStrip: parseInt(e.target.value) || 1 })} />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Current Stock (Total Units)</Label>
              <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
            </div>

            <div className="space-y-1 bg-primary/5 p-3 rounded-lg border border-primary/10 flex flex-col justify-center">
              <Label className="text-xs text-primary/70">Calculated Price per Unit</Label>
              <span className="text-xl font-bold text-primary">₹{form.type === "Tablet" ? (form.pricePerStrip / (form.quantityPerStrip || 1)).toFixed(2) : form.pricePerStrip.toFixed(2)}</span>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label>Supplier</Label>
              <Input placeholder="ABC Pharma" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label>Expiry Date</Label>
              <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="px-8">Cancel</Button>
            <Button onClick={handleSave} className="px-8">{editing ? "Update Medicine" : "Add to Inventory"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Medicine?</AlertDialogTitle><AlertDialogDescription>This will permanently remove this medicine from inventory. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete permanently</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Inventory;

