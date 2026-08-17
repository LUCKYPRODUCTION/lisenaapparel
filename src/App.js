"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var sonner_1 = require("sonner");
var useAuth_1 = require("./hooks/useAuth");
var MainLayout_1 = require("./layouts/MainLayout");
var AuthLayout_1 = require("./layouts/AuthLayout");
var Login_1 = require("./pages/Login");
var Dashboard_1 = require("./pages/Dashboard");
var Production_1 = require("./pages/Production");
var NewInvoice_1 = require("./pages/Invoices/NewInvoice");
var InvoiceDetail_1 = require("./pages/Invoices/InvoiceDetail");
var Customers_1 = require("./pages/Customers");
var Suppliers_1 = require("./pages/Suppliers");
var Inventory_1 = require("./pages/Inventory");
var Finance_1 = require("./pages/Finance");
var ReceivablesPayables_1 = require("./pages/ReceivablesPayables");
var Purchases_1 = require("./pages/Purchases");
var Statistics_1 = require("./pages/Statistics");
var Settings_1 = require("./pages/Settings");
var Backup_1 = require("./pages/Backup");
function App() {
    return (<useAuth_1.AuthProvider>
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/login" element={<AuthLayout_1.AuthLayout />}>
            <react_router_dom_1.Route index element={<Login_1.default />}/>
          </react_router_dom_1.Route>
          <react_router_dom_1.Route path="/" element={<MainLayout_1.MainLayout />}>
            <react_router_dom_1.Route index element={<react_router_dom_1.Navigate to="/dashboard" replace/>}/>
            <react_router_dom_1.Route path="dashboard" element={<Dashboard_1.default />}/>
            <react_router_dom_1.Route path="production" element={<Production_1.default />}/>
            <react_router_dom_1.Route path="invoices/new" element={<NewInvoice_1.default />}/>
            <react_router_dom_1.Route path="invoices/:id" element={<InvoiceDetail_1.default />}/>
            <react_router_dom_1.Route path="customers" element={<Customers_1.default />}/>
            <react_router_dom_1.Route path="suppliers" element={<Suppliers_1.default />}/>
            <react_router_dom_1.Route path="inventory" element={<Inventory_1.default />}/>
            <react_router_dom_1.Route path="finance" element={<Finance_1.default />}/>
            <react_router_dom_1.Route path="receivables-payables" element={<ReceivablesPayables_1.default />}/>
            <react_router_dom_1.Route path="purchases" element={<Purchases_1.default />}/>
            <react_router_dom_1.Route path="statistics" element={<Statistics_1.default />}/>
            <react_router_dom_1.Route path="settings" element={<Settings_1.default />}/>
            <react_router_dom_1.Route path="settings/backup" element={<Backup_1.default />}/>
            <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/dashboard" replace/>}/>
          </react_router_dom_1.Route>
        </react_router_dom_1.Routes>
        <sonner_1.Toaster position="top-right" richColors/>
      </react_router_dom_1.BrowserRouter>
    </useAuth_1.AuthProvider>);
}
exports.default = App;
