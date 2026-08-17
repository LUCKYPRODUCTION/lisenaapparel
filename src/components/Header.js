"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = Header;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("../lib/supabase");
var useAuth_1 = require("../hooks/useAuth");
var input_1 = require("../components/ui/input");
var button_1 = require("../components/ui/button");
var dropdown_menu_1 = require("../components/ui/dropdown-menu");
function Header() {
    var _this = this;
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, profile = _a.profile;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase_1.supabase.auth.signOut()];
                case 1:
                    _a.sent();
                    navigate('/login');
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSearch = function (e) {
        e.preventDefault();
        if (!searchQuery.trim())
            return;
        // Redirect to invoice detail if query matches invoice pattern
        if (searchQuery.match(/^LISA-\d{4}-\d{4}$/)) {
            navigate("/invoices/".concat(searchQuery));
        }
        else {
            // TODO: implement global search
            alert('Pencarian global akan mencari di pelanggan, produk, supplier, dll.');
        }
    };
    return (<header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-2 flex items-center justify-between">
      <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <lucide_react_1.Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
          <input_1.Input type="text" placeholder="Cari invoice, pelanggan, produk..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="pl-8 w-full"/>
        </div>
        <button_1.Button type="submit" size="sm" variant="secondary">Cari</button_1.Button>
      </form>
      <div className="flex items-center gap-4">
        <dropdown_menu_1.DropdownMenu>
          <dropdown_menu_1.DropdownMenuTrigger asChild>
            <button_1.Button variant="ghost" size="sm" className="flex items-center gap-2">
              <lucide_react_1.User size={18}/>
              <span className="hidden md:inline">{(profile === null || profile === void 0 ? void 0 : profile.full_name) || (user === null || user === void 0 ? void 0 : user.email)}</span>
            </button_1.Button>
          </dropdown_menu_1.DropdownMenuTrigger>
          <dropdown_menu_1.DropdownMenuContent align="end">
            <dropdown_menu_1.DropdownMenuLabel>Akun</dropdown_menu_1.DropdownMenuLabel>
            <dropdown_menu_1.DropdownMenuSeparator />
            <dropdown_menu_1.DropdownMenuItem onClick={handleLogout}>
              <lucide_react_1.LogOut className="mr-2 h-4 w-4"/>
              <span>Logout</span>
            </dropdown_menu_1.DropdownMenuItem>
          </dropdown_menu_1.DropdownMenuContent>
        </dropdown_menu_1.DropdownMenu>
      </div>
    </header>);
}
