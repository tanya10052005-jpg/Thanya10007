import { useState } from 'react';

function App() {
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [drinkType, setDrinkType] = useState('refill'); // 'refill' หรือ 'bottle'
  const [waterBottles, setWaterBottles] = useState('');
  const [sodaBottles, setSodaBottles] = useState('');
  const [discount, setDiscount] = useState(0); // 0, 0.1, 0.15, 0.2
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [summary, setSummary] = useState({
    calculated: false,
    adultCount: 0,
    childCount: 0,
    foodBeforeDiscount: 0,
    discountAmount: 0,
    foodAfterDiscount: 0,
    drinkTotal: 0,
    totalPrice: 0,
  });

  const adjustCount = (currentVal, setter, delta) => {
    const num = currentVal === '' ? 0 : Number(currentVal);
    const next = Math.max(0, num + delta);
    setter(String(next));
  };

  const handleDrinkTypeChange = (type) => {
    setDrinkType(type);
    if (type === 'refill') {
      setWaterBottles('');
      setSodaBottles('');
    }
  };

  const handleCalculate = () => {
    setError('');
    setCopied(false);

    const adultCount = adults === '' ? NaN : Number(adults);
    const childCount = children === '' ? NaN : Number(children);

    if (
      isNaN(adultCount) ||
      isNaN(childCount) ||
      adultCount < 0 ||
      childCount < 0
    ) {
      setError(
        'กรุณาป้อนจำนวนผู้ใหญ่และจำนวนเด็กตั้งแต่ 0 ขึ้นไป (หากไม่มีให้ใส่ 0)'
      );
      return;
    }

    const foodTotal = adultCount * 299 + childCount * 89;
    const discountAmount = foodTotal * Number(discount);
    const foodAfterDiscount = foodTotal - discountAmount;

    let drinkTotal = 0;
    if (drinkType === 'refill') {
      drinkTotal = (adultCount + childCount) * 29;
    } else {
      const waterCount = waterBottles === '' ? 0 : Number(waterBottles);
      const sodaCount = sodaBottles === '' ? 0 : Number(sodaBottles);

      if (waterCount < 0 || sodaCount < 0) {
        setError('จำนวนขวดเครื่องดื่มต้องไม่ติดลบ');
        return;
      }
      drinkTotal = waterCount * 10 + sodaCount * 25;
    }

    setSummary({
      calculated: true,
      adultCount,
      childCount,
      foodBeforeDiscount: foodTotal,
      discountAmount,
      foodAfterDiscount,
      drinkTotal,
      totalPrice: foodAfterDiscount + drinkTotal,
    });
  };

  const handleReset = () => {
    setAdults('');
    setChildren('');
    setDrinkType('refill');
    setWaterBottles('');
    setSodaBottles('');
    setDiscount(0);
    setError('');
    setCopied(false);
    setSummary({
      calculated: false,
      adultCount: 0,
      childCount: 0,
      foodBeforeDiscount: 0,
      discountAmount: 0,
      foodAfterDiscount: 0,
      drinkTotal: 0,
      totalPrice: 0,
    });
  };

  const formatMoney = (val) =>
    val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleCopySummary = () => {
    const text = [
      `🔥 SHABU & GRILL BUFFET`,
      `ผู้ใหญ่ ${summary.adultCount} ท่าน / เด็ก ${summary.childCount} ท่าน`,
      `ค่าอาหาร: ${formatMoney(summary.foodBeforeDiscount)} ฿`,
      `ส่วนลด: -${formatMoney(summary.discountAmount)} ฿`,
      `ค่าเครื่องดื่ม: ${formatMoney(summary.drinkTotal)} ฿`,
      `ยอดชำระสุทธิ: ${formatMoney(summary.totalPrice)} ฿`,
    ].join('\n');

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const discountOptions = [
    { label: 'ไม่มีส่วนลด', value: 0 },
    { label: 'ลด 10%', value: 0.1 },
    { label: 'ลด 15%', value: 0.15 },
    { label: 'ลด 20%', value: 0.2 },
  ];

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-slate-800 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ฝั่งซ้าย: แผงควบคุมการสั่งอาหาร */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200/80">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-2xl shadow-md shadow-orange-200">
                🍲
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Buffet Calculator
                </h1>
                <p className="text-xs text-slate-500">
                  ระบบคิดเงินบุฟเฟต์ชาบู &amp; ปิ้งย่าง
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● เปิดให้บริการ
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: จำนวนลูกค้า */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. จำนวนผู้ใช้บริการ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* การ์ดผู้ใหญ่ */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:border-orange-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-sm text-slate-800">ผู้ใหญ่</p>
                    <p className="text-xs text-orange-600 font-semibold">
                      299 ฿ / ท่าน
                    </p>
                  </div>
                  <span className="text-lg">🧑</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustCount(adults, setAdults, -1)}
                    className="w-9 h-9 rounded-xl bg-white border border-stone-200 hover:bg-orange-50 hover:border-orange-300 active:scale-95 transition font-bold text-slate-700 cursor-pointer"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    placeholder="0"
                    className="w-full text-center font-bold text-base py-1.5 rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                  <button
                    type="button"
                    onClick={() => adjustCount(adults, setAdults, 1)}
                    className="w-9 h-9 rounded-xl bg-white border border-stone-200 hover:bg-orange-50 hover:border-orange-300 active:scale-95 transition font-bold text-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* การ์ดเด็ก */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:border-orange-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-sm text-slate-800">เด็ก</p>
                    <p className="text-xs text-orange-600 font-semibold">
                      89 ฿ / ท่าน
                    </p>
                  </div>
                  <span className="text-lg">🧒</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustCount(children, setChildren, -1)}
                    className="w-9 h-9 rounded-xl bg-white border border-stone-200 hover:bg-orange-50 hover:border-orange-300 active:scale-95 transition font-bold text-slate-700 cursor-pointer"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                    placeholder="0"
                    className="w-full text-center font-bold text-base py-1.5 rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                  <button
                    type="button"
                    onClick={() => adjustCount(children, setChildren, 1)}
                    className="w-9 h-9 rounded-xl bg-white border border-stone-200 hover:bg-orange-50 hover:border-orange-300 active:scale-95 transition font-bold text-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: เครื่องดื่ม */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              2. แพ็กเกจเครื่องดื่ม
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => handleDrinkTypeChange('refill')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  drinkType === 'refill'
                    ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-100'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-800">
                    🥤 น้ำรีฟิลไม่อั้น
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      drinkType === 'refill'
                        ? 'bg-orange-500 text-white'
                        : 'border border-stone-300'
                    }`}
                  >
                    {drinkType === 'refill' ? '✓' : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  คนละ 29 บาท (ผู้ใหญ่และเด็ก)
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleDrinkTypeChange('bottle')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  drinkType === 'bottle'
                    ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-100'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-800">
                    🍾 เครื่องดื่มแบบขวด
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      drinkType === 'bottle'
                        ? 'bg-orange-500 text-white'
                        : 'border border-stone-300'
                    }`}
                  >
                    {drinkType === 'bottle' ? '✓' : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  คิดตามจำนวนขวดที่สั่งจริง
                </p>
              </button>
            </div>

            {/* ช่องกรอกจำนวนขวด */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl border transition-all ${
                drinkType === 'bottle'
                  ? 'bg-stone-50 border-stone-200 opacity-100'
                  : 'bg-stone-100/60 border-stone-200/60 opacity-50'
              }`}
            >
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  💧 น้ำเปล่า (10 ฿/ขวด)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={drinkType === 'refill'}
                    onClick={() =>
                      adjustCount(waterBottles, setWaterBottles, -1)
                    }
                    className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-xs font-bold disabled:cursor-not-allowed cursor-pointer"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    disabled={drinkType === 'refill'}
                    value={waterBottles}
                    onChange={(e) => setWaterBottles(e.target.value)}
                    placeholder="0"
                    className="w-full text-center text-sm font-semibold py-1.5 rounded-lg bg-white border border-stone-200 disabled:bg-stone-200 disabled:cursor-not-allowed focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    disabled={drinkType === 'refill'}
                    onClick={() =>
                      adjustCount(waterBottles, setWaterBottles, 1)
                    }
                    className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-xs font-bold disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  🫧 น้ำอัดลม (25 ฿/ขวด)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={drinkType === 'refill'}
                    onClick={() => adjustCount(sodaBottles, setSodaBottles, -1)}
                    className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-xs font-bold disabled:cursor-not-allowed cursor-pointer"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    disabled={drinkType === 'refill'}
                    value={sodaBottles}
                    onChange={(e) => setSodaBottles(e.target.value)}
                    placeholder="0"
                    className="w-full text-center text-sm font-semibold py-1.5 rounded-lg bg-white border border-stone-200 disabled:bg-stone-200 disabled:cursor-not-allowed focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    disabled={drinkType === 'refill'}
                    onClick={() => adjustCount(sodaBottles, setSodaBottles, 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-xs font-bold disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: บัตรส่วนลด */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. บัตรส่วนลด
              </h2>
              <span className="text-[11px] text-slate-400">
                *ลดเฉพาะค่าอาหาร ไม่รวมเครื่องดื่ม
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {discountOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setDiscount(item.value)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                    discount === item.value
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-stone-200 hover:border-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleCalculate}
              className="col-span-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-orange-200 transition-all cursor-pointer"
            >
              คำนวณยอดชำระ
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-3.5 px-4 rounded-2xl bg-stone-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-stone-200 active:scale-[0.98] text-slate-600 font-bold text-sm transition-all cursor-pointer"
            >
              รีเซ็ต
            </button>
          </div>
        </div>

        {/* ฝั่งขวา: สลิปใบเสร็จ (Digital Receipt) */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-7 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-dashed border-slate-700">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-orange-400 font-bold">
                RECEIPT SUMMARY
              </p>
              <h2 className="text-lg font-bold text-white">สรุปรายการชำระเงิน</h2>
            </div>
            <span className="text-2xl">🧾</span>
          </div>

          {!summary.calculated ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-800 mx-auto mb-3 flex items-center justify-center text-2xl">
                🧮
              </div>
              <p className="text-sm text-slate-300 font-medium">
                ยังไม่มีรายการคำนวณ
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ระบุจำนวนลูกค้าด้านซ้าย แล้วกดปุ่ม &ldquo;คำนวณยอดชำระ&rdquo;
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-300">
                <span>
                  ค่าอาหาร ({summary.adultCount} ผู้ใหญ่, {summary.childCount}{' '}
                  เด็ก)
                </span>
                <span className="font-semibold text-white">
                  {formatMoney(summary.foodBeforeDiscount)} ฿
                </span>
              </div>

              <div className="flex justify-between text-emerald-400">
                <span>ส่วนลดค่าอาหาร ({discount * 100}%)</span>
                <span className="font-semibold">
                  −{formatMoney(summary.discountAmount)} ฿
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>
                  ค่าเครื่องดื่ม (
                  {drinkType === 'refill' ? 'น้ำรีฟิล' : 'แบบขวด'})
                </span>
                <span className="font-semibold text-white">
                  {formatMoney(summary.drinkTotal)} ฿
                </span>
              </div>
            </div>
          )}

          {/* เส้นประแบ่งยอดรวม */}
          <div className="pt-5 border-t border-dashed border-slate-700">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs uppercase tracking-wider text-slate-400">
                ยอดชำระทั้งหมด
              </span>
              <span className="text-xs text-slate-400">THB</span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-orange-400 tracking-tight mb-5">
              {formatMoney(summary.totalPrice)}{' '}
              <span className="text-base font-semibold text-slate-300">บาท</span>
            </div>

            {summary.calculated && (
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
              >
                {copied ? '✓ คัดลอกใบเสร็จเรียบร้อย' : '📋 คัดลอกใบเสร็จส่งให้เพื่อน'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;