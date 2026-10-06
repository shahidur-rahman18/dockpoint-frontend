# ডাক্তার ড্যাশবোর্ড (Doctor Dashboard) - সম্পূর্ণ বাস্তবায়ন পরিকল্পনা

এই ডকুমেন্টটি `http://localhost:5173/doctor-dashboard` রাউটের অধীনে ডাক্তার ড্যাশবোর্ড তৈরি করার জন্য স্ট্যান্ডার্ড, মডুলার এবং স্কেলেবল আর্কিটেকচার বর্ণনা করে।

---

## ১. আর্কিটেকচার ও ডিজাইন ফিলোসফি

### ডায়নামিক রোল-ভিত্তিক লেআউট (Dynamic Role-Based Layout)
ইন্ডাস্ট্রি স্ট্যান্ডার্ড অনুযায়ী, অ্যাডমিন, ডক্টর বা ভবিষ্যতের যেকোনো রোলের জন্য আলাদা আলাদা লেআউট বা সাইডবার ফাইল তৈরি করা হবে না। বরং, একটি **সিঙ্গেল `DashboardLayout` এবং `Sidebar` কম্পোনেন্ট** ব্যবহার করা হবে।
* **মেনু কনফিগারেশন:** নেভিগেশন আইটেমগুলো `src/components/layout/menuConfig.ts` নামে একটি পৃথক কনফিগারেশন ফাইলে রোল-ভিত্তিকভাবে সংরক্ষিত থাকবে।
* **রানটাইম রেন্ডারিং:** সাইডবার কারেন্ট ইউআরএল পাথ (যেমন `/doctor-dashboard`) বা ইউজার রোল देखकर ডাইনামিকভাবে সঠিক মেনু লোড করবে।
* **সুবিধা:** কোনো কনফ্লিক্ট নেই, কোড ডুপ্লিকেশন নেই (DRY Principle), এবং নতুন রোল যোগ করা অত্যন্ত সহজ।

---

## ২. ফোল্ডার স্ট্রাকচার (Folder Structure)

প্রজেক্টের রুট থেকে ফোল্ডার বা স্ট্রাকচারটি নিম্নরূপ হবে:

```text
dockpoint-frontend/
├── src/
│   ├── pages/
│   │   └── DoctorDashboard.tsx                 <-- ড্যাশবোর্ডের মূল পেজ (Container)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx             <-- মূল লেআউট র্যাপার (Shared)
│   │   │   ├── Sidebar.tsx                     <-- ডাইনামিক সাইডবার (Shared)
│   │   │   ├── Header.tsx                      <-- শীর্ষ হেডার (Shared)
│   │   │   ├── ThemeCustomizer.tsx             <-- থিম কাস্টমাইজার (Shared)
│   │   │   └── menuConfig.ts                   <-- **নতুন:** রোল-ভিত্তিক মেনু কনফিগারেশন
│   │   └── doctor-dashboard/                   <-- **নতুন ফোল্ডার:** ডাক্তার ড্যাশবোর্ড স্পেসিফিক UI কম্পোনেন্ট
│   │       ├── DoctorStatCard.tsx              <-- শীর্ষের ৩টি স্ট্যাট কার্ড (মিনি চার্টসহ)
│   │       ├── UpcomingAppointments.tsx        <-- আসন্ন অ্যাপয়েন্টমেন্ট কার্ড (অ্যাকশন বাটনসহ)
│   │       ├── AppointmentsChart.tsx           <-- অ্যাপয়েন্টমেন্ট এনালাইসিস (বার + লাইন কম্বো চার্ট)
│   │       ├── DoctorMetricCard.tsx            <-- নিচের ৬টি ক্ষুদ্র মেট্রিক কার্ড
│   │       └── UpgradeProCard.tsx              <-- সাইডবারের নিচে প্রো আপগ্রেড প্রমো কার্ড
│   ├── data/
│   │   ├── mockData.ts                         <-- অ্যাডমিন ড্যাশবোর্ডের ডেটা (বিদ্যমান)
│   │   └── doctorMockData.ts                   <-- **নতুন:** ডাক্তার ড্যাশবোর্ডের মক ডেটা
│   ├── router/
│   │   └── routes.tsx                          <-- রাউট কনফিগারেশন (আপডেট হবে)
│   └── types/
│       └── index.ts                            <-- টাইপ ডেফিনিশন (প্রয়োজন হলে আপডেট)
└── DOCTOR_DASHBOARD_PLAN.md                    <-- এই ফাইল
```

---

## ৩. কম্পোনেন্ট ভিত্তিক বিস্তারিত পরিকল্পনা

### ৩.১ `src/data/doctorMockData.ts` (মক ডেটা লেয়ার)
ড্যাশবোর্ডের সকল স্ট্যাটিক ডেটা (অ্যাপয়েন্টমেন্ট সংখ্যা, রোগীর নাম, চার্ট ডেটা, মেট্রিক মান) এই ফাইলে টাইপ-সেফ ভাবে থাকবে। এটি কম্পোনেন্টগুলোকে ডেটা থেকে আলাদা রাখবে।

**প্রধান ডেটা সেট:**
1.  **Stat Cards Data:** মোট অ্যাপয়েন্টমেন্ট, অনলাইন কনসালটেশন, বাতিল হয়েছে - মান, পরিবর্তন%, আইকন, মিনি বার চার্ট ডেটা।
2.  **Upcoming Appointments Data:** রোগীর নাম (যেমন: Andrew Billard), আইডি, সময়, ডিপার্টমেন্ট (Cardiology), কনসালটেশন টাইপ, প্রোফাইল ইমেজ URL।
3.  **Appointments Chart Data:** মাসভিত্তিক মোট অ্যাপয়েন্টমেন্ট (বার চার্ট) এবং সম্পন্ন অ্যাপয়েন্টমেন্ট (লাইন চার্ট) ডেটা।
4.  **Metric Cards Data:** টোটাল পেশেন্ট, ভিডিও কনসালটেশন, রিশিডিউল্ড, প্রি-ভিজিট বুকিং, ওয়াক-ইন বুকিং, ফলো-আপস - প্রতিটির মান, আইকন, রঙ এবং পরিবর্তন%।
5.  **Upgrade Pro Card Data:** টাইটেল, বিবরণ, বাটন টেক্সট।

### ৩.২ `src/components/layout/menuConfig.ts` (নেভিগেশন কনফিগারেশন)
এই ফাইলে তিনটি এক্সপোর্টেড কনস্ট্যান্ট থাকবে:
* `ADMIN_NAV_GROUPS`: বর্তমান অ্যাডমিন মেনু আইটেম।
* `DOCTOR_NAV_GROUPS`: ডাক্তার ড্যাশবোর্ডের জন্য নতুন মেনু আইটেম (Dashboard, Appointments, My Schedule, Prescriptions, Leave, Reviews, Settings)।
* `getNavGroups(pathname)`: একটি হেল্পার ফাংশন যা ইউআরএল পাথ গ্রহণ করে সঠিক মেনু গ্রুপ রিটার্ন করবে।

### ৩.৩ `src/components/layout/Sidebar.tsx` (আপডেটেড শেয়ার্ড কম্পোনেন্ট)
* `menuConfig.ts` থেকে `getNavGroups` ইম্পোর্ট করবে।
* `useLocation` হুক ব্যবহার করে কারেন্ট পাথ নেবে।
* `const navGroups = getNavGroups(location.pathname)` কল করে ডাইনামিক মেনু পাবে।
* সাইডবারের নিচে কন্ডিশনালি `UpgradeProCard` রেন্ডার করবে (শুধু ডাক্তার রাউটের জন্য)।

### ৩.৪ `src/components/doctor-dashboard/DoctorStatCard.tsx`
* **প্রপস:** `title`, `value`, `change`, `isPositive`, `icon`, `miniChartData`, `chartColor`।
* **ভিজ্যুয়াল:** বামে আইকন ও টেক্সট, ডানে মিনি বার চার্ট (SVG বা ছোট লাইব্রেরি দিয়ে)। নিচে পরিবর্তন% হره নilla/লাল রঙে।

### ৩.৫ `src/components/doctor-dashboard/UpcomingAppointments.tsx`
* **লেআউট:** কার্ড হেডারে "Upcoming Appointments" টাইটেল।
* **কন্টেন্ট:** রোগীর প্রোফাইল ছবি, নাম, ডিপার্টমেন্ট বেজ, কনসালটেশন টাইপ।
* **অ্যাকশন বাটন গ্রুপ (৩টি):**
    1.  **Start Appointment:** Primary বাটন (থিম কালার, বোল্ড)।
    2.  **Chat Now:** Secondary বাটন (কালো ব্যাকগ্রাউন্ড)।
    3.  **Video Consultation:** Outline বাটন (বর্ডারসহ, হোভারে রঙিন)।

### ৩.৬ `src/components/doctor-dashboard/AppointmentsChart.tsx`
* **লাইব্রেরি:** প্রজেক্টে থাকা লাইব্রেরি বা হালকা `recharts` / `chart.js` ব্যবহার (প্রজেক্টের موجودة লাইব্রেরি চেক করে)।
* **প্রকার:** Composed Chart (Bar + Line)।
*   - X-Axis: মাস (Jan - Dec)।
*   - Bar Series: "Appointments" (মোট সংখ্যা, হালকা রঙ)।
*   - Line Series: "Completed" (সম্পন্ন সংখ্যা, গাঢ় রঙ, ডটসহ)।
*   - টুলটিপ এবং লেজেন্ড সক্রিয় থাকবে।

### ৩.৭ `src/components/doctor-dashboard/DoctorMetricCard.tsx`
* **প্রপস:** `label`, `value`, `icon`, `iconBgColor`, `change`, `isPositive`।
* **ডিজাইন:** ছোট কার্ড, বামে আইকন (রঙিন ব্যাকগ্রাউন্ডে), ডানে মান এবং লেবেল, নিচে ছোট তীর চিহ্ন সহ পরিবর্তন%।

### ৩.৮ `src/components/doctor-dashboard/UpgradeProCard.tsx`
* **প্লেসমেন্ট:** `Sidebar.tsx`-এর ফুটার এলাকায় (মোবাইল/ডেস্কটপ দুটোই)।
* **কন্টেন্ট:** "Upgrade To Pro" হেডিং, সংক্ষিপ্ত বিবরণ, "Upgrade Now" প্রাইমারি বাটন।

### ৩.৯ `src/pages/DoctorDashboard.tsx` (মূল পেজ কম্পোনেন্ট)
* **লেআউট Стра্টেজি:** CSS Grid (`grid grid-cols-1 lg:grid-cols-12 gap-6`) ব্যবহার করে রেসপন্সিভ।
* **স্ট্রাকচার:**
    1.  **হেডার সেকশন:** টাইটেল "Doctor Dashboard" + "New Appointment" / "Schedule Availability" বাটন।
    2.  **টপ স্ট্রিপ (Row 1):** ৩টি `DoctorStatCard` (Col-span: 4 each on LG)।
    3.  **মিডিল সেকশন (Row 2):**
        *   বামে (Col-span: 8): `UpcomingAppointments`।
        *   ডানে (Col-span: 4): `AppointmentsChart`।
    4.  **বটম সেকশন (Row 3):** ৬টি `DoctorMetricCard` (Grid: 1 col mobile, 2 tab, 3 desktop, 6 lg)।
*   **ডেটা ফ্লো:** `doctorMockData.ts` থেকে ডেটা ইম্পোর্ট করে সাব-কম্পোনেন্টগুলোতে পাস করবে।

---

## ৪. রাউটিং কনফিগারেশন (Routing Update)

**ফাইল:** `src/router/routes.tsx`

**পরিবর্তন:**
1.  `DoctorDashboard` কম্পোনেন্ট ইম্পোর্ট করা হবে: `import { DoctorDashboard } from '../pages/DoctorDashboard';`
2.  বিদ্যমান প্লেসহোল্ডার রাউটটি বদলানো হবে:
    ```tsx
    // আগে
    { path: 'doctor-dashboard', ...pending('Doctor Dashboard', '...') }

    // পরে
    { path: 'doctor-dashboard', element: <DoctorDashboard /> }
    ```

---

## ৫. বাস্তবায়নের ধাপক্রম (Execution Steps)

১. **টাইপ ও ডেটা তৈরি:** `doctorMockData.ts` এবং প্রয়োজনীয় টাইপ ডেফিনিশন যোগ/আপডেট।
২. **মেনু কনফিগারেশন:** `menuConfig.ts` তৈরি করে `DOCTOR_NAV_GROUPS` ডিফাইন করা এবং `Sidebar.tsx`-এ ইন্টিগ্রেট করা।
৩. **UI কম্পোনেন্ট ডেভেলপমেন্ট:** `doctor-dashboard/` ফোল্ডারের অধীনে ৫টি কম্পোনেন্ট (`DoctorStatCard`, `UpcomingAppointments`, `AppointmentsChart`, `DoctorMetricCard`, `UpgradeProCard`) আলাদা করে তৈরি ও স্টাইল করা।
৪. **পেজ অ্যাসেম্বলি:** `DoctorDashboard.tsx` তৈরি করে গ্রিড লেআউটে কম্পোনেন্টগুলো সাজানো।
৫. **রাউট সংযোগ:** `routes.tsx` এ নতুন পেজটি রেজিস্টার করা।
৬. **ভেরিফিকেশন:** `npm run build` এবং `npm run lint` (যদি থাকে) রান করে টাইপ সেফটি এবং কোড কোয়ালিটি নিশ্চিত করা।

---

## ৬. ভবিষ্যতে Erweiterbarkeit (Future Scalability)

এই আর্কিটেকচার অনুসরণ করলে:
* **Patient Dashboard / Pharmacist Dashboard** যোগ করতে হলে শুধু `menuConfig.ts`-এ নতুন গ্রুপ যোগ করে `Sidebar`-এ কোনো লজিক পরিবর্তন ছাড়াই কাজ করবে।
* নতুন ড্যাশবোর্ডের জন্য পৃথক `components/patient-dashboard/` বা `components/pharmacist-dashboard/` ফোল্ডার বানাতে হবে।
* শেয়ার্ড লেআউট (Header, Theme, Layout Wrapper) সব जगह রিযूজ হবে।

---

## ৭. টেকনোলজি স্ট্যাক সারাংশ

* **Framework:** React 19 + TypeScript
* **Routing:** React Router v7
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React
* **Charts:** Recharts / Chart.js (প্রজেক্টের ডিপেনডেন্সি অনুযায়ী সিদ্ধান্ত)
* **State Management:** React Built-in Hooks (Context API প্রয়োজন হলে)

---

*এই পরিকল্পনা অনুসরণ করলে ডাক্তার ড্যাশবোর্ডটি প্রফেশনাল, মেইনটেইনেবল এবং ভবিষ্যতের সুবিধার্থে এক্সটেন্ডেবল হবে।*