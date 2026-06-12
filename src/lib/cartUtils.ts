export interface CartItem {
  _id: string;
  name: string;
  barcode?: string;
  price: number;
  qty: number;
  discount: number; // nominal per item
  stock: number;
}

export function calcSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.qty - i.discount, 0);
}

export function calcTax(subtotalAfterDiscount: number, taxPercent: number) {
  return (subtotalAfterDiscount * taxPercent) / 100;
}

export function calcTotal(subtotal: number, discountTotal: number, taxAmount: number) {
  return subtotal - discountTotal + taxAmount;
}
