"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = Sidebar;
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var useMediaQuery_1 = require("../hooks/useMediaQuery");
var menuItems = [
    { icon: lucide_react_1.LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: lucide_react_1.Package, label: 'Manajemen Produksi', path: '/production' },
    { icon: lucide_react_1.FileText, label: 'Buat Nota', path: '/invoices/new' },
    { icon: lucide_react_1.Wallet, label: 'Catatan Keuangan', path: '/finance' },
    { icon: lucide_react_1.ShoppingCart, label: 'Daftar Belanja', path: '/purchases' },
    { icon: lucide_react_1.BarChart3, label: 'Statistik', path: '/statistics' },
    { icon: lucide_react_1.Users, label: 'Pelanggan', path: '/customers' },
    { icon: lucide_react_1.Truck, label: 'Supplier', path: '/suppliers' },
    { icon: lucide_react_1.HandCoins, label: 'Utang Piutang', path: '/receivables-payables' },
    { icon: lucide_react_1.Boxes, label: 'Stok', path: '/inventory' },
    { icon: lucide_react_1.Settings, label: 'Pengaturan', path: '/settings' },
];
function Sidebar() {
    var _a = (0, react_1.useState)(false), isOpen = _a[0], setIsOpen = _a[1];
    var isMobile = (0, useMediaQuery_1.useMediaQuery)('(max-width: 768px)');
    (0, react_1.useEffect)(function () {
        if (!isMobile)
            setIsOpen(true);
        else
            setIsOpen(false);
    }, [isMobile]);
    var toggleSidebar = function () { return setIsOpen(!isOpen); };
    if (isMobile) {
        return (<>
        <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-md">
          {isOpen ? <lucide_react_1.X size={24}/> : <lucide_react_1.Menu size={24}/>}
        </button>
        <div className={"fixed inset-0 z-40 bg-black/50 transition-opacity ".concat(isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')} onClick={function () { return setIsOpen(false); }}/>
        <aside className={"fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ".concat(isOpen ? 'translate-x-0' : '-translate-x-full')}>
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <span className="text-xl font-bold">LISENA</span>
            <button onClick={function () { return setIsOpen(false); }}><lucide_react_1.X size={24}/></button>
          </div>
          <nav className="p-4 space-y-2">
            {menuItems.map(function (item) { return (<react_router_dom_1.NavLink key={item.path} to={item.path} className={function (_a) {
                    var isActive = _a.isActive;
                    return "flex items-center gap-3 p-2 rounded-md transition-colors ".concat(isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700');
                }} onClick={function () { return setIsOpen(false); }}>
                <item.icon size={20}/>
                <span>{item.label}</span>
              </react_router_dom_1.NavLink>); })}
          </nav>
        </aside>
      </>);
    }
    return (<aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-bold">LISENA APPAREL</h1>
        <p className="text-xs text-gray-500">Premium Custom Apparel</p>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(function (item) { return (<react_router_dom_1.NavLink key={item.path} to={item.path} className={function (_a) {
                var isActive = _a.isActive;
                return "flex items-center gap-3 p-2 rounded-md transition-colors ".concat(isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700');
            }}>
            <item.icon size={20}/>
            <span>{item.label}</span>
          </react_router_dom_1.NavLink>); })}
      </nav>
    </aside>);
}
