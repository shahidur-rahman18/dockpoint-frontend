# API Integration & Architecture Plan

এই ডকুমেন্টটি Dockpoint frontend-এ বর্তমান DocPoint Django backend-এর API যুক্ত করার পরিকল্পনা। এটি React 19, TypeScript ও Vite frontend এবং backend-এ বর্তমানে থাকা Django REST Framework + SimpleJWT contract ধরে লেখা। Backend-এর API বা authentication contract বদলালে এই পরিকল্পনাও হালনাগাদ করতে হবে।

## ১. বর্তমান backend contract

Backend-এর URL configuration এবং settings অনুযায়ী:

| কাজ | Method | Endpoint |
|---|---|---|
| Login, access ও refresh token পাওয়া | POST | `/api/accounts/login/` |
| Access token refresh | POST | `/api/accounts/token/refresh/` |
| নিজের profile দেখা/আপডেট | GET/PATCH/PUT | `/api/accounts/me/` |
| Password setup | POST | `/api/accounts/setup-password/` |
| Admin থেকে doctor তৈরি | POST | `/api/accounts/admin/doctors/create/` |
| Doctor API | Router endpoints | `/api/doctors/` |
| Appointment API | Router endpoints | `/api/appointments/` |
| Raw OpenAPI schema | GET | `/api/schema/` |

Doctor ও appointment-এর সুনির্দিষ্ট action/path এবং request/response schema OpenAPI document থেকে নিতে হবে। বর্তমানে আলাদা patient বা invoice endpoint দেখা যায়নি; `/api/accounts/me/` response-এ patient profile অন্তর্ভুক্ত থাকতে পারে। Backend-এ route যোগ না হওয়া পর্যন্ত patient/invoice service endpoint ধরে নেওয়া যাবে না।

## ২. HTTP client ও environment

* সব request একটি Axios instance (`src/api/apiClient.ts`) দিয়ে পাঠাতে হবে।
* `baseURL` Vite environment variable `VITE_API_BASE_URL` থেকে আসবে। এখানে backend origin রাখা হবে; endpoint path-এ `/api/...` থাকবে।
* `.env.development` ও deployment environment-এ API URL নির্ধারণ করা যাবে। `VITE_` prefix-যুক্ত মান browser bundle-এ প্রকাশিত হয়, তাই কোনো secret বা private key রাখা যাবে না।
* CORS-এ frontend origin অনুমোদিত থাকতে হবে। বর্তমান Bearer-token flow-তে cookie credentials প্রয়োজন নেই; `withCredentials: true` বা cookie-নির্ভর CSRF setup যোগ করা হবে না।

## ৩. বর্তমান authentication flow: Bearer token

Backend-এ বর্তমানে `JWTAuthentication` এবং SimpleJWT-এর default token views ব্যবহৃত হচ্ছে। Token HttpOnly cookie-তে দেওয়া হয় না; login response body থেকেই token নিতে হবে।

* Login request: `POST /api/accounts/login/`; SimpleJWT response-এর `access` ও `refresh` মান ব্যবহার করতে হবে.
* Protected request-এ `Authorization: Bearer <access-token>` header পাঠাতে হবে.
* Backend settings-এ access token lifetime 60 মিনিট, refresh token lifetime 1 দিন, refresh rotation enabled, `AUTH_HEADER_TYPES` `Bearer` হিসেবে নির্ধারিত। এগুলো backend configuration-নির্ভর; পরিবর্তন হলে frontend-এ hardcode করা যাবে না।
* Refresh request: `POST /api/accounts/token/refresh/` body-তে `{ "refresh": "<refresh-token>" }`। Rotation চালু থাকায় response-এ নতুন `refresh` token এলে সেটিও পুরোনোটির জায়গায় রাখতে হবে।
* Access token memory/React auth state-এ রাখতে হবে। Reload-এর পর session চালু রাখার প্রয়োজন হলে refresh token `sessionStorage`-এ রাখা যেতে পারে; এটি JavaScript থেকে পড়া যায় এবং XSS হলে চুরি হওয়ার ঝুঁকি আছে. Token-কে `localStorage`-এ না রাখাই এই পরিকল্পনার default। `Remember me`-এর দীর্ঘস্থায়ী আচরণ নির্ধারণের আগে এই সীমাবদ্ধতা বিবেচনা করতে হবে।
* XSS ঝুঁকি কমাতে untrusted HTML render এড়াতে/স্যানিটাইজ করতে হবে এবং Content Security Policy (CSP) বিবেচনা করতে হবে। Bearer token JavaScript-এ ব্যবহৃত হওয়ায় HttpOnly cookie-এর মতো XSS token theft protection দেয় না।

### 401, 403 এবং refresh recovery

* **401:** সাধারণ protected request-এ access token মেয়াদোত্তীর্ণ হলে refresh flow শুরু হবে। Login (`/api/accounts/login/`) ও refresh (`/api/accounts/token/refresh/`) request-কে automatic refresh interceptor থেকে বাদ দিতে হবে।
* একসঙ্গে একাধিক request 401 পেলে একটি refresh call চালাতে হবে; অন্য request-গুলো সেই ফলাফলের জন্য অপেক্ষা করবে। Refresh সফল হলে access এবং rotated refresh token আপডেট করে অপেক্ষমাণ original request-গুলো পুনরায় পাঠাতে হবে।
* প্রতিটি original request-এ retry marker রাখতে হবে: refresh-এর পরও সেটি 401 দিলে আর refresh চেষ্টা নয়—auth state পরিষ্কার করে login-এ পাঠাতে হবে।
* Refresh endpoint invalid/expired refresh token-এর জন্য 400/401 দিলে token ও user auth state পরিষ্কার করে login page-এ session expired বার্তা দেখাতে হবে।
* Network error, timeout বা 5xx হলে auth token/state মুছবে না; অপেক্ষমাণ request-গুলো error-সহ reject হবে এবং UI-তে retry-যোগ্য network/server error দেখাবে।
* Refresh ব্যর্থ হলে waiting queue-এর সব request reject করতে হবে; কোনো request অনির্দিষ্টকাল অপেক্ষা করবে না।
* Backend-এ বর্তমানে logout/revoke endpoint নেই। Frontend থেকে token মুছলে browser-side session শেষ হবে, কিন্তু server-side refresh token revoke নাও হতে পারে। Logout/revocation দরকার হলে backend endpoint ও token blacklist/revocation support আলাদা করে implement করতে হবে।
* **403:** access আছে কিন্তু permission নেই—logout বা refresh নয়; UI-তে Access Denied দেখাতে হবে।

## ৪. Cookie authentication: ভবিষ্যৎ backend enhancement

HttpOnly cookie authentication বর্তমান backend implementation নয়, তাই frontend API integration-এর acceptance criteria-তে অন্তর্ভুক্ত নয়। পরে এই পদ্ধতি নিতে চাইলে backend-এ token cookie set/clear, cookie attributes, CSRF token issuance/validation, CORS credentials এবং logout/revocation endpoint implement ও test করতে হবে। Frontend ও API origin browser-এর দৃষ্টিতে cross-site হলে deployment অনুযায়ী `SameSite=None; Secure` প্রয়োজন হতে পারে; provider আলাদা হওয়াই একমাত্র নির্ধারক নয়। HttpOnly cookie JavaScript-এ token পড়া আটকায়, কিন্তু XSS দিয়ে ব্যবহারকারীর হয়ে request পাঠানো আটকায় না।

## ৫. OpenAPI contract ও TypeScript type

* Backend-এ raw OpenAPI endpoint `/api/schema/`; Swagger UI webpage নয়, এই schema document `openapi-typescript`-এ input হবে।
* Endpoint-টি backend route-এ সংজ্ঞায়িত আছে; frontend implementation শুরুর আগে deployed backend থেকেও schema URL reachable কি না এবং OpenAPI document valid কি না যাচাই করতে হবে।
* Generated type backend schema-এর গুণমানের ওপর নির্ভরশীল; এগুলো runtime response validation নয়। Backend schema update হলে generation command চালিয়ে `src/types/schema.d.ts` refresh করতে হবে।

## ৬. TanStack Query policy

* Domain অনুযায়ী query key factory ব্যবহার করতে হবে; mutation success হলে প্রভাবিত query invalidate/update করতে হবে।
* Query-র জন্য সর্বোচ্চ 3টি retry (প্রথম চেষ্টার পরে) কেবল transient network error ও 5xx-এ; 4xx error retry নয়। Error response-এ HTTP status না থাকলে সেটিকে retry-যোগ্য কি না স্পষ্টভাবে নির্ধারণ করতে হবে।
* Mutation retry default-এ বন্ধ (`retry: false`) থাকবে, বিশেষত booking/create/payment-এর মতো operation-এ duplicate side effect ঠেকাতে। কোনো mutation retry করতে হলে backend idempotency guarantee/key থাকতে হবে।
* Query retry এবং Axios refresh flow আলাদা: 401 retry policy-এর মাধ্যমে নয়, auth interceptor-এর একবারের refresh-and-replay flow দিয়ে সামলাতে হবে।

## ৭. প্রস্তাবিত frontend structure

```text
src/
├── api/
│   ├── apiClient.ts
│   └── endpoints.ts
├── services/
│   ├── authService.ts
│   ├── accountService.ts       # /api/accounts/me/ ও account actions
│   ├── doctorService.ts
│   └── appointmentService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useDoctors.ts
│   └── useAppointments.ts
└── types/
    ├── schema.d.ts             # Generated from /api/schema/
    └── api.ts                  # Frontend-specific shared types
```

Backend-এ সংশ্লিষ্ট endpoint যোগ হওয়ার পরেই নতুন service (যেমন patient বা invoice) যোগ করতে হবে। বিদ্যমান auth context/mock login-কে real API auth-এ বদলানোর সময় route guards, login/logout UI এবং dashboard data surfaces-ও একই auth state ব্যবহার করছে কি না নিশ্চিত করতে হবে।

## ৮. বাস্তবায়নের ধাপ

1. Backend থেকে deployed API base URL এবং `/api/schema/` response যাচাই করা; OpenAPI-তে endpoint ও schema নিশ্চিত করা।
2. `axios`, `@tanstack/react-query` এবং dev dependency হিসেবে `openapi-typescript` যুক্ত করা; schema generation script যোগ করা।
3. `VITE_API_BASE_URL` environment config তৈরি করা; কোনো secret frontend env-এ না রাখা।
4. OpenAPI type generate করে endpoint/type mapping যাচাই করা।
5. Axios client, Bearer header, single-flight refresh queue, retry marker, explicit error handling implement করা.
6. Auth/account, doctor, appointment service-уудыг contract-এ থাকা API অনুযায়ী implement করা; TanStack Query provider, hooks ও query policies wire করা।
7. Mock login/data থেকে real API-তে surface-ভিত্তিক migration করে login, refresh, failed refresh, 403, logout, query retry, mutation non-retry এবং loading/error UI test করা।
