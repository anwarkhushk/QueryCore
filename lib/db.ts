// In-memory mock database
export interface Customer {
    id: string;
    name: string;
    email: string;
    status: string;
    spend: number;
}

export interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    stock: number;
}

export interface Order {
    id: string;
    customerName: string;
    date: string;
    total: number;
    status: string;
    items: any[];
}

export let customers: Customer[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active', spend: 1200 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Active', spend: 850 },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', spend: 0 },
];

export let products: Product[] = [
    { id: '1', sku: 'PROD-001', name: 'Premium Analytics Plan', price: 99.00, stock: 1000 },
    { id: '2', sku: 'PROD-002', name: 'Standard Analytics Plan', price: 49.00, stock: 5000 },
    { id: '3', sku: 'SERV-001', name: 'Consulting Hour', price: 150.00, stock: 50 },
];

export let orders: Order[] = [
    {
        id: '1',
        customerName: 'John Doe',
        date: '2023-10-25',
        total: 1200,
        status: 'Completed',
        items: [
            { productName: 'Premium Analytics Plan', quantity: 1, price: 99.00 }
        ]
    },
    {
        id: '2',
        customerName: 'Jane Smith',
        date: '2023-10-26',
        total: 850,
        status: 'Processing',
        items: [
            { productName: 'Standard Analytics Plan', quantity: 1, price: 49.00 }
        ]
    },
];

// Helper functions to modify data
export const addCustomer = (customer: Customer) => customers.push(customer);
export const updateCustomer = (id: string, data: Partial<Customer>) => {
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
        customers[index] = { ...customers[index], ...data };
        return customers[index];
    }
    return null;
};
export const deleteCustomer = (id: string) => {
    customers = customers.filter(c => c.id !== id);
};

export const addProduct = (product: Product) => products.push(product);
export const updateProduct = (id: string, data: Partial<Product>) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...data };
        return products[index];
    }
    return null;
};
export const deleteProduct = (id: string) => {
    products = products.filter(p => p.id !== id);
};

export const addOrder = (order: Order) => orders.unshift(order);
