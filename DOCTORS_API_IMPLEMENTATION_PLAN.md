# ডাক্তার তালিকা API সংযোগের ধাপে ধাপে পরিকল্পনা

## কোন পদ্ধতিটি ভালো

একবারে পুরো API architecture তৈরি না করে, ছোট ধাপে বাস্তবায়ন করাই এই কাজের জন্য ভালো। প্রথমে backend response নিশ্চিত করে তালিকা দেখানো হবে; তারপর তৈরি, সম্পাদনা ও মুছে ফেলার কাজ API-তে যুক্ত হবে। এতে প্রতিটি ধাপ আলাদাভাবে যাচাই করা যাবে।

## বর্তমান অবস্থা

- ধাপ ১–৪ সম্পন্ন: backend response যাচাই, typed list service ও mapper, React Query provider/hook এবং API-ভিত্তিক doctor list যুক্ত হয়েছে।
- `src/components/doctors/DoctorList.tsx` এখন API data ব্যবহার করে; search, filter, sort, grid/table view এবং client-side pagination বজায় আছে।
- তালিকায় API-র নাম, qualification, specialization, phone, email, fee ও availability দেখানো হয়। Chamber address কেবল doctor details page-এর জন্য data model-এ থাকে, list UI-তে দেখানো হয় না। API avatar না দেওয়ায় placeholder icon দেখানো হয়; date বা অন্য mock value ব্যবহার হয় না।
- Table বা card-এর পুরো row/card clickable নয়; শুধু avatar বা placeholder icon doctor details page খোলে।
- Loading, empty, error ও retry state আছে; API ব্যর্থ হলে mock data fallback হয় না।
- Edit/Delete menu-র action API mutation যুক্ত না হওয়া পর্যন্ত disabled; local mock array-এ সফল পরিবর্তনের ভান করা হয় না।
- `src/api/apiClient.ts`-এ shared Axios client আছে।
- `src/main.tsx`-এ `QueryClientProvider` চালু আছে এবং `src/hooks/useDoctors.ts` doctors query পরিচালনা করে।
- Local backend response ও schema-তে `user_details.first_name` এবং `user_details.last_name` যাচাই করা হয়েছে; generated OpenAPI types-এও সেগুলো আছে।
- Live API data-তে কিছু ডাক্তারের নাম ফাঁকা; সে ক্ষেত্রে UI email-কে নাম হিসেবে ব্যবহার না করে “Name not provided” দেখায়।

## ধাপে ধাপে বাস্তবায়ন

### ধাপ ১ — live API response ও তালিকার নাম নিশ্চিত করা (সম্পন্ন)

Backend চালু হলে `GET /api/doctors/`-এর authenticated response এবং `/api/schema/` যাচাই করতে হবে। বিশেষ করে:

- `user_details`-এ নাম বা display name আসে কি না
- request-এর জন্য admin role প্রয়োজন কি না
- `ordering`-এ কোন field সমর্থিত
- response সব ডাক্তার দেয়, নাকি pagination আছে

নামের field response-এ না থাকলে backend-এ সেটি যোগ করার সিদ্ধান্ত নিতে হবে। শুধু email-কে নাম হিসেবে দেখানো বা কাল্পনিক নাম বানানো হবে না।

### ধাপ ২ — typed service ও UI mapping (সম্পন্ন)

`src/services/doctorService.ts`-এ `GET /api/doctors/`-এর typed function যোগ হবে এবং বিদ্যমান `apiClient` ব্যবহার করবে। API response-কে বর্তমান `DoctorListItem` UI shape-এ একটি পৃথক mapper দিয়ে রূপান্তর করা হবে। নামের field এবং avatar-এর উৎস ধাপ ১-এ নিশ্চিত না হওয়া পর্যন্ত mapper চূড়ান্ত করা যাবে না।

### ধাপ ৩ — React Query চালু করা (সম্পন্ন)

`src/main.tsx`-এ একবার `QueryClientProvider` বসিয়ে project-এর query client চালু করতে হবে। `useDoctors` hook এবং doctors query key যোগ হবে। query key-তে API-তে পাঠানো search/filter parameter থাকলে সেগুলোও রাখতে হবে।

### ধাপ ৪ — doctor list-কে API data-তে বদলানো (সম্পন্ন)

`DoctorList.tsx` থেকে mock তালিকার নির্ভরতা সরিয়ে hook-এর ফল দেখাতে হবে। বর্তমান grid/table, অনুসন্ধান, filter, sort এবং pagination বজায় রাখতে হবে। API response-এ pagination না থাকলে বর্তমান client-side pagination রাখা যাবে; backend pagination থাকলে page parameter API-তে পাঠাতে হবে।

Loading, empty, error এবং retry state যোগ করতে হবে। API ব্যর্থ হলে mock data-কে বিকল্প হিসেবে দেখানো যাবে না।

### ধাপ ৫ — mutation-গুলোর local mock আচরণ সরানো

Backend schema-তে doctor create (`POST /api/doctors/`), update (`PATCH`/`PUT /api/doctors/{id}/`) ও delete (`DELETE /api/doctors/{id}/`) operation আছে। তবে বর্তমান admin create flow `/api/accounts/admin/doctors/create/` ব্যবহার করে। কোন create path-টি তালিকার UI-тай ব্যবহার হবে তা backend permission/contract যাচাই করে স্থির করতে হবে.

Edit/delete সফল হলে doctors query invalidate করে backend থেকে তালিকাটি আবার আনতে হবে। API mutation যুক্ত না হওয়া পর্যন্ত local mock array পরিবর্তনকে সফল edit/delete হিসেবে দেখানো যাবে না। বর্তমান edit drawer-এর field-গুলো backend-এর field-এর সঙ্গে মেলে কি না, সেটিও mutation যুক্ত করার সময় যাচাই করতে হবে।

### ধাপ ৬ — সর্বশেষ ডেটা ও যাচাই

- doctors page খোলার সময় API থেকে ডেটা আনতে হবে।
- browser tab-এ ফিরে এলে background refetch চালু রাখতে হবে।
- create/update/delete সফল হলে তালিকা invalidate ও refetch করতে হবে।
- শুরুতে নিয়মিত polling দরকার নেই; তাৎক্ষণিক live update আবশ্যক হলে পরে backend-সমর্থিত polling বা push পদ্ধতি বেছে নেওয়া যাবে।
- বর্তমান schema-তে `updated_at` নেই। তাই “সর্বশেষ পরিবর্তিত ডাক্তার আগে” দেখানোর ক্রম backend field ও `ordering` সমর্থন নিশ্চিত না করে যোগ করা যাবে না। এখানে “সর্বশেষ ডেটা” বলতে backend থেকে সদ্য আনা তালিকার তথ্য বোঝাবে।

## গ্রহণযোগ্যতার শর্ত

- `/doctors` পেজ mock list নয়, `GET /api/doctors/`-এর response দেখায়।
- নামসহ UI-তে প্রয়োজনীয় field-গুলোর সঠিক উৎস backend response-এ নিশ্চিত।
- loading, empty, error/retry state কাজ করে; API error-এ mock fallback হয় না।
- search/filter/sort/pagination backend response-тай সঠিকভাবে কাজ করে।
- create/update/delete API-তে সফল হলে তালিকায় পরিবর্তন দেখা যায়; ব্যর্থ হলে সফলতার মতো UI দেখায় না।
- তৈরি করা পরিবর্তনের পর TypeScript build এবং সংশ্লিষ্ট পরীক্ষা সফল হয়।

সম্পর্কিত সামগ্রিক API পরিকল্পনা: `API_INTEGRATION_PLAN.md`।
