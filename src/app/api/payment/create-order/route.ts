import { auth } from "@/auth"
import { NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // NOTE: These should be in .env
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_123",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "secret",
    })

    try {
        const body = await req.json()
        const { plan } = body

        const options = {
            amount: plan === "PRO" ? 99900 : 0, // Amount in paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)

        return NextResponse.json(order)
    } catch (error) {
        console.error("Razorpay Error:", error)
        return new NextResponse("Payment Init Failed", { status: 500 })
    }
}
