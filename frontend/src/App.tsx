import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';


import { HomePage } from './pages/HomePage';
import { ScanMedicinePage } from './pages/ScanMedicinePage';
import { SearchMedicinePage } from './pages/SearchMedicinePage';
import { MedicineDetailPage } from './pages/MedicineDetailPage';
import { NearbyPharmaciesPage } from './pages/NearbyPharmaciesPage';
import { CartPage } from './pages/CartPage';
import { MyReservationsPage } from './pages/MyReservationsPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { PharmacyDashboardPage } from './pages/PharmacyDashboardPage';
import { DeliveryPortalPage } from './pages/DeliveryPortalPage';
import { UserProfilePage } from './pages/UserProfilePage';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <LocationProvider>
            <div className="min-h-screen flex flex-col bg-[#F8FBFC] text-navy-800">
              <Navbar />
              <main className="flex-1">

                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/scan" element={<ScanMedicinePage />} />
                  <Route path="/search" element={<SearchMedicinePage />} />
                  <Route path="/medicines/:id" element={<MedicineDetailPage />} />
                  <Route path="/pharmacies" element={<NearbyPharmaciesPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/reservations" element={<MyReservationsPage />} />
                  <Route path="/orders" element={<MyOrdersPage />} />
                  <Route path="/pharmacy-dashboard" element={<PharmacyDashboardPage />} />
                  <Route path="/delivery-portal" element={<DeliveryPortalPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />

                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </LocationProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
