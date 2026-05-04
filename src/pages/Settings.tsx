import { useData } from "@/context/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Settings as SettingsIcon, Plus, Trash2, UserCog, Building2, Save, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const { doctors, addDoctor, updateDoctor, deleteDoctor, clinicName, updateClinicName, clearAllData } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "" });
  const [tempClinicName, setTempClinicName] = useState(clinicName);

  useEffect(() => {
    setTempClinicName(clinicName);
  }, [clinicName]);

  const handleSaveClinicName = async () => {
    await updateClinicName(tempClinicName);
    toast({ title: "Branding updated", description: `System name changed to ${tempClinicName}` });
  };

  const openAdd = () => {
    setEditingDoctor(null);
    setNewDoctor({ name: "", specialty: "" });
    setDialogOpen(true);
  };

  const openEdit = (doc: any) => {
    setEditingDoctor(doc);
    setNewDoctor({ name: doc.name, specialty: doc.specialty });
    setDialogOpen(true);
  };

  const handleSaveDoctor = async () => {
    if (!newDoctor.name.trim()) return;
    if (editingDoctor) {
      await updateDoctor(editingDoctor.id, newDoctor);
      toast({ title: "Doctor updated" });
    } else {
      await addDoctor(newDoctor);
      toast({ title: "Doctor added" });
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-primary" /> System Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage system configurations and personnel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clinic Branding */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-xl border p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Clinic Branding</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>System Display Name</Label>
                <Input value={tempClinicName} onChange={(e) => setTempClinicName(e.target.value)} />
              </div>
              <Button onClick={handleSaveClinicName} className="w-full gap-2">
                <Save className="w-4 h-4" /> Save Name
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl border p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Security Notice</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Current system is locked to user <strong>SRI</strong> and primary doctor <strong>Dr. Pradeep Vind</strong>. 
              Adding more doctors will populate the system-wide selection lists.
            </p>
          </div>
        </div>

        {/* Doctor Management */}
        <div className="lg:col-span-2 bg-card rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Doctor Management</h2>
            </div>
            <Button onClick={openAdd} variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Add Doctor
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Doctor Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead className="w-24 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{doc.specialty}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary hover:bg-primary/10" onClick={() => openEdit(doc)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteDoctor(doc.id)}
                          disabled={doctors.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="lg:col-span-3 bg-destructive/5 rounded-xl border border-destructive/20 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">Irreversible system actions</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-destructive/10">
            <div>
              <p className="font-bold text-slate-900">Clear All System Data</p>
              <p className="text-xs text-muted-foreground">This will delete all patients, prescriptions, invoices, and inventory records.</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={async () => {
                if (window.confirm("Are you absolutely sure? This will delete EVERYTHING and cannot be undone.")) {
                  await clearAllData();
                  toast({ title: "System Cleared", description: "All data has been successfully deleted." });
                }
              }}
              className="px-8 shadow-lg shadow-destructive/20"
            >
              Reset Data
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDoctor ? "Edit Doctor Info" : "Add New Doctor"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Doctor Name *</Label>
              <Input 
                placeholder="Dr. Name" 
                value={newDoctor.name} 
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Specialty</Label>
              <Input 
                placeholder="Pediatrics, Orthopedics, etc." 
                value={newDoctor.specialty} 
                onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDoctor}>{editingDoctor ? "Save Changes" : "Add Doctor"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
