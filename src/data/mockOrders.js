export const mockOrders = [
  {
    id: '1001',
    date: '2024-12-15',
    status: 'Delivered',
    total: 159.98,
    items: [
      { name: 'Classic White T-Shirt', quantity: 2, price: 29.99 },
      { name: 'Denim Jacket', quantity: 1, price: 89.99 }
    ]
  },
  {
    id: '1002',
    date: '2024-12-20',
    status: 'Shipped',
    total: 69.99,
    items: [
      { name: 'Casual Sneakers', quantity: 1, price: 69.99 }
    ]
  },
  {
    id: '1003',
    date: '2024-12-28',
    status: 'Processing',
    total: 89.99,
    items: [
      { name: 'Wool Sweater', quantity: 1, price: 79.99 }
    ]
  }
];
