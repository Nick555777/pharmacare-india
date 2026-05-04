import { BookOpen, Download, Database, Server, Layout, Shield, TestTube, Rocket, Lightbulb, ArrowRight, User, Target, Monitor, Cpu, Code2, FileText, Layers, Workflow, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSystemGuidePDF } from "@/utils/generatePDF";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="print-break">
    <h2 className="text-xl font-bold mt-10 mb-4 pb-2 border-b border-border">{title}</h2>
    {children}
  </section>
);

const Code = ({ children, lang }: { children: string; lang?: string }) => (
  <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto my-3 border">
    {lang && <div className="text-xs text-muted-foreground mb-2 uppercase">{lang}</div>}
    <code>{children}</code>
  </pre>
);

const toc = [
  "Project Title & Author",
  "Abstract",
  "Introduction",
  "Objectives",
  "System Requirements",
  "Technology Stack",
  "System Architecture",
  "Database Schema",
  "Module Description",
  "System Workflow",
  "Installation Guide",
  "Backend API Guide",
  "Frontend Guide",
  "Authentication",
  "User Roles & Permissions",
  "Testing & Debugging",
  "Source Code",
  "Future Enhancements",
  "Conclusion",
  "Bibliography",
];

const SystemGuide = () => {
  const handleDownload = () => generateSystemGuidePDF();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> PharmaCare System Guide
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Complete project documentation & development manual</p>
        </div>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="w-4 h-4" /> Download Full Project Manual (PDF)
        </Button>
      </div>

      {/* Table of Contents */}
      <div className="bg-card rounded-xl border p-5 no-print">
        <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {toc.map((item, i) => (
            <a key={i} href={`#${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-sm text-primary hover:underline flex items-center gap-1.5 py-1">
              <ArrowRight className="w-3 h-3" /> {i + 1}. {item}
            </a>
          ))}
        </div>
      </div>

      {/* 1. Project Title & Author */}
      <Section id="project-title---author" title="1. Project Title & Author">
        <div className="bg-accent/30 rounded-xl border p-6 text-center space-y-3">
          <h3 className="text-2xl font-bold text-foreground">PharmaCare - Pharmacy Management System</h3>
          <div className="w-20 h-0.5 bg-primary mx-auto"></div>
          <p className="text-base text-muted-foreground">Complete Project Documentation with Full Source Code</p>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">Submitted by</p>
            <p className="text-xl font-bold text-primary mt-1">NIKHIL SHARMA</p>
          </div>
          <p className="text-xs text-muted-foreground">Version 1.0 | {new Date().toLocaleDateString("en-IN")}</p>
        </div>
      </Section>

      {/* 2. Abstract */}
      <Section id="abstract" title="2. Abstract">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <p>
            <strong>PharmaCare</strong> is a comprehensive, web-based Pharmacy Management System designed and developed by <strong>Nikhil Sharma</strong>. The system provides an integrated digital platform for automating and streamlining the complete workflow of a pharmacy or healthcare clinic, replacing traditional manual record-keeping with an efficient, modern, and error-free digital solution.
          </p>
          <p>
            The application encompasses six core functional modules: <strong>Patient Records Management</strong>, <strong>Appointment Scheduling</strong>, <strong>Digital Prescription Management</strong>, <strong>Medicine Inventory Control</strong>, <strong>Billing and Invoice Generation</strong>, and <strong>Reports and Analytics</strong>. Each module supports full Create, Read, Update, and Delete (CRUD) operations with real-time data validation and persistent storage.
          </p>
          <p>
            The system is built using a modern technology stack comprising React 18 for the user interface, TypeScript for type-safe development, Tailwind CSS for responsive styling, and Shadcn/UI for accessible component design. The application implements centralized state management using React Context API with real-time Firebase Firestore database synchronization for persistent, cross-platform data availability.
          </p>
          <p>
            Key features include automated low-stock alerts for medicines below threshold levels, dynamic invoice generation with line-item calculations, patient search and filtering, appointment status tracking (scheduled, completed, cancelled), prescription dispensing workflow, and a complete PDF documentation export system.
          </p>
          <p>
            The project demonstrates proficiency in full-stack web development principles, component-based architecture, state management patterns, responsive UI/UX design, and software engineering best practices. The modular architecture ensures scalability and maintainability, making it suitable for deployment in small to medium-sized pharmacies and healthcare clinics.
          </p>
        </div>
      </Section>

      {/* 3. Introduction */}
      <Section id="introduction" title="3. Introduction">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <div>
            <h3 className="font-semibold mb-2 text-base">3.1 Background</h3>
            <p>In the contemporary healthcare landscape, efficient management of pharmacy and clinical operations is paramount for delivering quality patient care. Pharmacies handle an enormous volume of daily transactions including patient registrations, appointment scheduling, prescription processing, inventory management, and billing. Traditional manual systems involving paper records, handwritten prescriptions, and physical inventory logs are inherently prone to human errors, time-consuming, and difficult to scale.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-base">3.2 Problem Statement</h3>
            <p className="mb-2">Pharmacies and small clinics face several critical operational challenges:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Lost or illegible paper-based patient records leading to treatment delays</li>
              <li>Prescription errors caused by handwriting interpretation issues</li>
              <li>Inventory discrepancies resulting in stockouts of essential medicines or wastage of expired stock</li>
              <li>Manual billing errors and difficulty in tracking payment statuses</li>
              <li>Absence of analytical insights for informed business decision-making</li>
              <li>No centralized system to manage appointments efficiently</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-base">3.3 Proposed Solution</h3>
            <p>PharmaCare addresses all the above challenges by providing a unified, web-based application that digitizes every aspect of pharmacy operations. The system features a clean, intuitive user interface with a persistent sidebar navigation, ensuring that all modules are accessible with a single click. The application is designed with a mobile-responsive layout, enabling access from desktop computers, tablets, and smartphones.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-base">3.4 Scope of the Project</h3>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
              <li>Patient Registration and Records Management with search and CRUD operations</li>
              <li>Appointment Scheduling with patient-doctor mapping and status tracking</li>
              <li>Digital Prescription Creation with medicine line-item builder and dispensing workflow</li>
              <li>Medicine Inventory Management with stock alerts, pricing, and expiry tracking</li>
              <li>Invoice Generation with dynamic line items and automatic total calculation</li>
              <li>Reports and Analytics with interactive charts (bar charts, pie charts)</li>
              <li>PDF Documentation Export for project presentation</li>
            </ol>
          </div>
        </div>
      </Section>

      {/* 4. Objectives */}
      <Section id="objectives" title="4. Objectives">
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <div>
            <h3 className="font-semibold mb-2 text-base">4.1 Primary Objectives</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
              <li>To design and develop a fully functional web-based Pharmacy Management System that automates daily pharmacy and clinic operations, reducing manual effort and minimizing errors</li>
              <li>To create a centralized digital platform for managing patient records with complete CRUD functionality, replacing paper-based systems</li>
              <li>To implement an appointment scheduling module that improves patient flow management and reduces wait times through organized scheduling</li>
              <li>To build a digital prescription management system that eliminates medication errors and provides a clear dispensing workflow</li>
              <li>To develop a real-time inventory management system with automated low-stock alerts (threshold: 20 units) and expiry date tracking</li>
              <li>To create an automated billing system with dynamic line-item entry and automatic total calculation for accurate financial tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-base">4.2 Secondary Objectives</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
              <li>To provide interactive analytical dashboards with revenue trend charts and status overview visualizations for data-driven decision making</li>
              <li>To design a responsive, modern user interface accessible across all device sizes using Tailwind CSS and Shadcn/UI components</li>
              <li>To implement persistent cloud data storage using Firebase, ensuring cross-platform synchronization, dynamic read/write capabilities, and strict payload sanitization</li>
              <li>To demonstrate proficiency in modern web development technologies including React 18, TypeScript, and component-based architecture</li>
              <li>To create a comprehensive PDF documentation export system for project presentation, knowledge transfer, and academic submission</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 5. System Requirements */}
      <Section id="system-requirements" title="5. System Requirements">
        <div className="grid grid-cols-1 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-3 text-base flex items-center gap-2"><Cpu className="w-4 h-4 text-primary" /> 5.1 Hardware Requirements</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Component</th>
                    <th className="text-left p-3 font-medium">Minimum Requirement</th>
                    <th className="text-left p-3 font-medium">Recommended</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Processor", "Intel Core i3 / AMD Ryzen 3 (2 GHz)", "Intel Core i5 / AMD Ryzen 5 or higher"],
                    ["RAM", "4 GB DDR4", "8 GB DDR4 or higher"],
                    ["Hard Disk", "10 GB free space (HDD)", "50 GB SSD (for faster build times)"],
                    ["Display", "1366 × 768 resolution", "1920 × 1080 Full HD"],
                    ["Network", "Broadband internet (1 Mbps)", "High-speed internet (10+ Mbps)"],
                    ["Input Devices", "Standard keyboard and mouse", "Keyboard, mouse, barcode scanner"],
                    ["Printer", "Optional (any standard printer)", "Thermal receipt printer for invoices"],
                  ].map(([component, min, rec]) => (
                    <tr key={component}>
                      <td className="p-3 font-medium">{component}</td>
                      <td className="p-3 text-muted-foreground">{min}</td>
                      <td className="p-3 text-muted-foreground">{rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-base flex items-center gap-2"><Monitor className="w-4 h-4 text-primary" /> 5.2 Software Requirements</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Category</th>
                    <th className="text-left p-3 font-medium">Software</th>
                    <th className="text-left p-3 font-medium">Version</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Operating System", "Windows / macOS / Linux", "Windows 10+, macOS 12+, Ubuntu 20.04+"],
                    ["Runtime Environment", "Node.js", "v18.0 or higher"],
                    ["Package Manager", "npm / bun", "npm 9+ / bun 1.0+"],
                    ["Build Tool", "Vite", "v5.0+"],
                    ["Web Browser", "Google Chrome / Firefox / Edge", "Latest stable version"],
                    ["Code Editor", "Visual Studio Code", "Latest version"],
                    ["Version Control", "Git", "v2.30+"],
                    ["PDF Library", "jsPDF + jspdf-autotable", "v4.2+ / v5.0+"],
                  ].map(([cat, sw, ver]) => (
                    <tr key={cat}>
                      <td className="p-3 font-medium">{cat}</td>
                      <td className="p-3 text-muted-foreground">{sw}</td>
                      <td className="p-3 text-muted-foreground">{ver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. Technology Stack */}
      <Section id="technology-stack" title="6. Technology Stack">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { layer: "UI Framework", tech: "React 18 — Component-based user interface rendering" },
            { layer: "Language", tech: "TypeScript — Type-safe JavaScript with compile-time error detection" },
            { layer: "Styling", tech: "Tailwind CSS — Utility-first CSS framework for responsive design" },
            { layer: "UI Components", tech: "Shadcn/UI — Accessible, customizable component library" },
            { layer: "State Management", tech: "React Context API — Centralized global state with provider pattern" },
            { layer: "Database", tech: "Google Firebase (Firestore) — Real-time NoSQL cloud database" },
            { layer: "Routing", tech: "React Router v6 — Client-side navigation between application pages" },
            { layer: "Charts", tech: "Recharts — Interactive data visualization (bar charts, pie charts)" },
            { layer: "Icons", tech: "Lucide React — Modern, consistent SVG icon library" },
            { layer: "PDF Generation", tech: "jsPDF + jspdf-autotable — Client-side PDF document creation" },
            { layer: "Build Tool", tech: "Vite — Fast development server and production bundler" },
            { layer: "Testing", tech: "Vitest — Fast unit testing framework" },
            { layer: "Hosting", tech: "Lovable Cloud / Vercel / Netlify — Modern deployment platforms" },
          ].map((r) => (
            <div key={r.layer} className="flex gap-3 p-3 rounded-lg border bg-card">
              <Server className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{r.layer}</p>
                <p className="text-xs text-muted-foreground">{r.tech}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 7. System Architecture */}
      <Section id="system-architecture" title="7. System Architecture">
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">7.1 Application Architecture</h3>
            <p className="text-muted-foreground leading-relaxed">PharmaCare follows a Single Page Application (SPA) architecture built with React. The application uses a layered architecture pattern with clear separation of concerns:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2 mt-2">
              <li><strong>Presentation Layer:</strong> React components (pages and reusable UI components) handle all user interface rendering</li>
              <li><strong>State Management Layer:</strong> React Context (DataContext) provides centralized state connected directly to Firebase</li>
              <li><strong>Persistence Layer:</strong> Firebase Firestore provides secure, real-time NoSQL document storage across the cloud</li>
              <li><strong>Routing Layer:</strong> React Router v6 manages navigation between different application modules</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">7.2 Folder Structure</h3>
            <Code lang="text">{`pharmacare/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Shadcn/UI base components
│   │   ├── AppLayout.tsx   # Sidebar navigation layout
│   │   ├── StatCard.tsx    # Dashboard statistics card
│   │   └── StatusBadge.tsx # Color-coded status indicator
│   ├── pages/              # Route-level page components
│   │   ├── Dashboard.tsx   # Analytics overview page
│   │   ├── Patients.tsx    # Patient CRUD management
│   │   ├── Appointments.tsx# Appointment scheduling
│   │   ├── Prescriptions.tsx# Prescription management
│   │   ├── Inventory.tsx   # Medicine stock management
│   │   ├── Billing.tsx     # Invoice management
│   │   ├── Reports.tsx     # Charts and analytics
│   │   └── SystemGuide.tsx # Documentation export page
│   ├── context/            # React Context providers
│   ├── types/              # TypeScript type definitions
│   ├── data/               # Mock data & constants
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── index.css           # Design system CSS tokens
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── vite.config.ts          # Vite build configuration`}</Code>
          </div>
          <div>
            <h3 className="font-semibold mb-2">7.3 Component Hierarchy</h3>
            <div className="bg-muted rounded-lg p-4 text-xs font-mono">
              App → QueryClientProvider → TooltipProvider → DataProvider → BrowserRouter → AppLayout → Routes → [Dashboard | Patients | Appointments | Prescriptions | Inventory | Billing | Reports | SystemGuide]
            </div>
          </div>
        </div>
      </Section>

      {/* 8. Database Schema */}
      <Section id="database-schema" title="8. Database Schema">
        <p className="text-sm text-muted-foreground mb-3">Core Google Firebase (Firestore) NoSQL Collection Structures:</p>
        <Code lang="json">{`// Collection: patients
{
  "id": "string (UUID)",
  "name": "string",
  "age": "number",
  "gender": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "bloodGroup": "string"
}

// Collection: medicines (Inventory)
{
  "id": "string (UUID)",
  "name": "string",
  "category": "string",
  "stock": "number",
  "pricePerUnit": "number",
  "pricePerStrip": "number",
  "quantityPerStrip": "number",
  "supplier": "string",
  "expiryDate": "string (YYYY-MM-DD)"
}

// Collection: prescriptions
{
  "id": "string (UUID)",
  "patientId": "string",
  "patientName": "string",
  "doctorName": "string",
  "date": "string",
  "status": "string ('pending' | 'dispensed')",
  "medicines": [
    { "medicineId": "string", "name": "string", "dosage": "string", "quantity": "number" }
  ]
}

// Collection: invoices
{
  "id": "string (UUID)",
  "patientId": "string",
  "patientName": "string",
  "date": "string",
  "items": [
    { "description": "string", "amount": "number", "type": "string" }
  ],
  "subtotal": "number",
  "discountApplied": "boolean",
  "discountPercentage": "number",
  "discountAmount": "number",
  "total": "number",
  "status": "string ('pending' | 'paid' | 'overdue')",
  "prescriptionId": "string (optional)"
}`}</Code>

        <h3 className="text-sm font-semibold mt-4 mb-2">Entity Relationships</h3>
        <div className="bg-muted rounded-lg p-4 text-xs font-mono space-y-1">
          <p>Patients 1──→ N Appointments</p>
          <p>Patients 1──→ N Prescriptions</p>
          <p>Prescriptions 1──→ N Prescription_Items ←──N Medicines</p>
          <p>Patients 1──→ N Invoices</p>
          <p>Invoices 1──→ N Invoice_Items</p>
        </div>
      </Section>

      {/* 9. Module Description */}
      <Section id="module-description" title="9. Module Description">
        <div className="space-y-4 text-sm">
          {[
            { title: "9.1 Dashboard Module", icon: <BarChart3 className="w-4 h-4 text-primary" />, desc: "The Dashboard serves as the landing page and provides a comprehensive overview of the system's current state. It displays four StatCard components showing: Total Patients count, Upcoming Appointments (filtered by 'scheduled' status), Pending Prescriptions count, and Total Revenue (sum of paid invoices). Below the statistics, it renders two data panels: an Upcoming Appointments table and a Low Stock Alerts section highlighting medicines with stock below 20 units." },
            { title: "9.2 Patient Records Module", icon: <User className="w-4 h-4 text-primary" />, desc: "This module provides complete CRUD operations for patient management. Features include: a searchable patient table with columns for ID, Name, Age, Gender, Phone, Blood Group, and Registration Date; an 'Add Patient' dialog with form fields for all patient attributes; an 'Edit Patient' dialog pre-populated with existing data; and a delete confirmation dialog." },
            { title: "9.3 Appointment Scheduling Module", desc: "The Appointment module enables scheduling and tracking of patient-doctor appointments. It features: patient selection from the registered patients list, doctor selection, date and time picker inputs, reason for visit field, and status management (scheduled/completed/cancelled)." },
            { title: "9.4 Prescription Management Module", desc: "This module handles digital prescription creation with a medicine line-item builder. Users can: select a patient and doctor, add multiple medicines with dosage instructions and quantities from the inventory, and track dispensing status (pending/dispensed)." },
            { title: "9.5 Inventory Management Module", desc: "The Inventory module tracks all medicines in stock with: medicine name, category, current stock quantity, unit price, supplier information, and expiry date. Visual alerts automatically appear for medicines with stock below 20 units." },
            { title: "9.6 Billing and Invoice Module", desc: "Generates invoices dynamically with a line-item builder. Features include: patient mapping, deep payload sanitization to prevent database crashes, real-time recalculation, and a proprietary dynamic CSS Printing engine that strips UI elements to generate stunning PDF receipts directly from the browser natively." },
            { title: "9.7 Reports and Analytics Module", desc: "The Reports module provides interactive data visualizations using the Recharts library. It displays: a Bar Chart showing revenue trends across months, a Pie Chart showing the distribution of invoice and appointment statuses, and summary cards." },
          ].map((mod) => (
            <div key={mod.title} className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2">{mod.icon}{mod.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 10. System Workflow */}
      <Section id="system-workflow" title="10. System Workflow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 font-medium">Step</th>
                <th className="text-left p-2 font-medium">Action</th>
                <th className="text-left p-2 font-medium">Module</th>
                <th className="text-left p-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["1", "Patient Registration", "Patients", "New patient registered with personal and medical details"],
                ["2", "Appointment Booking", "Appointments", "Appointment scheduled with available doctor"],
                ["3", "Consultation", "Appointments", "Doctor consultation completed, status updated"],
                ["4", "Prescription Issued", "Prescriptions", "Doctor creates prescription with medicines and dosage"],
                ["5", "Medicine Dispensed", "Prescriptions", "Pharmacist dispenses medicines, status changed"],
                ["6", "Stock Updated", "Inventory", "Medicine stock levels updated after dispensing"],
                ["7", "Invoice Generated", "Billing", "Invoice created with consultation fees and medicine costs"],
                ["8", "Payment Processed", "Billing", "Patient makes payment, invoice status updated"],
                ["9", "Reports Reviewed", "Reports", "Admin reviews revenue trends and analytics"],
              ].map(([step, action, module, desc]) => (
                <tr key={step}>
                  <td className="p-2 font-bold text-primary">{step}</td>
                  <td className="p-2 font-medium">{action}</td>
                  <td className="p-2"><span className="px-2 py-0.5 rounded bg-accent text-accent-foreground text-xs">{module}</span></td>
                  <td className="p-2 text-muted-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 11. Installation Guide */}
      <Section id="installation-guide" title="11. Installation Guide">
        <Code lang="bash">{`# Clone repository
git clone https://github.com/nikhilsharma/pharmacare.git
cd pharmacare

# Install dependencies
npm install

# Start development server
npm run dev
# Application runs at http://localhost:5173

# Create production build
npm run build

# Preview production build
npm run preview`}</Code>
      </Section>

      {/* 12. Backend API Guide */}
      <Section id="backend-api-guide" title="12. Backend API Guide">
        <p className="text-sm text-muted-foreground mb-3">RESTful API endpoints following standard conventions:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 font-medium">Method</th>
                <th className="text-left p-2 font-medium">Endpoint</th>
                <th className="text-left p-2 font-medium">Description</th>
                <th className="text-left p-2 font-medium">Auth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["POST", "/api/auth/login", "User login", "Public"],
                ["GET", "/api/patients", "List all patients", "Auth"],
                ["POST", "/api/patients", "Create patient", "Receptionist+"],
                ["GET", "/api/appointments", "List appointments", "Auth"],
                ["POST", "/api/appointments", "Schedule appointment", "Receptionist+"],
                ["GET", "/api/prescriptions", "List prescriptions", "Doctor+"],
                ["POST", "/api/prescriptions", "Create prescription", "Doctor"],
                ["GET", "/api/medicines", "List inventory", "Auth"],
                ["PUT", "/api/medicines/:id", "Update stock", "Pharmacist+"],
                ["GET", "/api/invoices", "List invoices", "Auth"],
                ["POST", "/api/invoices", "Generate invoice", "Receptionist+"],
                ["GET", "/api/reports/revenue", "Revenue analytics", "Admin"],
              ].map(([method, endpoint, desc, auth]) => (
                <tr key={endpoint}>
                  <td className="p-2"><span className={`px-1.5 py-0.5 rounded text-xs font-mono font-bold ${method === "GET" ? "bg-primary/10 text-primary" : method === "POST" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{method}</span></td>
                  <td className="p-2 font-mono text-xs">{endpoint}</td>
                  <td className="p-2 text-muted-foreground">{desc}</td>
                  <td className="p-2 text-xs">{auth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 13. Frontend Guide */}
      <Section id="frontend-guide" title="13. Frontend Guide">
        <p className="text-sm text-muted-foreground mb-3">The frontend is highly responsive and synced directly with Firebase. Key component architecture:</p>
        <Code lang="tsx">{`// Example: Live syncing patient list using DataProvider DataContext
import { useData } from '@/context/DataContext';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const PatientList = () => {
  const { patients } = useData(); // Array dynamically synced via onSnapshot()

  return (
    <Table>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-bold">{patient.name}</TableCell>
            <TableCell>{patient.phone}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};`}</Code>
      </Section>

      {/* 14. Authentication */}
      <Section id="authentication" title="14. Authentication">
        <p className="text-sm text-muted-foreground mb-3">JWT-based authentication flow:</p>
        <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
          <p><strong>1.</strong> User submits credentials to <code className="font-mono text-xs bg-background px-1 rounded">POST /api/auth/login</code></p>
          <p><strong>2.</strong> Server validates, returns JWT token (expires in 24h)</p>
          <p><strong>3.</strong> Client stores token and includes in <code className="font-mono text-xs bg-background px-1 rounded">Authorization: Bearer &lt;token&gt;</code> header</p>
          <p><strong>4.</strong> Protected routes verify token via middleware</p>
        </div>
      </Section>

      {/* 15. User Roles & Permissions */}
      <Section id="user-roles---permissions" title="15. User Roles & Permissions">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 font-medium">Role</th>
                <th className="text-left p-2 font-medium">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Admin", "Full access to all modules, user management, system settings"],
                ["Doctor", "View patients, create/manage prescriptions, manage own appointments"],
                ["Pharmacist", "Manage inventory, dispense prescriptions, view medicine stock"],
                ["Receptionist", "Register patients, schedule appointments, generate invoices"],
              ].map(([role, perm]) => (
                <tr key={role}>
                  <td className="p-2 font-medium">{role}</td>
                  <td className="p-2 text-muted-foreground">{perm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 16. Testing & Debugging */}
      <Section id="testing---debugging" title="16. Testing & Debugging">
        <div className="space-y-3 text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2 font-medium">Test Case</th>
                  <th className="text-left p-2 font-medium">Module</th>
                  <th className="text-left p-2 font-medium">Expected Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Add new patient with valid data", "Patients", "Patient added, success toast shown"],
                  ["Search patient by name", "Patients", "Table filters to matching results"],
                  ["Schedule appointment", "Appointments", "Appointment appears with 'scheduled' status"],
                  ["Create prescription with medicines", "Prescriptions", "Prescription created with medicine items"],
                  ["Add medicine with low stock", "Inventory", "Warning icon displayed next to stock count"],
                  ["Generate invoice with line items", "Billing", "Invoice created with auto-calculated total"],
                  ["Delete record with confirmation", "All modules", "Confirmation dialog shown, record removed"],
                  ["View revenue chart", "Reports", "Bar chart renders with monthly data"],
                ].map(([tc, mod, exp]) => (
                  <tr key={tc}>
                    <td className="p-2 font-medium">{tc}</td>
                    <td className="p-2"><span className="px-2 py-0.5 rounded bg-accent text-accent-foreground text-xs">{mod}</span></td>
                    <td className="p-2 text-muted-foreground">{exp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* 17. Source Code */}
      <Section id="source-code" title="17. Source Code">
        <p className="text-sm text-muted-foreground mb-4">
          The complete source code for all core files is included in the downloadable PDF. Key files include:
        </p>
        <div className="space-y-2">
          {[
            { file: "src/types/pharmacy.ts", desc: "TypeScript interfaces for Patient, Appointment, Prescription, Medicine, Invoice" },
            { file: "src/context/DataContext.tsx", desc: "Centralized state management with CRUD operations and localStorage persistence" },
            { file: "src/App.tsx", desc: "Root component with routing, providers, and layout configuration" },
            { file: "src/components/AppLayout.tsx", desc: "Sidebar navigation layout with active route highlighting" },
            { file: "src/components/StatCard.tsx", desc: "Dashboard statistics card with configurable color variants" },
            { file: "src/components/StatusBadge.tsx", desc: "Color-coded status badge for entity statuses" },
            { file: "src/pages/Dashboard.tsx", desc: "Analytics overview with stats, appointments table, low-stock alerts" },
            { file: "src/pages/Patients.tsx", desc: "Full CRUD patient management with search and dialogs" },
            { file: "src/pages/Appointments.tsx", desc: "Appointment scheduling with status tracking" },
            { file: "src/pages/Prescriptions.tsx", desc: "Prescription creation with medicine line-item builder" },
            { file: "src/pages/Inventory.tsx", desc: "Medicine inventory management with stock alerts" },
            { file: "src/pages/Billing.tsx", desc: "Invoice generation with dynamic line items" },
            { file: "src/pages/Reports.tsx", desc: "Interactive charts and analytics dashboards" },
          ].map((f) => (
            <div key={f.file} className="flex gap-3 p-3 rounded-lg border bg-card">
              <Code2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-mono text-xs font-medium">{f.file}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-accent/30 rounded-lg border p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">Download the PDF to view all complete source code with line numbers</p>
          <Button onClick={handleDownload} variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Download Full Project Manual
          </Button>
        </div>
      </Section>

      {/* 18. Future Enhancements */}
      <Section id="future-enhancements" title="18. Future Enhancements">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { feat: "User Authentication", desc: "Login/logout with role-based access control", priority: "High" },
            { feat: "Advanced Predictive Analytics", desc: "Machine learning integration to predict medicine stockouts based on patient traffic", priority: "High" },
            { feat: "SMS/Email Reminders", desc: "Automated appointment reminders and refill notifications", priority: "Medium" },
            { feat: "Drug Interaction Alerts", desc: "Automatic warnings for known drug interactions", priority: "Medium" },
            { feat: "Barcode Scanning", desc: "Scan medicine barcodes for quick inventory lookup", priority: "Medium" },
            { feat: "Multi-Branch Support", desc: "Manage multiple pharmacy locations from one dashboard", priority: "Low" },
            { feat: "Mobile Application", desc: "React Native app for patients to view records", priority: "Low" },
            { feat: "AI Prescription Suggestions", desc: "ML model suggesting medicines based on diagnosis", priority: "Low" },
          ].map((f) => (
            <div key={f.feat} className="flex gap-3 p-3 rounded-lg border bg-card">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium flex items-center gap-2">{f.feat} <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${f.priority === "High" ? "bg-destructive/10 text-destructive" : f.priority === "Medium" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{f.priority}</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 19. Conclusion */}
      <Section id="conclusion" title="19. Conclusion">
        <div className="space-y-3 text-sm leading-relaxed text-foreground">
          <p>The PharmaCare Management System successfully demonstrates the design and development of a comprehensive, web-based application that addresses the real-world operational challenges faced by pharmacies and healthcare clinics.</p>
          <p>The system provides an integrated digital solution covering six core functional modules with full CRUD operations, data validation, persistent storage, and user-friendly interfaces.</p>
          <p>The modular architecture ensures easy extension with features such as user authentication, cloud database integration, and mobile application support. The clean separation of concerns makes the codebase maintainable and scalable.</p>
        </div>
        <div className="mt-6 bg-primary/5 rounded-xl border border-primary/20 p-6 text-center">
          <p className="text-sm text-muted-foreground">Developed by</p>
          <p className="text-xl font-bold text-primary mt-1">NIKHIL SHARMA</p>
          <p className="text-xs text-muted-foreground mt-2">PharmaCare v1.0 | {new Date().getFullYear()}</p>
        </div>
      </Section>

      {/* 20. Bibliography */}
      <Section id="bibliography" title="20. Bibliography">
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-muted-foreground">
          <li>React Documentation — <span className="text-primary">https://react.dev</span></li>
          <li>TypeScript Documentation — <span className="text-primary">https://www.typescriptlang.org/docs</span></li>
          <li>Tailwind CSS Documentation — <span className="text-primary">https://tailwindcss.com/docs</span></li>
          <li>Shadcn/UI Documentation — <span className="text-primary">https://ui.shadcn.com</span></li>
          <li>React Router Documentation — <span className="text-primary">https://reactrouter.com</span></li>
          <li>TanStack React Query — <span className="text-primary">https://tanstack.com/query</span></li>
          <li>Recharts Documentation — <span className="text-primary">https://recharts.org</span></li>
          <li>Lucide Icons — <span className="text-primary">https://lucide.dev</span></li>
          <li>jsPDF Documentation — <span className="text-primary">https://github.com/parallax/jsPDF</span></li>
          <li>Vite Documentation — <span className="text-primary">https://vitejs.dev</span></li>
          <li>Vitest Documentation — <span className="text-primary">https://vitest.dev</span></li>
          <li>MDN Web Docs — <span className="text-primary">https://developer.mozilla.org</span></li>
          <li>Firebase Documentation — <span className="text-primary">https://firebase.google.com/docs</span></li>
        </ol>
      </Section>
    </div>
  );
};

export default SystemGuide;
