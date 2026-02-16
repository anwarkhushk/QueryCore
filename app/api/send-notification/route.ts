import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { adminEmail, userName } = body;

    // In production, this would use a real email service (e.g., SendGrid, Resend, Nodemailer)
    // This is a ONE-TIME email sent only at login
    console.log(`📧 LOGIN EMAIL NOTIFICATION:`);
    console.log(`   To: ${adminEmail || 'admin@example.com'}`);
    console.log(`   Subject: [SaaS Analytics] Login Alert`);
    console.log(`   Body: ${userName || 'Admin User'} has logged into the SaaS Analytics Dashboard at ${new Date().toLocaleString()}.`);
    console.log(`   Note: All data modifications are being saved to the backup log.`);

    return NextResponse.json({
        success: true,
        message: `Login email sent to ${adminEmail || 'admin@example.com'}.`
    });
}
