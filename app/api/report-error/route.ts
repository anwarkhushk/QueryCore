import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { message, reporterEmail, reporterName } = body;

    try {
        // Asli email bhejne ka code Web3Forms ke zariye
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                // YAHAN APNI WEB3FORMS WALI LAMBI ACCESS KEY PASTE KARNA:
                access_key: "2bdd9aa9-51e5-497c-bc37-0d11ff84ea59",

                subject: `🚨 New Bug Report from ${reporterName || "User"}`,
                from_name: reporterName || "SaaS Analytics Bug Tracker",
                replyto: reporterEmail,
                message: message,
            }),
        });

        const result = await response.json();

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Report sent successfully to admins."
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Failed to send report."
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Error sending real email:", error);
        return NextResponse.json({
            success: false,
            message: "Server error occurred."
        }, { status: 500 });
    }
}