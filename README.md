# MediAccess – Complete Medicine Availability, OCR Scanning & Delivery Platform

MediAccess is a full-stack healthcare accessibility platform connecting patients, pharmacies, and courier delivery partners.

## 🚀 Key Features

### 👤 Phase 1: Patient / Consumer
- **Medicine Strip OCR Scanning**: Browser Canvas preprocessing (contrast slider, binarization) + real `Tesseract.js` OCR text extraction with fuzzy catalog matching.
- **26 Medicine Catalog**: Full search with name, generic name, category, strength, and suggestions.
- **Pharmacy Availability & Haversine Distance**: Shows stock, pricing, and exact distances across 6 local pharmacies.
- **Cart & Fulfillment**: Choose between Counter Pickup (`Reserve & Collect`) and `Home Delivery`.
- **5-Stage Visual Order Tracking**: Live tracking of preparation, driver pickup, and doorstep delivery with assigned driver contact details.

### 🏥 Phase 2: Pharmacy Store Manager
- **Inventory Management**: Real-time pricing updates, stock level adjustments, and availability toggling.
- **Incoming Reservations**: Approve or reject counter collection reservations.
- **Order Packaging**: Progress orders through *Confirm* → *Preparing* → *Ready for Delivery*.
- **Courier Linkage**: Live card displaying the assigned delivery fleet partner details upon job acceptance.

### 🛵 Phase 3: Delivery Fleet Partner
- **Open Jobs Marketplace**: Real-time pool of orders marked *Ready for Delivery*.
- **Atomic Job Acceptance**: Race-condition protected driver assignment.
- **Doorstep Handover**: Advance status to *Picked up from Pharmacy* and confirm GPS delivery (*Delivered*).
- **Earnings Ledger**: Tracks completed delivery trips and driver earnings.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, React Router
- **OCR Engine**: Tesseract.js with HTML5 Canvas image preprocessing
- **Backend**: Python 3.13, FastAPI, SQLAlchemy, Pydantic, PBKDF2-HMAC-SHA256 Auth
- **Database**: SQLite with persistent sample catalogue (26 medicines, 6 pharmacies, 4 accounts)
- **Firebase Project**: `medical-access-1f08e` (Sender ID: `408826039583`)

---

## 🏁 Quick Start

### 1. Automated Start (Windows)
Double click `start_all.bat` or run:
```bash
cmd /c start_all.bat
```
This starts both the FastAPI backend (`http://127.0.0.1:8000`) and Vite frontend (`http://localhost:5173`) in dedicated windows.

### 2. Manual Start

#### Backend:
```bash
# Activate virtual environment
.\venv\Scripts\activate

# Run FastAPI server
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API docs available at: `http://127.0.0.1:8000/docs`

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```
Web app available at: `http://localhost:5173`

---

## 🧪 Testing

Run the automated direct test suite covering all 3 interconnected phases:
```bash
npm run test
```
Or directly:
```bash
.\venv\Scripts\python backend/test_routes_direct.py
```

---

## 🔑 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Patient User** | `user@mediaccess.com` | `Password123!` |
| **Pharmacy Manager (Apollo)** | `apollo@mediaccess.com` | `Password123!` |
| **Pharmacy Manager (MedPlus)** | `medplus@mediaccess.com` | `Password123!` |
| **Delivery Fleet Partner** | `delivery@mediaccess.com` | `Password123!` |
