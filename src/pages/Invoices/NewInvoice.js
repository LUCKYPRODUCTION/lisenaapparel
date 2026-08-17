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
exports.default = NewInvoice;
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var z = require("zod");
var supabase_1 = require("../../lib/supabase");
var invoice_number_1 = require("../../utils/invoice-number");
var sonner_1 = require("sonner");
var button_1 = require("../../components/ui/button");
var input_1 = require("../../components/ui/input");
var label_1 = require("../../components/ui/label");
var card_1 = require("../../components/ui/card");
var select_1 = require("../../components/ui/select");
var react_router_dom_1 = require("react-router-dom");
var orderItemSchema = z.object({
    product_name: z.string().min(1, 'Nama produk wajib'),
    size: z.string().optional(),
    color: z.string().optional(),
    qty: z.number().min(1, 'Qty minimal 1'),
    price: z.number().min(0, 'Harga tidak boleh negatif'),
    subtotal: z.number(),
});
var invoiceSchema = z.object({
    customer_id: z.string().uuid('Pilih pelanggan'),
    order_name: z.string().min(1, 'Nama pesanan wajib'),
    deadline: z.string().min(1, 'Deadline wajib'),
    notes: z.string().optional(),
    design_file_url: z.string().optional(),
    items: z.array(orderItemSchema).min(1, 'Tambahkan minimal satu item'),
    discount: z.number().min(0).default(0),
    dp: z.number().min(0).default(0),
    payment_method: z.enum(['Cash', 'Transfer', 'QRIS', 'Lainnya']),
});
function NewInvoice() {
    var _this = this;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)([]), customers = _a[0], setCustomers = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(invoiceSchema),
        defaultValues: {
            items: [{ product_name: '', size: '', color: '', qty: 1, price: 0, subtotal: 0 }],
            discount: 0,
            dp: 0,
            payment_method: 'Cash',
        }
    }), register = _c.register, control = _c.control, handleSubmit = _c.handleSubmit, watch = _c.watch, setValue = _c.setValue, errors = _c.formState.errors;
    var _d = (0, react_hook_form_1.useFieldArray)({ control: control, name: 'items' }), fields = _d.fields, append = _d.append, remove = _d.remove;
    var watchItems = watch('items');
    var watchDiscount = watch('discount');
    var watchDp = watch('dp');
    // Calculate subtotal
    var calculateSubtotal = function (index) {
        var _a, _b;
        var qty = ((_a = watchItems[index]) === null || _a === void 0 ? void 0 : _a.qty) || 0;
        var price = ((_b = watchItems[index]) === null || _b === void 0 ? void 0 : _b.price) || 0;
        setValue("items.".concat(index, ".subtotal"), qty * price);
    };
    var total = watchItems.reduce(function (sum, item) { return sum + (item.subtotal || 0); }, 0) - watchDiscount;
    var remaining = total - watchDp;
    (0, react_1.useEffect)(function () {
        fetchCustomers();
    }, []);
    var fetchCustomers = function () { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supabase_1.supabase.from('customers').select('id, name, whatsapp, address')];
                case 1:
                    data = (_a.sent()).data;
                    setCustomers(data || []);
                    return [2 /*return*/];
            }
        });
    }); };
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var invoiceNumber, _a, order_1, error, items, itemsError, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, (0, invoice_number_1.generateInvoiceNumber)()];
                case 2:
                    invoiceNumber = _b.sent();
                    return [4 /*yield*/, supabase_1.supabase
                            .from('orders')
                            .insert({
                            invoice_number: invoiceNumber,
                            customer_id: data.customer_id,
                            order_name: data.order_name,
                            deadline: data.deadline,
                            notes: data.notes,
                            design_file_url: data.design_file_url,
                            subtotal: total + watchDiscount,
                            discount: data.discount,
                            total: total,
                            dp: data.dp,
                            remaining: remaining,
                            payment_method: data.payment_method,
                            status: 'ORDER MASUK',
                        })
                            .select()
                            .single()];
                case 3:
                    _a = _b.sent(), order_1 = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    items = data.items.map(function (item) { return ({
                        order_id: order_1.id,
                        product_name: item.product_name,
                        size: item.size,
                        color: item.color,
                        qty: item.qty,
                        price: item.price,
                        subtotal: item.subtotal,
                    }); });
                    return [4 /*yield*/, supabase_1.supabase.from('order_items').insert(items)];
                case 4:
                    itemsError = (_b.sent()).error;
                    if (itemsError)
                        throw itemsError;
                    sonner_1.toast.success('Invoice berhasil dibuat!');
                    navigate("/invoices/".concat(order_1.id));
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _b.sent();
                    sonner_1.toast.error(error_1.message);
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Buat Nota Baru</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer, Order Info */}
        <card_1.Card>
          <card_1.CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label_1.Label>Pelanggan</label_1.Label>
                <select_1.Select onValueChange={function (val) { return setValue('customer_id', val); }}>
                  <select_1.SelectTrigger>
                    <select_1.SelectValue placeholder="Pilih pelanggan"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {customers.map(function (c) { return (<select_1.SelectItem key={c.id} value={c.id}>{c.name}</select_1.SelectItem>); })}
                  </select_1.SelectContent>
                </select_1.Select>
                {errors.customer_id && <p className="text-red-500 text-sm">{errors.customer_id.message}</p>}
              </div>
              <div>
                <label_1.Label>Nama Pesanan</label_1.Label>
                <input_1.Input {...register('order_name')}/>
                {errors.order_name && <p className="text-red-500 text-sm">{errors.order_name.message}</p>}
              </div>
              <div>
                <label_1.Label>Deadline</label_1.Label>
                <input_1.Input type="date" {...register('deadline')}/>
                {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
              </div>
              <div>
                <label_1.Label>Metode Pembayaran</label_1.Label>
                <select_1.Select onValueChange={function (val) { return setValue('payment_method', val); }}>
                  <select_1.SelectTrigger>
                    <select_1.SelectValue placeholder="Pilih metode"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="Cash">Cash</select_1.SelectItem>
                    <select_1.SelectItem value="Transfer">Transfer</select_1.SelectItem>
                    <select_1.SelectItem value="QRIS">QRIS</select_1.SelectItem>
                    <select_1.SelectItem value="Lainnya">Lainnya</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
                {errors.payment_method && <p className="text-red-500 text-sm">{errors.payment_method.message}</p>}
              </div>
            </div>
            <div>
              <label_1.Label>Catatan</label_1.Label>
              <input_1.Input {...register('notes')}/>
            </div>
            <div>
              <label_1.Label>File Desain (URL)</label_1.Label>
              <input_1.Input {...register('design_file_url')} placeholder="Link file desain"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Order Items */}
        <card_1.Card>
          <card_1.CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold">Item Pesanan</h3>
            {fields.map(function (field, index) {
            var _a;
            return (<div key={field.id} className="grid grid-cols-3 md:grid-cols-6 gap-2 items-end border-b pb-2">
                <div>
                  <label_1.Label>Produk</label_1.Label>
                  <input_1.Input {...register("items.".concat(index, ".product_name"))}/>
                </div>
                <div>
                  <label_1.Label>Size</label_1.Label>
                  <input_1.Input {...register("items.".concat(index, ".size"))}/>
                </div>
                <div>
                  <label_1.Label>Warna</label_1.Label>
                  <input_1.Input {...register("items.".concat(index, ".color"))}/>
                </div>
                <div>
                  <label_1.Label>Qty</label_1.Label>
                  <input_1.Input type="number" {...register("items.".concat(index, ".qty"), { valueAsNumber: true })} onChange={function () { return calculateSubtotal(index); }}/>
                </div>
                <div>
                  <label_1.Label>Harga</label_1.Label>
                  <input_1.Input type="number" {...register("items.".concat(index, ".price"), { valueAsNumber: true })} onChange={function () { return calculateSubtotal(index); }}/>
                </div>
                <div>
                  <label_1.Label>Subtotal</label_1.Label>
                  <input_1.Input value={((_a = watchItems[index]) === null || _a === void 0 ? void 0 : _a.subtotal) || 0} disabled/>
                </div>
                <button_1.Button type="button" variant="destructive" size="sm" onClick={function () { return remove(index); }}>Hapus</button_1.Button>
              </div>);
        })}
            <button_1.Button type="button" variant="outline" onClick={function () { return append({ product_name: '', size: '', color: '', qty: 1, price: 0, subtotal: 0 }); }}>Tambah Item</button_1.Button>
          </card_1.CardContent>
        </card_1.Card>

        {/* Summary */}
        <card_1.Card>
          <card_1.CardContent className="pt-6 space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>Rp {total + watchDiscount}</span></div>
            <div className="flex items-center gap-2">
              <label_1.Label>Diskon</label_1.Label>
              <input_1.Input type="number" className="w-32" {...register('discount', { valueAsNumber: true })}/>
            </div>
            <div className="flex justify-between font-bold"><span>Total</span><span>Rp {total}</span></div>
            <div className="flex items-center gap-2">
              <label_1.Label>DP</label_1.Label>
              <input_1.Input type="number" className="w-32" {...register('dp', { valueAsNumber: true })}/>
            </div>
            <div className="flex justify-between font-bold"><span>Sisa</span><span>Rp {remaining}</span></div>
          </card_1.CardContent>
        </card_1.Card>

        <button_1.Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Nota'}
        </button_1.Button>
      </form>
    </div>);
}
