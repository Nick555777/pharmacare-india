import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Receipt, Plus, Pencil, Trash2, Tag, CreditCard, User, Calendar, Percent, Printer, Download, Activity, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Invoice, InvoiceItem } from "@/types/pharmacy";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "@/hooks/use-toast";

const Billing = () => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, patients, medicines } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [editing, setEditing] = useState<Invoice | null>(null);
  
  const [form, setForm] = useState<Omit<Invoice, "id">>({ 
    patientId: "", 
    patientName: "", 
    date: new Date().toISOString().split("T")[0], 
    items: [], 
    subtotal: 0,
    discountApplied: false,
    discountPercentage: 0,
    discountAmount: 0,
    total: 0, 
    status: "pending" as "paid" | "pending" | "overdue" 
  });

  const [itemForm, setItemForm] = useState<InvoiceItem>({ description: "", amount: 0, type: "Medicine", quantity: 1, pricePerUnit: 0 });
  const [medicineSearch, setMedicineSearch] = useState("");
  const [showMedList, setShowMedList] = useState(false);

  const filteredMedicines = medicines
    .filter(m => 
      m.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
      m.category.toLowerCase().includes(medicineSearch.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (itemForm.type === "Medicine" && itemForm.pricePerUnit && itemForm.quantity) {
      setItemForm(prev => ({ ...prev, amount: itemForm.pricePerUnit! * itemForm.quantity! }));
    }
  }, [itemForm.quantity, itemForm.pricePerUnit]);

  useEffect(() => {
    const subtotal = form.items.reduce((s, i) => s + i.amount, 0);
    const discountAmount = form.discountApplied ? subtotal * 0.1 : 0;
    const total = subtotal - discountAmount;
    setForm(prev => ({ ...prev, subtotal, discountAmount, total, discountPercentage: form.discountApplied ? 10 : 0 }));
  }, [form.items, form.discountApplied]);

  const openNew = () => { 
    setEditing(null); 
    setForm({ 
      patientId: "", 
      patientName: "", 
      date: new Date().toISOString().split("T")[0], 
      items: [], 
      subtotal: 0,
      discountApplied: false,
      discountPercentage: 0,
      discountAmount: 0,
      total: 0, 
      status: "pending" 
    }); 
    setDialogOpen(true); 
  };

  const openEdit = (inv: Invoice) => { 
    setEditing(inv); 
    setForm({ 
      patientId: inv.patientId || "", 
      patientName: inv.patientName || "", 
      date: inv.date || new Date().toISOString().split("T")[0], 
      items: inv.items ? [...inv.items] : [], 
      subtotal: inv.subtotal || inv.total || 0,
      discountApplied: inv.discountApplied || false,
      discountPercentage: inv.discountPercentage || 0,
      discountAmount: inv.discountAmount || 0,
      total: inv.total || 0, 
      status: inv.status || "pending" 
    }); 
    setDialogOpen(true); 
  };

  const handlePrint = (inv: Invoice) => {
    setActiveInvoice(inv);
    setPrintOpen(true);
    // Standard print handled by CSS @media print
  };

  const addItem = () => {
    if (!itemForm.description || !itemForm.amount) return;
    setForm({ ...form, items: [...form.items, { ...itemForm }] });
    setItemForm({ description: "", amount: 0, type: "Medicine", quantity: 1, pricePerUnit: 0 });
    setMedicineSearch("");
  };

  const removeItem = (i: number) => {
    setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  };

  const handleSave = async () => {
    try {
      if (!form.patientName || form.items.length === 0) { 
        toast({ title: "Fill all fields and add at least 1 item", variant: "destructive" }); 
        return; 
      }
      
      // Sanitize form data to prevent Firebase "undefined" field crashes
      const cleanForm = JSON.parse(JSON.stringify(form));
      
      if (editing) { 
        await updateInvoice(editing.id, cleanForm); 
        toast({ title: "Invoice updated successfully" }); 
      } else { 
        await addInvoice(cleanForm); 
        toast({ title: "Invoice created successfully" }); 
      }
      setDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast({ title: "Failed to save invoice", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => { 
    if (deleteId) { 
      await deleteInvoice(deleteId); 
      toast({ title: "Invoice deleted" }); 
    } 
    setDeleteId(null); 
  };

  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Receipt className="w-6 h-6 text-primary" /> Billing & Invoices</h1>
          <p className="text-muted-foreground text-sm mt-1">
            <span className="text-emerald-600 font-semibold">₹{totalRevenue.toLocaleString()} paid</span> · <span className="text-amber-600 font-semibold">₹{totalPending.toLocaleString()} pending</span>
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 shadow-sm rounded-full px-6 transition-all hover:scale-105 active:scale-95">
          <Plus className="w-4 h-4" /> Create Invoice
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-xl shadow-black/5 no-print">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-bold">Invoice ID</TableHead>
              <TableHead className="font-bold">Patient</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Billing Items</TableHead>
              <TableHead className="font-bold text-right">Amount</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="w-24 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-mono text-[10px] text-muted-foreground uppercase">{inv.id.slice(-8)}</TableCell>
                <TableCell className="font-semibold">{inv.patientName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{inv.date}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {inv.items.slice(0, 2).map((item, i) => (
                      <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded-md ${item.type === "Consultation" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {item.description}
                      </span>
                    ))}
                    {inv.items.length > 2 && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md">+{inv.items.length - 2} more</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-primary">₹{(inv.total || 0).toLocaleString()}</span>
                    {inv.discountApplied && <span className="text-[10px] text-emerald-600 font-medium leading-none">(-10%)</span>}
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={inv.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10" onClick={() => handlePrint(inv)} title="Print Receipt"><Printer className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10" onClick={() => openEdit(inv)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(inv.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {invoices.length === 0 && (<TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-16">No invoices found</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-none shadow-2xl p-0">
          <div className="bg-primary/5 p-6 border-b">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-primary text-white rounded-lg"><Receipt className="w-5 h-5" /></div>
                {editing ? "Modify Invoice" : "Generate New Invoice"}
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> Patient *</Label>
                <Select value={form.patientName} onValueChange={(v) => { const p = patients.find((x) => x.name === v); setForm({ ...form, patientName: v, patientId: p?.id || "" }); }}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>{patients.map((p) => (<SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Date</Label>
                <Input type="date" className="rounded-xl" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold">Billing Units</Label>
                <div className="bg-muted px-3 py-1 rounded-full text-xs font-semibold text-muted-foreground">{form.items.length} items</div>
              </div>
              
              <div className="border rounded-2xl p-4 bg-muted/20 space-y-3">
                {form.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm bg-white border border-border/50 rounded-xl p-3 shadow-sm group">
                    <div className={`p-1.5 rounded-lg ${item.type === 'Consultation' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {item.type === 'Consultation' ? <User className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.description}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                    </div>
                    <span className="font-bold">
                      {item.quantity && item.quantity > 1 ? (
                        <span className="text-[10px] text-muted-foreground mr-2">
                          {item.quantity} x ₹{item.pricePerUnit?.toFixed(2)} =
                        </span>
                      ) : null}
                      ₹{item.amount.toLocaleString()}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeItem(i)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}

                <div className="space-y-4 pt-2 border-t border-dashed mt-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 md:col-span-4 space-y-1.5 relative">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Type</Label>
                      <Select value={itemForm.type} onValueChange={(v: any) => {
                        setItemForm({ ...itemForm, type: v, description: "", amount: 0, quantity: 1, pricePerUnit: 0 });
                        setMedicineSearch("");
                      }}>
                        <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Medicine">Medicine</SelectItem>
                          <SelectItem value="Consultation">Consultation</SelectItem>
                          <SelectItem value="Other">Other Fees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-12 md:col-span-8 space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                        {itemForm.type === 'Medicine' ? 'Search Medicine' : 'Description'}
                      </Label>
                      <div className="relative">
                        {itemForm.type === 'Medicine' ? (
                          <>
                            <Input 
                              placeholder="Type to search medicine..." 
                              className="rounded-xl h-11 pr-10" 
                              value={medicineSearch} 
                              onChange={(e) => {
                                setMedicineSearch(e.target.value);
                                setShowMedList(true);
                              }}
                              onFocus={() => setShowMedList(true)}
                            />
                            {showMedList && medicineSearch.length > 0 && (
                              <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95">
                                {filteredMedicines.map((m) => (
                                  <div 
                                    key={m.id} 
                                    className="p-3 hover:bg-primary/5 cursor-pointer border-b last:border-0 flex justify-between items-center transition-colors"
                                    onClick={() => {
                                      setItemForm({ 
                                        ...itemForm, 
                                        description: m.name, 
                                        pricePerUnit: m.pricePerUnit,
                                        amount: m.pricePerUnit * (itemForm.quantity || 1)
                                      });
                                      setMedicineSearch(m.name);
                                      setShowMedList(false);
                                    }}
                                  >
                                    <div>
                                      <p className="font-bold text-sm">{m.name}</p>
                                      <p className="text-[10px] text-muted-foreground">{m.category} · {m.stock} units left</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-primary text-sm">₹{m.pricePerUnit.toFixed(2)}</p>
                                      <p className="text-[10px] text-muted-foreground">per unit</p>
                                    </div>
                                  </div>
                                ))}
                                {filteredMedicines.length === 0 && (
                                  <div className="p-4 text-center text-muted-foreground text-sm">No medicines found</div>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <Input 
                            placeholder="Enter service name..." 
                            className="rounded-xl h-11" 
                            value={itemForm.description} 
                            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} 
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 md:col-span-3 space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Quantity</Label>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="1" 
                        className="rounded-xl h-11" 
                        value={itemForm.quantity || ""} 
                        onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) || 0 })} 
                      />
                    </div>
                    <div className="col-span-4 md:col-span-4 space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Price/Unit</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">₹</span>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-7 rounded-xl h-11" 
                          value={itemForm.pricePerUnit || ""} 
                          onChange={(e) => setItemForm({ ...itemForm, pricePerUnit: parseFloat(e.target.value) || 0 })} 
                        />
                      </div>
                    </div>
                    <div className="col-span-4 md:col-span-4 space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Total Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">₹</span>
                        <Input 
                          type="number" 
                          readOnly
                          className="pl-7 rounded-xl h-11 bg-muted/30 font-bold text-primary" 
                          value={itemForm.amount || ""} 
                        />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-1 flex items-end pb-0.5">
                      <Button 
                        className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all" 
                        onClick={addItem} 
                        disabled={!itemForm.description || !itemForm.amount}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 text-slate-50 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><Percent className="w-4 h-4" /></div>
                  <div>
                    <Label className="text-sm font-bold block">Apply 10% Discount</Label>
                    <p className="text-[10px] text-slate-400 italic">Special discount for loyal customers</p>
                  </div>
                </div>
                <Switch checked={form.discountApplied} onCheckedChange={(v) => setForm({ ...form, discountApplied: v })} />
              </div>

              <div className="space-y-2 text-sm pt-2">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{form.subtotal.toLocaleString()}</span>
                </div>
                {form.discountApplied && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount (10%)</span>
                    <span className="font-mono">-₹{form.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                  <span className="text-lg font-bold">Grand Total</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono italic">₹{form.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pb-6">
              <Label className="flex items-center gap-2"><CreditCard className="w-3.5 h-3.5" /> Payment Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="p-6 bg-muted/30 gap-2 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-full px-8">Discard</Button>
            <Button onClick={handleSave} className="rounded-full px-12 shadow-md shadow-primary/20">{editing ? "Update Invoice" : "Finalize & Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={printOpen} onOpenChange={setPrintOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="no-print">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle>Print Receipt</DialogTitle>
                <DialogDescription>Review and print the bill for {activeInvoice?.patientName}</DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                  <Printer className="w-4 h-4" /> Print Receipt
                </Button>
                <Button size="sm" onClick={() => window.print()} className="gap-2">
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {activeInvoice && (
            <div id="receipt-content" className="p-8 border rounded-lg bg-white text-slate-900 shadow-sm print:p-0 print:border-none print:shadow-none">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-primary/20 pb-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black tracking-tighter text-primary uppercase">{clinicName}</h1>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Clinic Management System</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-black text-slate-200 uppercase tracking-tighter mb-1">INVOICE</h2>
                  <p className="text-sm font-bold text-slate-400">#{activeInvoice.id.slice(-8).toUpperCase()}</p>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-12 mb-10">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Bill To</p>
                    <p className="text-xl font-bold">{activeInvoice.patientName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Patient ID</p>
                    <p className="text-sm font-medium">#{activeInvoice.patientId.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Invoice Date</p>
                    <p className="text-xl font-bold">{activeInvoice.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Status</p>
                    <p className={`text-sm font-bold uppercase ${activeInvoice.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {activeInvoice.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-10">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-100 text-left">
                      <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</th>
                      <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Type</th>
                      <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeInvoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-50">
                        <td className="py-4 font-bold text-slate-700">{item.description}</td>
                        <td className="py-4 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-full">{item.type}</span>
                        </td>
                        <td className="py-4 text-right font-black text-slate-900">₹{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end pt-6">
                <div className="w-1/2 space-y-3">
                  <div className="flex justify-between items-center text-slate-500 font-medium">
                    <span>Subtotal</span>
                    <span>₹{activeInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  {activeInvoice.discountApplied && (
                    <div className="flex justify-between items-center text-emerald-600 font-bold">
                      <span className="flex items-center gap-2">Discount (10%)</span>
                      <span>-₹{activeInvoice.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-primary/20">
                    <span className="text-xl font-black text-slate-900">Grand Total</span>
                    <span className="text-3xl font-black text-primary">₹{activeInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-20 pt-10 border-t border-slate-100 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Thank you for your visit</p>
                <p className="text-xs text-slate-300">{clinicName} — Advanced Clinic Management System</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Invoice Record?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently archive and remove this invoice from the system database. This action is irreversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep Record</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full px-8">Confirm Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Billing;

