# DocPoint — Patient Management & Appointment Booking Plan

এই নথিতে DocPoint-এর patient registration, patient profile এবং appointment booking workflow-এর architecture review ও implementation plan রাখা হয়েছে। এটি পরিকল্পনা; এখানে বর্ণিত কাজ সম্পন্ন হয়েছে বলে ধরে নেওয়া যাবে না। ব্যবহারকারীর অনুমোদন ছাড়া কোনো implementation শুরু করা হবে না।

## লক্ষ্য

Patient যেন account তৈরি ও email verify করে dashboard-এ যেতে পারে, নিজের profile পরিচালনা করতে পারে, doctor খুঁজে appointment নিতে পারে এবং booking-এর জন্য আবশ্যক তথ্য অনুপস্থিত থাকলে তা booking flow-তেই দিতে পারে। Backend-এ validation ও permission enforce হবে; frontend validation শুধু ব্যবহারকারীর অভিজ্ঞতার জন্য।

## বর্তমান architecture পর্যালোচনা

### Backend

| ক্ষেত্র | বর্তমান অবস্থা |
|---|---|
| User | `CustomUser`-এ Admin, Doctor ও Patient role; email, নাম, phone, avatar ও `is_verified` আছে। |
| Patient profile | `PatientProfile` user-এর সঙ্গে OneToOne; DOB, gender, blood group, address ও emergency contact আছে। Patient user তৈরি হলে signal profile-ও তৈরি করে। |
| Registration | `POST /accounts/patient/signup/` email, password, optional first/last name ও phone নেয়। Account inactive/unverified তৈরি হয় এবং OTP পাঠানো হয়। |
| Email verification | `POST /accounts/patient/verify-email/` OTP যাচাই করে account active/verified করে এবং token দেয়। Email verification মানে demographic বা medical data verification নয়। |
| Patient profile API | `GET`, `PUT`, `PATCH /accounts/patient/profile/`; authenticated Patient নিজের profile-এ সীমাবদ্ধ। |
| Medical records | `GET/POST /accounts/patient/medical-history/` এবং record detail endpoint Patient-এর নিজের records-এ সীমাবদ্ধ। Medical history, profile-এর একটি field নয়; আলাদা `MedicalRecord` model। |
| Admin patient list | `GET /accounts/admin/patients/` patient user-এর সঙ্গে nested `patient_profile` পাঠায়; admin permission আছে। Admin create/detail endpoint দেখা যায়নি। |
| Appointment | Appointment-এ patient, doctor, date, time range, symptoms, fee ও status আছে। Patient booking-এ authenticated user patient হিসেবে বসে। Appointment endpoint admin-কে সব, patient-কে নিজের এবং doctor-কে নিজের appointment-গুলো দেয়। |
| Appointment validation | Serializer start/end time ও doctor-এর overlapping active appointment যাচাই করে। Profile completeness validation এবং concurrent booking-এর database-level protection নিশ্চিত নয়। |
| Appointment status | বর্তমান status: Pending, Confirmed, Cancelled, Completed। Rejected/No Show যোগ করতে model/API/UI/test পরিবর্তন লাগবে। |
| Chamber/schedule | Doctor availability ও chamber selection-এর পূর্ণ booking integration এই পর্যালোচনায় নিশ্চিত হয়নি; বাস্তব model/API যাচাই করে plan-এ অন্তর্ভুক্ত করতে হবে। |

### Frontend

| ক্ষেত্র | বর্তমান অবস্থা |
|---|---|
| Auth role | Frontend auth flow বর্তমানে Admin ও Doctor role সমর্থন করে; Patient role/session flow নেই। |
| Signup | বর্তমান signup page UI আছে, কিন্তু backend Patient signup/OTP-এর পূর্ণ flow হিসেবে যুক্ত নয়। |
| Patient dashboard | Patient dashboard route বর্তমানে placeholder। |
| Patient list | Admin patient list API ব্যবহার করে; search/sort/pagination ও basic fields দেখায়। |
| Patient profile | Patient-facing profile view/edit flow পাওয়া যায়নি। |
| Appointments | Admin/Doctor appointment UI এবং shared appointment API আছে; Patient-এর doctor-search-to-booking flow নেই। |
| API conventions | Shared Axios client, React Query hooks/services, typed API contracts এবং বিদ্যমান error/loading UI অনুসরণ করতে হবে। |

## Business rules — implementation-এর আগে নিশ্চিত করতে হবে

এই সিদ্ধান্তগুলো product/clinic policy; code দেখে একা নির্ধারণ করা যায় না।

1. **Booking-এর আগে আবশ্যক profile field:** প্রাথমিক প্রস্তাব—DOB, Gender ও Address clinic/service অনুযায়ী চাইতে হবে; Blood Group না জানা গেলে `Unknown / Not Tested` গ্রহণ করতে হবে। তবে প্রতিটি appointment-এ Blood Group বাধ্যতামূলক হবে কি না, clinic-এর clinical/legal requirement দিয়ে নিশ্চিত করতে হবে। কোনো তথ্য অনুমান করে পূরণ করা যাবে না।
2. **Phone:** account registration-এ পাওয়া phone-টি booking contact হিসেবে যথেষ্ট কি না, নাকি OTP/অন্যভাবে verify করতে হবে—সিদ্ধান্ত প্রয়োজন।
3. **Required field-এর scope:** সব service-এ একই নিয়ম হবে, নাকি appointment type/clinic অনুযায়ী পরিবর্তন হবে।
4. **Appointment approval:** patient booking-এর default status Pending নাকি Confirmed—বর্তমান approval policy অনুযায়ী নির্ধারণ করতে হবে।
5. **Appointment data:** Chamber, visit reason, consultation fee ও schedule কোন বিদ্যমান model/endpoint থেকে আসবে তা যাচাই করতে হবে।
6. **Profile completion tracking:** কোন field-গুলো completion-এর জন্য গণ্য হবে তা নির্ধারণ করতে হবে। সম্ভব হলে completion বর্তমান profile data থেকে derive করা হবে; শুধু percentage রাখার জন্য নতুন persisted field যোগ নয়।
7. **Doctor access:** Doctor কোন appointment status থেকে patient data দেখতে পারবে এবং Emergency Contact-এর মতো sensitive তথ্য কখন/কারা দেখতে পারবে।
8. **Patient account state:** OTP verify না করা পর্যন্ত login/booking বন্ধ থাকবে—এটি বর্তমান registration model-এর সঙ্গে সামঞ্জস্যপূর্ণ।
9. **Guardian booking:** প্রথম release-এ শুধু নিজের জন্য booking, নাকি guardian/অন্য রোগীর জন্যও booking—স্পষ্ট করতে হবে। Guardian support চাইলে patient ও booking actor আলাদা relationship হিসেবে model করতে হবে।
10. **Consultation scope:** Consultation notes, diagnosis, prescription ও lab orders কি এই release-এ, নাকি পরবর্তী clinical workflow phase-এ থাকবে।

## প্রস্তাবিত patient journey

1. Patient নাম, email, phone ও password দিয়ে account তৈরি করে।
2. Backend duplicate email ও password validation করে; inactive/unverified user তৈরি করে এবং signal-এ `PatientProfile` তৈরি হয়।
3. Patient email OTP verify করে; সফল verification-এর পর authenticated Patient session/dashboard-এ যায়।
4. Patient dashboard-এ profile completion reminder এবং doctor search/appointment entry point পায়। Profile সম্পূর্ণ করা booking-এর আগে বাধ্যতামূলক নয়, যতক্ষণ না কোনো booking-specific required field অনুপস্থিত।
5. Patient doctor/chamber/date/time বেছে নেয়।
6. Backend booking-এর জন্য প্রযোজ্য profile fields যাচাই করে। Missing/invalid হলে structured validation response দেয়; frontend existing profile data prefill করে শুধু প্রয়োজনীয় field চায়।
7. Patient তথ্য submit করলে backend profile update এবং appointment booking-কে নির্ধারিত নির্ভরযোগ্য transaction flow-তে পরিচালনা করে। Slot ইতোমধ্যে বুক হয়ে গেলে conflict জানায়; profile update সফল থাকলে সেটি নষ্ট না করে booking retry-এর সুযোগ দেয়।
8. সফল booking-এ policy অনুযায়ী status, confirmation ও patient dashboard-এ upcoming appointment দেখায়।
9. Doctor কেবল নিজের অনুমোদিত appointment/clinical relationship অনুযায়ী প্রয়োজনীয় patient তথ্য ও visit reason দেখে।
10. Appointment-এর পরে consultation data প্রয়োজন হলে আলাদা clinical records feature-এ যোগ হয়; PatientProfile ও Appointment-এ duplicate clinical history রাখা হয় না।

## Phase 1 — Architecture ও contract review

### কাজ

- Backend-এর User/PatientProfile/MedicalRecord/DoctorProfile/Appointment models, signals, migrations, serializers, views, permissions, URLs, tests এবং OpenAPI schema পুনরায় পরীক্ষা।
- Existing doctor list/detail, chamber/location, schedule/availability, appointment creation/list endpoint ও approval policy যাচাই।
- Frontend auth, signup/OTP components, routes, sidebar, dashboard layout, API client, React Query patterns, shared forms/tables এবং responsive conventions যাচাই।
- Patient endpoints-এর actual request/response contract ও generated frontend API types মিলিয়ে দেখা।
- উপরোক্ত business decisions owner-এর কাছ থেকে নিশ্চিত করা।

### Acceptance criteria

- Existing endpoint পুনর্ব্যবহার করা যাবে কি না এবং ঠিক কোন gap নতুন পরিবর্তন চায়—লিখিতভাবে চিহ্নিত।
- নতুন model/API ছাড়া কাজ সম্ভব হলে তা অগ্রাধিকার পাবে।
- প্রতিটি API permission ও field-level access লিখিতভাবে নির্দিষ্ট।

## Phase 2 — Backend Patient registration ও profile

### কাজ

- বিদ্যমান `PatientSignupSerializer`, `PatientSignupView`, OTP endpoints ও `PatientProfile` signal পুনর্ব্যবহার; প্রয়োজন ছাড়া parallel registration/profile model নয়।
- Registration-এ Full Name-কে বর্তমান first/last-name representation-এ নির্ভরযোগ্যভাবে map করা; email, phone, password এবং confirm-password UX/validation যোগ করা। Confirm password server-এ plaintext সংরক্ষণ নয়।
- Signup ও OTP verification-এর বর্তমান inactive → verified/active policy অক্ষুণ্ণ রাখা।
- Profile GET/PATCH-এ supported fields, validation এবং safe partial updates ব্যবহার করা।
- Blood Group-এর `Unknown / Not Tested` option গ্রহণ করলে model choice, serializer validation, migration/backfill এবং UI একই contract অনুযায়ী হালনাগাদ হবে; compatibility-র জন্য existing records যাচাই করতে হবে।
- Profile picture-এর জন্য নতুন patient-only storage field না বানিয়ে বিদ্যমান `CustomUser` avatar flow ব্যবহার করা যায় কি না যাচাই।
- Profile completion server/client-এ একই required-field policy থেকে derive করা; field/status আলাদা করে persist করা কেবল audit/business need থাকলে।

### Acceptance criteria

- Duplicate email প্রত্যাখ্যাত; password validator কার্যকর; confirm mismatch হলে signup ব্যর্থ।
- OTP ছাড়া Patient protected dashboard/API ব্যবহার করতে পারে না।
- User তৈরির পর ঠিক একটি PatientProfile থাকে।
- Patient নিজের profile-ই দেখতে/update করতে পারে।
- Empty/unknown Blood Group অনুমান করে পূরণ হয় না।

## Phase 3 — Patient auth, routing ও dashboard (Frontend)

### কাজ

- Frontend role/session union ও protected route-এ Patient যোগ; বিদ্যমান Admin/Doctor behavior অক্ষুণ্ণ রাখা।
- Patient registration → OTP verification → session establishment flow backend contract-এর সঙ্গে যুক্ত করা।
- Patient dashboard route placeholder-এর বদলে বাস্তব page করা।
- Dashboard-এ welcome, derived profile-completion indicator/reminder, doctor search/list entry, upcoming/history appointment sections ও notifications slot যোগ।
- Profile page/edit form-এ `GET/PATCH /accounts/patient/profile/` ব্যবহার; account fields ও PatientProfile fields আলাদা source-এ update।
- Existing shared form, loading, retry/error, toast/modal এবং responsive UI pattern অনুসরণ।
- Demo/mock data production API data-এর বিকল্প হিসেবে নীরবে ব্যবহার নয়।

### Acceptance criteria

- Patient role Admin/Doctor dashboard-এ প্রবেশ করতে পারে না; Admin ও Doctor route আগের মতো কাজ করে।
- Page refresh-এ বিদ্যমান auth/session policy অনুযায়ী session সঠিকভাবে restore বা sign-in redirect হয়।
- Profile reminder বাস্তব profile data-র সঙ্গে মেলে।

## Phase 4 — Doctor search, availability ও appointment booking

### Backend কাজ

- বিদ্যমান doctor ও appointment API পুনর্ব্যবহার; নতুন chamber/schedule API শুধু architecture review-এ ঘাটতি নিশ্চিত হলে।
- Appointment create-এর সময় backend-এ Patient role, profile completeness (service policy অনুযায়ী), doctor/chamber validity, date/time range, schedule/availability, fee ও status validate।
- Concurrent double booking বন্ধ করতে transaction ও উপযুক্ত database constraint/locking strategy যাচাই; শুধু application-level `exists()` check-কে যথেষ্ট ধরা নয়।
- Appointment create response-এ booking status ও confirmation-এর জন্য প্রয়োজনীয় তথ্য ফেরত।
- Profile data বদলালে পুরোনো Appointment-এর snapshot দরকার কি না সিদ্ধান্ত। দরকার হলে স্পষ্ট snapshot fields যোগ; অন্যথায় appointment-এ profile data duplicate নয়।

### Frontend কাজ

- Doctor list, name search, specialty filter, detail, chamber/date/time selection।
- Availability API-তে পাওয়া slot-ই selectable দেখানো; booking submit-এর সময় server conflict সামলানো।
- Required patient তথ্য অনুপস্থিত থাকলে accessible popup/form-এ current profile prefill; শুধু missing/invalid field দেখানো।
- Popup বন্ধ/প্রয়োজনীয় তথ্য বাদ দিলে booking request হবে না; Blood Group unknown option business policy অনুযায়ী।
- Profile update/booking-এর মাঝপথে network বা slot conflict হলে তথ্য হারানো ছাড়াই স্পষ্ট retry path; duplicate appointment তৈরি নয়।
- Success/confirmation page ও patient dashboard refresh/invalidation।

### Acceptance criteria

- সম্পূর্ণ profile হলে unnecessary popup নেই।
- Incomplete profile হলে server-side validation booking আটকে দেয় এবং frontend প্রয়োজনীয় field-ই চায়।
- একই slot-এ concurrent booking-এর একটিই সফল হয়; অন্য request conflict পায়।
- Doctor unavailable বা invalid slot backend থেকে প্রত্যাখ্যাত।
- Existing Admin/Doctor appointment workflow regression ছাড়া কাজ করে।

## Phase 5 — Appointment details ও Doctor patient access

### কাজ

- Appointment details-এ patient name, DOB/age (প্রযোজ্য হলে), gender, blood group, phone, address, visit reason, date/time দেখানো।
- Emergency Contact কেবল অনুমোদিত clinical/operational role-এ প্রকাশ।
- Backend permission-এ Doctor কেবল নিজের সংশ্লিষ্ট appointment-এর patient data পাবে; অন্য doctor/patient ID দিয়ে access ব্যর্থ।
- Admin-এর বিদ্যমান role policy বজায়; প্রয়োজনের অতিরিক্ত sensitive fields response-এ না পাঠানো।
- Doctor dashboard-এ Patient Details view, loading/error/empty state।

### Acceptance criteria

- Patient নিজের তথ্য, Admin অনুমোদিত admin view, Doctor শুধু নিজের appointment-সম্পর্কিত তথ্য দেখে।
- Direct URL/API access-এও backend permission প্রযোজ্য; frontend route guard-এ নির্ভর নয়।

## Phase 6 — Status lifecycle ও পরবর্তী clinical scope

### Appointment status

- বর্তমান Pending/Confirmed/Cancelled/Completed lifecycle অক্ষুণ্ণ রাখা।
- Rejected/No Show যোগ করার আগে state transitions, actor permission, timestamps/reason ও migration/backward compatibility নির্দিষ্ট করা।
- Patient/Doctor/Admin কারা কোন transition করতে পারবে তা backend-এ enforce এবং UI-তে একইভাবে দেখানো।

### পরবর্তী release-এ আলাদা রাখা যেতে পারে

- Consultation notes, diagnosis, prescription, lab orders/results, follow-up recommendation।
- এগুলো MedicalRecord-এ জোর করে ঢোকানো নয়; clinical relationship, authorship, audit, access ও versioning প্রয়োজন অনুযায়ী আলাদা design।
- Insurance/transactions/payment এবং guardian/booking-on-behalf flow।

## Security ও privacy requirements

- Backend permission-ই security boundary; frontend route/menu কেবল UX।
- Patient object ID বদলে অন্যের profile/record পড়া বা update করা যাবে না।
- Doctor-এর patient data access appointment/clinical responsibility দিয়ে সীমিত।
- Sensitive fields প্রয়োজন ছাড়া list/detail response-এ পাঠানো যাবে না।
- Error response-এ password, OTP বা sensitive health data log/echo নয়।
- Profile/appointment/clinical data access ও গুরুত্বপূর্ণ mutation audit করার প্রয়োজন policy অনুযায়ী নির্ধারণ।
- Transport, storage, backup, retention, consent এবং breach obligations deployment location-এর প্রযোজ্য আইন/নীতিমালা অনুযায়ী পর্যালোচনা; এই technical plan আইনি পরামর্শ নয়।

## Phase 7 — Testing

### Backend tests

- Patient signup validation: duplicate email, invalid email, password policy, confirm mismatch।
- OTP: correct, expired, reused/invalid code; verified state ও token behavior।
- Auto profile creation একবারই; profile API Patient-only ও own-resource-only।
- Profile field validation ও Blood Group unknown handling।
- Appointment required information missing/invalid response।
- Doctor/chamber/schedule/slot validation; double booking এবং concurrent conflict।
- Appointment status transitions ও role permissions।
- Doctor-এর own appointment access বনাম অন্য Doctor-এর appointment access।
- Existing Admin/Doctor tests regression।

### Frontend tests

- Registration/OTP/error/resend states এবং Patient route guarding।
- Profile load/edit/save ও completion reminder।
- Doctor search/filter/detail/availability এবং booking form validation।
- Complete profile-এ no popup; incomplete profile-এ prefill/missing-only fields।
- Popup dismissal, invalid response, network error, slot conflict ও retry।
- Patient dashboard upcoming/history state এবং Doctor patient detail authorization UX।
- Responsive layout ও accessibility: keyboard dialog, labels, focus, errors।

## Phase 8 — Documentation ও delivery

- Backend endpoint request/response/permission OpenAPI schema-তে হালনাগাদ।
- Frontend generated API types বিদ্যমান project command/pattern অনুযায়ী regenerate।
- Patient journey, appointment state transition, profile completeness rule ও field access policy নথিভুক্ত।
- Migration, rollout, demo data, environment/CORS এবং rollback notes যোগ—শুধু পরিবর্তিত contract থাকলে।
- Targeted backend tests, frontend typecheck/build ও relevant UI/API tests চালিয়ে ফল নথিভুক্ত।

## প্রস্তাবিত delivery order

1. Phase 1 review এবং business decisions নিশ্চিত।
2. Patient signup/OTP ও Patient auth/routing।
3. Profile read/edit এবং Patient dashboard।
4. Doctor search/availability ও backend booking validation।
5. Missing-information booking form এবং confirmation।
6. Doctor appointment patient details ও permission checks।
7. Status extensions/consultation workflow কেবল আলাদা অনুমোদিত scope হিসেবে।

প্রতিটি ধাপের আগে সংশ্লিষ্ট পরিবর্তনের তালিকা ও acceptance criteria পর্যালোচনা করতে হবে। কোনো phase-এ model/API change প্রয়োজন না হলে বিদ্যমান architecture-এ implementation-কে অগ্রাধিকার দিন।
