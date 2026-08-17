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
exports.default = InvoiceDetail;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var supabase_1 = require("../../lib/supabase");
var button_1 = require("../../components/ui/button");
var sonner_1 = require("sonner");
var format_1 = require("../../utils/format");
var html2canvas_1 = require("html2canvas");
var jspdf_1 = require("jspdf");
function InvoiceDetail() {
    var _this = this;
    var _a, _b, _c;
    var id = (0, react_router_dom_1.useParams)().id;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _d = (0, react_1.useState)(null), order = _d[0], setOrder = _d[1];
    var _e = (0, react_1.useState)([]), items = _e[0], setItems = _e[1];
    var _f = (0, react_1.useState)(true), loading = _f[0], setLoading = _f[1];
    (0, react_1.useEffect)(function () {
        fetchInvoice();
    }, [id]);
    var fetchInvoice = function () { return __awaiter(_this, void 0, void 0, function () {
        var orderData, itemsData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id)
                        return [2 /*return*/];
                    return [4 /*yield*/, supabase_1.supabase
                            .from('orders')
                            .select('*, customers(*)')
                            .eq('id', id)
                            .single()];
                case 1:
                    orderData = (_a.sent()).data;
                    setOrder(orderData);
                    return [4 /*yield*/, supabase_1.supabase
                            .from('order_items')
                            .select('*')
                            .eq('order_id', id)];
                case 2:
                    itemsData = (_a.sent()).data;
                    setItems(itemsData || []);
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDownloadJPG = function () { return __awaiter(_this, void 0, void 0, function () {
        var element, canvas, link;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    element = document.getElementById('invoice-template');
                    if (!element)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, html2canvas_1.default)(element, { scale: 2 })];
                case 1:
                    canvas = _a.sent();
                    link = document.createElement('a');
                    link.download = "".concat(order.invoice_number, ".jpg");
                    link.href = canvas.toDataURL('image/jpeg');
                    link.click();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDownloadPDF = function () {
        var doc = new jspdf_1.default('p', 'mm', 'a4');
        // Custom PDF generation using html2canvas or direct jsPDF
        sonner_1.toast.info('Fungsi PDF akan segera diimplementasikan');
    };
    var handleWhatsApp = function () {
        var _a;
        if (!((_a = order === null || order === void 0 ? void 0 : order.customers) === null || _a === void 0 ? void 0 : _a.whatsapp)) {
            sonner_1.toast.warning('Nomor WhatsApp pelanggan tidak tersedia');
            return;
        }
        var msg = "Halo Kak ".concat(order.customers.name, ",\n\nBerikut nota pesanan dari LISENA APPAREL.\nInvoice: ").concat(order.invoice_number, "\nPesanan: ").concat(order.order_name, "\nTotal: ").concat((0, format_1.formatCurrency)(order.total), "\nDP: ").concat((0, format_1.formatCurrency)(order.dp), "\nSisa: ").concat((0, format_1.formatCurrency)(order.remaining), "\nDeadline: ").concat((0, format_1.formatDate)(order.deadline), "\n\nTerima kasih \uD83D\uDE4F");
        var url = "https://wa.me/".concat(order.customers.whatsapp, "?text=").concat(encodeURIComponent(msg));
        window.open(url, '_blank');
    };
    if (loading)
        return <div>Loading...</div>;
    if (!order)
        return <div>Invoice tidak ditemukan</div>;
    return (<div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button_1.Button onClick={function () { return navigate('/invoices/new'); }}>Buat Nota Baru</button_1.Button>
        <button_1.Button variant="outline" onClick={handleDownloadJPG}>Download JPG</button_1.Button>
        <button_1.Button variant="outline" onClick={handleDownloadPDF}>Download PDF</button_1.Button>
        <button_1.Button variant="outline" onClick={handleWhatsApp}>Kirim WhatsApp</button_1.Button>
        <button_1.Button variant="destructive" onClick={function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm('Hapus invoice ini?')) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase_1.supabase.from('orders').delete().eq('id', id)];
                    case 1:
                        _a.sent();
                        sonner_1.toast.success('Invoice dihapus');
                        navigate('/dashboard');
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }}>Hapus</button_1.Button>
      </div>

      {/* Invoice Template */}
      <div id="invoice-template" className="bg-white p-8 rounded shadow max-w-3xl mx-auto">
        <div className="text-center border-b pb-4">
          <h1 className="text-3xl font-bold">LISENA APPAREL</h1>
          <p className="text-sm text-gray-600">PREMIUM CUSTOM APPAREL</p>
          <p className="text-xs text-gray-500">Konveksi • Sablon • Jersey • Bordir • Printing</p>
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            <p><strong>Invoice:</strong> {order.invoice_number}</p>
            <p><strong>Tanggal:</strong> {(0, format_1.formatDate)(order.created_at)}</p>
            <p><strong>Deadline:</strong> {(0, format_1.formatDate)(order.deadline)}</p>
          </div>
          <div>
            <p><strong>Pelanggan:</strong> {(_a = order.customers) === null || _a === void 0 ? void 0 : _a.name}</p>
            <p><strong>WhatsApp:</strong> {(_b = order.customers) === null || _b === void 0 ? void 0 : _b.whatsapp}</p>
            <p><strong>Alamat:</strong> {(_c = order.customers) === null || _c === void 0 ? void 0 : _c.address}</p>
          </div>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Produk</th>
              <th className="text-left p-2">Size</th>
              <th className="text-left p-2">Warna</th>
              <th className="text-right p-2">Qty</th>
              <th className="text-right p-2">Harga</th>
              <th className="text-right p-2">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {items.map(function (item, idx) { return (<tr key={idx} className="border-b">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{item.product_name}</td>
                <td className="p-2">{item.size}</td>
                <td className="p-2">{item.color}</td>
                <td className="text-right p-2">{item.qty}</td>
                <td className="text-right p-2">{(0, format_1.formatCurrency)(item.price)}</td>
                <td className="text-right p-2">{(0, format_1.formatCurrency)(item.subtotal)}</td>
              </tr>); })}
          </tbody>
          <tfoot>
            <tr><td colSpan={6} className="text-right p-2 font-bold">Subtotal</td><td className="text-right p-2">{(0, format_1.formatCurrency)(order.subtotal)}</td></tr>
            <tr><td colSpan={6} className="text-right p-2">Diskon</td><td className="text-right p-2">-{(0, format_1.formatCurrency)(order.discount)}</td></tr>
            <tr><td colSpan={6} className="text-right p-2 font-bold">Total</td><td className="text-right p-2 font-bold">{(0, format_1.formatCurrency)(order.total)}</td></tr>
            <tr><td colSpan={6} className="text-right p-2">DP</td><td className="text-right p-2">{(0, format_1.formatCurrency)(order.dp)}</td></tr>
            <tr><td colSpan={6} className="text-right p-2 font-bold">Sisa</td><td className="text-right p-2 font-bold">{(0, format_1.formatCurrency)(order.remaining)}</td></tr>
          </tfoot>
        </table>
        <div className="text-center text-xs text-gray-500 mt-4 border-t pt-4">
          Terima kasih telah mempercayakan kebutuhan apparel Anda kepada Lisena Apparel.
        </div>
      </div>
    </div>);
}
