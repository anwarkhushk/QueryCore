import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { message, reporterEmail, reporterName } = body;

    const fixedRecipients = [
        "muhammadanwarbaloch1@gmail.com",
        "mrauf4894@gmail.com"
    ];

    // Simulate sending email
    console.log(`🚨 BUG REPORT RECEIVED`);
    console.log(`   From: ${reporterName} (${reporterEmail})`);
    console.log(`   To: ${fixedRecipients.join(", ")}`);
    console.log(`   Message: ${message}`);

    return NextResponse.json({
        success: true,
        message: "Report sent successfully to admins."
    });
}
