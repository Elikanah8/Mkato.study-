import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const result = body.Body?.stkCallback

        if (!result) {
            return NextResponse.json({ success: false })
        }

        const resultCode = result.ResultCode
        const resultDesc = result.ResultDesc
        const merchantRef = result.CallbackMetadata?.Item?.find(
            (i: any) => i.Name === 'MpesaReceiptNumber'
        )?.Value

        // Payment was successful
        if (resultCode === 0) {
            // Extract user ID from transaction description
            const desc: string = result.CallbackMetadata?.Item?.find(
                (i: any) => i.Name === 'TransactionDate'
            )?.Value?.toString() || ''

            console.log('Payment successful:', merchantRef)

            // Update user plan to paid
            // In production you would extract userId from AccountReference
            // and update their profile plan to 'paid'
        } else {
            console.log('Payment failed:', resultDesc)
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ success: false })
    }
}
