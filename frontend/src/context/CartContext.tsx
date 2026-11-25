import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine, Pharmacy, CartItem } from '../types';

interface CartContextType {
  selectedPharmacy: Pharmacy | null;
  items: CartItem[];
  addToCart: (medicine: Medicine, pharmacy: Pharmacy, unitPrice: number, quantity?: number) => void;
  removeFromCart: (medicineId: number) => void;
  updateQuantity: (medicineId: number, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  estimatedTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(() => {
    const saved = localStorage.getItem('mediaccess_cart_pharmacy');
    return saved ? JSON.parse(saved) : null;
  });

  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mediaccess_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mediaccess_cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('mediaccess_cart_pharmacy', JSON.stringify(selectedPharmacy));
  }, [selectedPharmacy]);

  const addToCart = (medicine: Medicine, pharmacy: Pharmacy, unitPrice: number, quantity: number = 1) => {
    // If pharmacy changes, confirm replacement of cart or switch pharmacy
    if (selectedPharmacy && selectedPharmacy.id !== pharmacy.id) {
      const confirmChange = window.confirm(
        `Your cart currently has items from "${selectedPharmacy.name}".\n\nAdding items from "${pharmacy.name}" will clear your previous selection. Do you wish to continue?`
      );
      if (!confirmChange) return;
      setItems([{ medicine, quantity, unit_price: unitPrice }]);
      setSelectedPharmacy(pharmacy);
      return;
    }

    setSelectedPharmacy(pharmacy);
    setItems((prev) => {
      const existing = prev.find((i) => i.medicine.id === medicine.id);
      if (existing) {
        return prev.map((i) =>
          i.medicine.id === medicine.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { medicine, quantity, unit_price: unitPrice }];
    });
  };

  const removeFromCart = (medicineId: number) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.medicine.id !== medicineId);
      if (next.length === 0) {
        setSelectedPharmacy(null);
      }
      return next;
    });
  };

  const updateQuantity = (medicineId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.medicine.id === medicineId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setSelectedPharmacy(null);
    localStorage.removeItem('mediaccess_cart_items');
    localStorage.removeItem('mediaccess_cart_pharmacy');
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) * 100) / 100;
  const deliveryFee = selectedPharmacy?.home_delivery_available ? selectedPharmacy.delivery_fee : 0;
  const estimatedTotal = Math.round((subtotal + deliveryFee) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        selectedPharmacy,
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        deliveryFee,
        estimatedTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
