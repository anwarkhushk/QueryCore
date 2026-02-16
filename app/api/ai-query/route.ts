import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { query } = await request.json();
    const lowerQuery = query.toLowerCase();

    let sql = "";
    let results: any[] = [];
    let columns: string[] = [];

    // Mock logic to return different results based on query
    if (lowerQuery.includes("customer") || lowerQuery.includes("users")) {
        sql = `SELECT id, name, email, spend FROM customers WHERE status = 'Active' ORDER BY spend DESC LIMIT 5;`;
        columns = ["id", "name", "email", "spend"];
        results = [
            { id: "1", name: "John Doe", email: "john@example.com", spend: 1200 },
            { id: "2", name: "Jane Smith", email: "jane@example.com", spend: 850 },
            { id: "4", name: "Alice Brown", email: "alice@example.com", spend: 2300 },
            { id: "5", name: "Charlie Wilson", email: "charlie@example.com", spend: 150 },
            { id: "6", name: "Diana Prince", email: "diana@example.com", spend: 3200 },
        ];
    } else if (lowerQuery.includes("revenue") || lowerQuery.includes("sales")) {
        sql = `SELECT month, revenue, orders FROM monthly_stats WHERE year = 2023;`;
        columns = ["month", "revenue", "orders"];
        results = [
            { month: "Jan", revenue: 4000, orders: 120 },
            { month: "Feb", revenue: 3000, orders: 98 },
            { month: "Mar", revenue: 2000, orders: 75 },
            { month: "Apr", revenue: 2780, orders: 110 },
        ];
    } else if (lowerQuery.includes("order")) {
        sql = `SELECT id, customer_id, total, status FROM orders WHERE status = 'Processing';`;
        columns = ["id", "customer_id", "total", "status"];
        results = [
            { id: "101", customer_id: "2", total: 850, status: "Processing" },
            { id: "103", customer_id: "5", total: 150, status: "Processing" },
        ];
    } else {
        sql = `SELECT * FROM unknown_table LIMIT 0;`;
        columns = ["info"];
        results = [{ info: "No matching patterns found in mock data. Try 'customers', 'revenue', or 'orders'." }];
    }

    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ sql, columns, results });
}
