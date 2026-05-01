# إعداد Firebase للنظام

تم نقل تخزين الشهادات من `localStorage` إلى Firebase حتى تعمل صفحة التحقق
من أي جهاز (الهدف من QR Code).

## 1) ملء بيانات الاتصال (مطلوب قبل أي تجربة)

افتح [public/assets/firebase-init.js](public/assets/firebase-init.js) واستبدل
القيم الموجودة بـ `REPLACE_WITH_...` بالقيم الحقيقية من:

Firebase Console → Project Settings → General → Your apps → Web app → Config

```js
var firebaseConfig = {
  apiKey: "...",
  authDomain: "ai-studio-applet-webapp-8abdf.firebaseapp.com",
  projectId: "ai-studio-applet-webapp-8abdf",
  storageBucket: "ai-studio-applet-webapp-8abdf.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

إذا لم يكن لديك تطبيق Web أنشئه من نفس صفحة Settings ثم انسخ بياناته.

## 2) تفعيل الخدمات في Firebase Console

- Build → Firestore Database → Create database (Production mode، الموقع الأقرب).
- Build → Storage → Get started → Production rules.

## 3) نشر القواعد + الموقع

```bash
npx firebase login
npx firebase use ai-studio-applet-webapp-8abdf
npx firebase deploy --only firestore:rules,storage:rules,hosting
```

الملفات المعنية:

- `firestore.rules` — قراءة عامة لمجموعة `certificates`، كتابة من الواجهة.
- `storage.rules` — قراءة عامة لمجلد `profileImages/`، كتابة بصور حتى 5MB.
- `firebase.json` — يربط القواعد بالنشر.

### 4. معاينة الموقع
- رابط الموقع الأساسي: `https://services-balady-gov-sa.online`
- رابط Firebase: `https://ai-studio-applet-webapp-8abdf.web.app` (أو الرابط الذي يظهر لك بعد الرفع)
- رابط صفحة التحقق: `https://services-balady-gov-sa.online/veir/services.balady.gov.sa/health/issue/PrintedLicenses?certNumber=...`

## 4) كيف يعمل الآن

- إنشاء شهادة في `/` يرفع الصورة إلى Storage ثم يحفظ المستند في Firestore.
- صفحة `/certificate?id=...` تقرأ المستند مباشرة من Firestore.
- صفحة `/veir/services.balady.gov.sa/health/issue/PrintedLicenses?certNumber=...`
  (التي يفتحها QR) تستعلم Firestore بحقل `certNumber` فتعرض الصورة والبيانات
  من أي جهاز.

## 5) ملاحظة أمنية

القواعد الحالية تسمح بالكتابة العامة (لتسهيل التشغيل بدون مصادقة). للإنتاج
يُستحسن:

- إضافة Firebase Authentication وحصر الكتابة على المسؤولين.
- تفعيل App Check.
