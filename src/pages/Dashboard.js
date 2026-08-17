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
exports.default = Dashboard;
var react_1 = require("react");
var supabase_1 = require("../lib/supabase");
var card_1 = require("../components/ui/card");
var recharts_1 = require("recharts");
var format_1 = require("../utils/format");
function Dashboard() {
    var _this = this;
    var _a = (0, react_1.useState)({
        ordersToday: 0,
        ordersInProduction: 0,
        ordersCompleted: 0,
        ordersOverdue: 0,
        revenueToday: 0,
        revenueMonth: 0,
        expensesMonth: 0,
        netProfit: 0,
    }), stats = _a[0], setStats = _a[1];
    var _b = (0, react_1.useState)([]), recentOrders = _b[0], setRecentOrders = _b[1];
    var _c = (0, react_1.useState)([]), chartData = _c[0], setChartData = _c[1];
    (0, react_1.useEffect)(function () {
        fetchDashboardData();
    }, []);
    var fetchDashboardData = function () { return __awaiter(_this, void 0, void 0, function () {
        var today, startOfMonth, ordersToday, inProduction, recent, days;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    today = new Date().toISOString().split('T')[0];
                    startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                    return [4 /*yield*/, supabase_1.supabase
                            .from('orders')
                            .select('*', { count: 'exact', head: true })
                            .eq('created_at::date', today)
                        // Orders in production (status not in ['SELESAI','DIKIRIM'])
                    ];
                case 1:
                    ordersToday = (_a.sent()).count;
                    return [4 /*yield*/, supabase_1.supabase
                            .from('orders')
                            .select('*', { count: 'exact', head: true })
                            .not('status', 'in', '("SELESAI","DIKIRIM")')
                        // ... more queries
                    ];
                case 2:
                    inProduction = (_a.sent()).count;
                    // ... more queries
                    setStats({
                        ordersToday: ordersToday || 0,
                        ordersInProduction: inProduction || 0,
                        ordersCompleted: 0,
                        ordersOverdue: 0,
                        revenueToday: 0,
                        revenueMonth: 0,
                        expensesMonth: 0,
                        netProfit: 0,
                    });
                    return [4 /*yield*/, supabase_1.supabase
                            .from('orders')
                            .select('*, customers(name)')
                            .order('created_at', { ascending: false })
                            .limit(5)];
                case 3:
                    recent = (_a.sent()).data;
                    setRecentOrders(recent || []);
                    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    setChartData(days.map(function (day) { return ({ name: day, revenue: Math.floor(Math.random() * 1000000) }); }));
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium">Pesanan Hari Ini</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{stats.ordersToday}</div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium">Dalam Produksi</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{stats.ordersInProduction}</div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium">Selesai</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{stats.ordersCompleted}</div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader className="pb-2">
            <card_1.CardTitle className="text-sm font-medium">Terlambat</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="text-2xl font-bold">{stats.ordersOverdue}</div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <card_1.Card>
          <card_1.CardHeader><card_1.CardTitle className="text-sm">Omzet Hari Ini</card_1.CardTitle></card_1.CardHeader>
          <card_1.CardContent className="text-2xl font-bold">{(0, format_1.formatCurrency)(stats.revenueToday)}</card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader><card_1.CardTitle className="text-sm">Omzet Bulan Ini</card_1.CardTitle></card_1.CardHeader>
          <card_1.CardContent className="text-2xl font-bold">{(0, format_1.formatCurrency)(stats.revenueMonth)}</card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader><card_1.CardTitle className="text-sm">Laba Bersih</card_1.CardTitle></card_1.CardHeader>
          <card_1.CardContent className="text-2xl font-bold">{(0, format_1.formatCurrency)(stats.netProfit)}</card_1.CardContent>
        </card_1.Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <card_1.Card>
          <card_1.CardHeader><card_1.CardTitle>Omzet 7 Hari Terakhir</card_1.CardTitle></card_1.CardHeader>
          <card_1.CardContent className="h-64">
            <recharts_1.ResponsiveContainer width="100%" height="100%">
              <recharts_1.BarChart data={chartData}>
                <recharts_1.XAxis dataKey="name"/>
                <recharts_1.YAxis />
                <recharts_1.Tooltip />
                <recharts_1.Bar dataKey="revenue" fill="#8884d8"/>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card>
          <card_1.CardHeader><card_1.CardTitle>Status Produksi</card_1.CardTitle></card_1.CardHeader>
          <card_1.CardContent className="h-64">
            <recharts_1.ResponsiveContainer width="100%" height="100%">
              <recharts_1.PieChart>
                <recharts_1.Pie data={[{ name: 'Proses', value: 10 }, { name: 'Selesai', value: 20 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label/>
                <recharts_1.Tooltip />
              </recharts_1.PieChart>
            </recharts_1.ResponsiveContainer>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      <card_1.Card>
        <card_1.CardHeader><card_1.CardTitle>Order Terbaru</card_1.CardTitle></card_1.CardHeader>
        <card_1.CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Invoice</th>
                  <th className="text-left p-2">Pelanggan</th>
                  <th className="text-left p-2">Pesanan</th>
                  <th className="text-left p-2">Qty</th>
                  <th className="text-left p-2">Deadline</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(function (order) {
            var _a;
            return (<tr key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={function () { return window.location.href = "/invoices/".concat(order.id); }}>
                    <td className="p-2">{order.invoice_number}</td>
                    <td className="p-2">{(_a = order.customers) === null || _a === void 0 ? void 0 : _a.name}</td>
                    <td className="p-2">{order.order_name}</td>
                    <td className="p-2">-</td>
                    <td className="p-2">{(0, format_1.formatDate)(order.deadline)}</td>
                    <td className="p-2">{(0, format_1.formatCurrency)(order.total)}</td>
                    <td className="p-2"><span className="px-2 py-1 rounded-full text-xs bg-gray-200">{order.status}</span></td>
                  </tr>);
        })}
              </tbody>
            </table>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
