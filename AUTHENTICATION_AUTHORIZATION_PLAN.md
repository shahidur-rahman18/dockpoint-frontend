# Authentication & Authorization Implementation Plan

এই ডকুমেন্টে DocPoint-এর backend-first authentication, authorization এবং frontend session restore কাজ ধাপে ধাপে নির্ধারণ করা হয়েছে। লক্ষ্য হলো browser reload-এর পর বৈধ session বজায় রাখা, refresh token-কে JavaScript থেকে অপ্রাপ্য রাখা এবং API-তে role ও resource access backend থেকে enforce করা।

এই পরিকল্পনা frontend ও `E:\Django\docpoint_backend` Django backend—দুটোর জন্য প্রযোজ্য। এটি পরিকল্পনা; কোনো ধাপ সম্পন্ন হয়েছে বলে ধরে নেওয়া যাবে না। প্রতিটি ধাপের acceptance criteria ও test সফল হলে তবেই পরের ধাপে যাওয়া হবে।

## বর্তমান অবস্থা (২০২৬-১০-১৪)

Backend source এবং frontend auth implementation পর্যালোচনা করে পাওয়া অবস্থা:

| বিষয় | বর্তমান অবস্থা |
|---|---|
| Backend role | `Admin`, `Doctor`, `Patient` (`CustomUser.Role`); `Customer` নামে role দেখা যায়নি। |
| Backend login | SimpleJWT-এর default login endpoint access ও refresh token JSON-এ ফেরত দেয়। |
| Backend refresh | SimpleJWT-এর default refresh endpoint JSON body-তে refresh token নেয়। |
| Token lifetime ও rotation | Access token ৬০ মিনিট, refresh token ১ দিন; refresh rotation এবং rotation-এর পরে blacklist করার setting enabled। |
| Token blacklist app | `INSTALLED_APPS`-এ `rest_framework_simplejwt.token_blacklist` দেখা যায়নি। তাই blacklist setting বাস্তবে কার্যকর কি না, migration-সহ যাচাই করতে হবে। |
| Cookie auth ও logout | Login/refresh-এ HttpOnly refresh cookie এবং logout/revocation endpoint দেখা যায়নি। |
| CORS/CSRF | নির্দিষ্ট CORS origin আছে; cookie credentials enablement ও cookie refresh/logout-এর CSRF flow দেখা যায়নি। |
| Frontend session | Access/refresh token এবং role React state/module memory-তে থাকে; reload-এর পর session restore নেই। |
| Frontend protected route | Admin ও Doctor dashboard route guard আছে; guard role/session পায় না হলে sign-in-এ redirect করে। |
| Dashboard scope | Frontend-এ Admin ও Doctor dashboard আছে। Patient backend role হলেও Patient dashboard/API scope আলাদাভাবে যাচাই করতে হবে। |

## লক্ষ্য authentication contract

* Login এবং সফল password setup response-এ access token থাকবে; refresh token শুধু `HttpOnly` cookie-তে থাকবে।
* Frontend access token শুধু memory-তে রাখবে। Refresh token `localStorage`, `sessionStorage`, JavaScript-readable cookie, URL বা response body-তে রাখা হবে না।
* Refresh endpoint cookie থেকে refresh token নিয়ে access token দেবে এবং rotation চালু থাকলে নতুন refresh token একই cookie-তে সেট করবে।
* Logout endpoint refresh token revoke/blacklist করবে এবং refresh cookie expire/clear করবে।
* `/api/accounts/me/` থেকে role পুনরায় যাচাই করে frontend session তৈরি হবে।
* Backend API-ই authorization-এর নিরাপত্তা boundary। Frontend route guard কেবল UX স্তর; সরাসরি API request-এও backend permission enforce করতে হবে।

## ধাপ ১ — Backend authentication contract

**কাজ**

1. SimpleJWT default login/refresh views-এর বদলে প্রয়োজনমতো custom views/serializers যোগ করে নির্ধারিত response contract implement করা।
2. Login-এ access token response body-তে দেওয়া এবং refresh token `HttpOnly` cookie-তে সেট করা। Response body-তে refresh token না থাকা নিশ্চিত করা।
3. Refresh endpoint cookie থেকে token পড়া, validity যাচাই করা এবং নতুন access token ফেরত দেওয়া। Rotation হলে rotated refresh token cookie-তে বসানো।
4. Logout endpoint যোগ করা: cookie-র refresh token blacklist/revoke করা, cookie clear করা এবং invalid/missing token-এর আচরণ নির্ধারণ করা।
5. Password setup-এর সফল flow-তে doctor-কে login করানোর বর্তমান উদ্দেশ্য বজায় রেখে access token body-তে এবং refresh token cookie-তে দেওয়া।
6. Token blacklist dependency, `INSTALLED_APPS`, migration এবং deployed database migration status যাচাই করে token revoke/rotation যেন বাস্তবে কাজ করে তা নিশ্চিত করা।

**Acceptance criteria**

* Login ও password setup response-এ `access` আছে, `refresh` নেই।
* Refresh ও logout cookie থেকে refresh token ব্যবহার করে; client-কে refresh token JSON body-তে পাঠাতে হয় না।
* সফল rotation-এ পুরোনো refresh token আর ব্যবহারযোগ্য নয় এবং cookie-তে নতুন refresh token থাকে।
* Logout-এর পর cookie-র token আর refresh করতে পারে না এবং response-এ cookie clear হয়।
* Existing endpoint contract বদলালে OpenAPI schema ও generated frontend types আপডেট করার প্রয়োজন নথিভুক্ত থাকে।

## ধাপ ২ — Backend cookie, CSRF, CORS ও token security

**কাজ**

1. Refresh cookie-তে `HttpOnly=True`, production-এ `Secure=True`, উপযুক্ত `SameSite`, path এবং প্রয়োজন ছাড়া domain সেট না করা।
2. Local development ও production configuration আলাদা রাখা। Production-এ HTTPS বাধ্যতামূলক; local HTTP-তে secure-cookie setting পরিবেশ অনুযায়ী নির্ধারণ করতে হবে।
3. Frontend ও API একই-site নাকি cross-site—বাস্তব deployment origin দেখে সিদ্ধান্ত নেওয়া। Cross-site দরকার হলে `SameSite=None; Secure`, credentialed CORS এবং browser third-party-cookie সীমাবদ্ধতা বিবেচনা করতে হবে। সম্ভব হলে একই-site deployment অগ্রাধিকার।
4. Credentialed CORS-এ শুধু নির্দিষ্ট frontend origin allow করা; wildcard origin ব্যবহার না করা। Frontend request-এ credentials পাঠানোর contract নির্ধারণ করা।
5. Cookie-নির্ভর refresh/logout POST-এ CSRF protection যোগ করা। CSRF token পাওয়ার endpoint/প্রক্রিয়া এবং frontend header-এ পাঠানোর নিয়ম নির্ধারণ ও নথিভুক্ত করা। `SameSite`-কে একমাত্র CSRF প্রতিরক্ষা হিসেবে ধরা যাবে না।
6. Access/refresh lifetime ও refresh rotation policy বর্তমান ৬০ মিনিট/১ দিনের মান থেকে প্রয়োজন অনুযায়ী যাচাই করা; কারণ ছাড়া policy বদলানো নয়।
7. Cookie expiry, JWT expiry এবং blacklist expiry একে অন্যের সঙ্গে সামঞ্জস্যপূর্ণ কি না যাচাই করা।

**Acceptance criteria**

* Browser-এ cookie attributes প্রত্যাশামতো দেখা যায়; production refresh cookie JavaScript দিয়ে পড়া যায় না।
* অনুমোদিত origin থেকে credentials-সহ request কাজ করে; অজানা origin প্রত্যাখ্যাত হয়।
* CSRF token ছাড়া refresh/logout request প্রত্যাখ্যাত হয় এবং বৈধ CSRF token-সহ request সফল হয়।
* Local ও production settings আলাদা এবং deploy করা সম্ভব; production cookie-তে `Secure` বন্ধ থাকে না।

## ধাপ ৩ — Backend automated testing এবং API verification

আগের ধাপের backend contract ও security পরিবর্তনের জন্য automated tests লিখতে হবে। Swagger/Postman দিয়ে smoke test করা যেতে পারে, কিন্তু browser cookie, CORS ও CSRF আচরণ automated/browser verification-ও করতে হবে।

**অবশ্যই পরীক্ষা**

* সঠিক credential-এ login: access response, refresh cookie attributes, response-এ refresh token অনুপস্থিত।
* ভুল credential-এ login: সঠিক error; কোনো authentication cookie set নয়।
* Cookie ছাড়া/invalid/expired refresh: প্রত্যাখ্যাত; access token তৈরি নয়।
* Valid refresh: নতুন access token; rotation হলে নতুন cookie এবং পুরোনো refresh token revoke।
* Logout: token blacklist/revoke ও cookie clear; একই cookie দিয়ে পরবর্তী refresh ব্যর্থ।
* Password setup success/failure: role/activation validation অপরিবর্তিত; success-এ একই access/cookie contract।
* Missing/invalid CSRF token এবং অনুমোদিত/অননুমোদিত CORS origin।
* Blacklist migrations ও database-backed blacklist behavior।

**Gate:** এই ধাপের automated backend tests সফল এবং browser-origin/cookie smoke test যাচাই না হওয়া পর্যন্ত frontend auth contract migrate করা হবে না।

## ধাপ ৪ — Role-based authorization audit ও tests

**কাজ**

1. Backend-এর accounts, doctors ও appointments route-গুলোর প্রতিটি action-এর permission class এবং object-level permission audit করা।
2. Role matrix লিখে প্রত্যেক endpoint/action-এ Admin, Doctor, Patient-এর অনুমোদিত/নিষিদ্ধ কাজ চিহ্নিত করা। বর্তমান code-এ পাওয়া role-ই ব্যবহার করতে হবে; `Customer` role বা Patient dashboard API আছে ধরে নেওয়া যাবে না।
3. Admin-only endpoint অন্য role-কে প্রত্যাখ্যান করে কি না যাচাই করা।
4. Doctor/Patient নিজস্ব profile ও appointment-এ সীমাবদ্ধ কি না এবং অন্য user-এর object ID দিয়ে অননুমোদিত data দেখা/পরিবর্তন ঠেকানো হয়েছে কি না পরীক্ষা করা।
5. Anonymous, authenticated-but-wrong-role এবং authorized user—এই তিন অবস্থার test প্রত্যেক protected action-এর জন্য লেখা।
6. API permission-এর পাশাপাশি queryset filtering/data ownership যাচাই করা; শুধু frontend route hide করে authorization সম্পন্ন হয়েছে বলে ধরা যাবে না।

**Acceptance criteria**

* প্রতিটি protected endpoint-এর প্রত্যাশিত role matrix ও tests আছে।
* Wrong-role, anonymous ও অন্য user-এর object access backend থেকে deny হয়।
* Frontend route guard bypass করেও protected API/data access করা যায় না।

## ধাপ ৫ — Frontend session restore ও token lifecycle

Backend ধাপ ১–৪-এর contract ও tests সফল হওয়ার পরে শুরু হবে।

**কাজ**

1. Auth provider-এ `loading`, `authenticated`, `unauthenticated` অবস্থা যোগ/পরিষ্কার করা; app initialization চলাকালে protected route-এ sign-in redirect না করা।
2. App চালুর সময় cookie-সহ refresh call করে access token পাওয়া; তারপর Bearer token দিয়ে `/api/accounts/me/` call করে role/session restore করা।
3. Access token memory-তে রাখা; refresh token frontend state, storage বা readable cookie-তে না রাখা।
4. API client-এ cookie credentials ও CSRF header backend contract অনুযায়ী যুক্ত করা।
5. Access token expiry/401-এ একটিমাত্র refresh request চালানো; concurrent 401 request অপেক্ষা করানো; refresh সফল হলে original request একবার replay করা।
6. Refresh invalid/expired হলে auth state পরিষ্কার করে role-উপযুক্ত sign-in route-এ পাঠানো। Network/5xx failure-কে invalid session হিসেবে ভুল শ্রেণিবদ্ধ না করে error দেখানো এবং retry সম্ভব রাখা।
7. Logout API call, backend revoke/cookie clear, frontend memory clear এবং protected route redirect-কে একই flow-তে wire করা।
8. Axios login/refresh/logout request-এ interceptor recursion, duplicate refresh, infinite retry ও unresolved pending request না হয় তা নিশ্চিত করা।

**Acceptance criteria**

* Valid cookie থাকলে page reload বা direct dashboard URL-এ session restore হয় এবং role/profile load হয়; loading চলাকালে ভুল sign-in flash দেখা যায় না।
* Invalid/expired cookie-তে session restore ব্যর্থ হয়ে sign-in হয়।
* Access token memory-র বাইরে persist হয় না; refresh token frontend JavaScript থেকে পড়া যায় না।
* Concurrent expired-token request-এ একটিমাত্র refresh হয়; replay-এর পরও 401 এলে loop হয় না।
* Logout-এর পর refresh cookie ও in-memory auth state দুটোই শেষ হয়।

## ধাপ ৬ — Frontend role-protected routes

**কাজ**

1. Existing Admin/Doctor guards-কে auth initialization state-aware করা।
2. Admin account শুধু Admin dashboard/route, Doctor account শুধু Doctor dashboard/route-এ যেতে পারে; wrong-role route home path-এ ফেরে।
3. Login destination/state ফেরত নেওয়া আচরণ role validation পাশ করার পরই অনুমোদন করা।
4. Patient dashboard frontend scope-এ আছে কি না নিশ্চিত না হওয়া পর্যন্ত Patient dashboard route তৈরি করা হবে না। তবে backend Patient API permission tests ধাপ ৪-এ অন্তর্ভুক্ত থাকবে।
5. 401 (session absent/expired) এবং 403 (authenticated, permission denied) আলাদা UI handling করা; 403-এ স্বয়ংক্রিয় logout/refresh নয়।

**Acceptance criteria**

* Anonymous user protected path-এ গেলে restore চেষ্টা শেষে sign-in-এ যায়।
* Authenticated wrong-role user restricted dashboard দেখতে পায় না।
* Direct URL, browser refresh এবং in-app navigation-এ একই ফল হয়।
* Backend API permission frontend guard bypass করেও অটুট থাকে।

## ধাপ ৭ — Full frontend/backend end-to-end verification

Admin ও Doctor UI-তে, এবং backend API test-এ তিনটি বর্তমান role—Admin, Doctor, Patient—প্রযোজ্য জায়গায় পরীক্ষা করতে হবে। Patient-এর frontend dashboard যুক্ত করা এই পরিকল্পনার পূর্বশর্ত নয়।

| Scenario | প্রত্যাশিত ফল |
|---|---|
| Admin login → admin dashboard → reload | Admin session restore; sign-in page নয় |
| Doctor login → doctor dashboard → reload | Doctor session restore; sign-in page নয় |
| Browser-এ protected URL সরাসরি খোলা | Cookie বৈধ হলে restore; নইলে sign-in |
| Access token expired | Cookie refresh সফল; API request একবার replay |
| Refresh expired/revoked/blacklisted | Session clear; sign-in |
| Logout → পুরোনো cookie দিয়ে refresh | Refresh প্রত্যাখ্যাত; cookie clear |
| Wrong-role dashboard/API access | Frontend redirect এবং backend 403/উপযুক্ত denial |
| Doctor/Patient অন্যের restricted object access | Backend প্রত্যাখ্যান |
| Network/5xx during restore/refresh | স্পষ্ট retry-যোগ্য error; ভুলভাবে user logout নয় |
| Password setup success | Doctor token/cookie contract অনুযায়ী sign-in বা session establish |
| Disallowed origin বা missing CSRF token | Browser/API request প্রত্যাখ্যাত |

**সম্পূর্ণ কাজের acceptance:** backend tests, frontend build/targeted tests এবং browser end-to-end scenarios সফল; OpenAPI schema/types নতুন auth response-এর সঙ্গে মেলে; local ও production deployment settings পর্যালোচিত।

## কাজের নিয়ম ও অগ্রগতি

* ক্রম অপরিবর্তিত: **Backend authentication → Backend security → Backend testing → RBAC audit/testing → Frontend auth/session restore → Frontend routes → Full testing**।
* প্রতি ধাপে কাজ শুরুর আগে বিদ্যমান behavior ও tests যাচাই করতে হবে; অপ্রাসঙ্গিক refactor নয়।
* কোনো ধাপের acceptance criteria পূরণ না হলে পরের ধাপে না গিয়ে ব্যর্থতা ও blocker নথিভুক্ত করতে হবে।
* API response/endpoint পরিবর্তনে backend OpenAPI schema এবং frontend generated types একই contract-এ আপডেট করতে হবে।
* কাজ সম্পন্ন হলে উপরের status ও তারিখ বাস্তব test result অনুযায়ী হালনাগাদ করতে হবে; অনুমান করে “সম্পন্ন” লেখা যাবে না।
