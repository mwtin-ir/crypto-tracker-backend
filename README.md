# macoin Server

این پروژه یک Backend Node.js با TypeScript است که برای اجرای سرور و ارائه API آماده شده و روی Render Free Tier قابل دپلوی است.  

> ⚠️ توجه: API اصلی این پروژه از سایت Wallex گرفته شده و تمامی حقوق مربوط به Wallex محفوظ است. این پروژه صرفاً برای اهداف آموزشی و توسعه شخصی ساخته شده است و استفاده تجاری بدون اجازه صاحب اثر مجاز نیست.

---

## 🔹 توضیح پروژه

- پروژه با Node.js + TypeScript و Express توسعه داده شده است.  
- از پکیج‌های اصلی مانند cors و dotenv برای مدیریت درخواست‌ها و متغیرهای محیطی استفاده شده است.  
- سرور کاملاً production-ready و آماده دپلوی روی Render است.  
- تمامی مسیرها و متغیرهای حساس، مانند URL API و PORT سرور، با متغیرهای محیطی (process.env) مدیریت می‌شوند.  

### ویژگی‌ها
- اجرای ساده روی Render Free Tier  
- استفاده از TypeScript برای ایمنی بیشتر کد و کاهش خطا  
- آماده‌سازی خروجی Build در مسیر dist/  
- Health Check Path استاندارد (/) برای بررسی سلامت سرور  
- Auto-Deploy از Git و مدیریت خودکار نسخه‌ها  

---

## 🔹 فایل‌ها و ساختار پروژه

- server.ts → فایل اصلی سرور و مسیرهای API  
- package.json → مدیریت Scripts و Dependencies  
- tsconfig.json → تنظیمات TypeScript  
- dist/ → خروجی Build TypeScript به JavaScript  

---
