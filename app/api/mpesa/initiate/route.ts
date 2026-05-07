import { NextRequest, NextResponse } from 'next/server'

async function getAccessToken(): Promise<string> {
    const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64')

    const res = await fetch(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        { headers: { Authorization: `Basic ${auth}` } }
    )

    const data = await res.json()
    return data.access_token
}

export async function POST(req: NextRequest) {
    try {
        const { phone, amount, userId } = await req.json()

        if (!phone || !amount || !userId) {
            return NextResponse.json(
                { error: 'Phone, amount and userId are required.' },
                { status: 400 }
            )
        }

        // Format phone — ensure it starts with 254
        let formattedPhone = phone.replace(/\s/g, '') // strip spaces
        if (formattedPhone.startsWith('+254')) {
            formattedPhone = formattedPhone.slice(1)          // +254... → 254...
        } else if (formattedPhone.startsWith('0')) {
            formattedPhone = `254${formattedPhone.slice(1)}`  // 07... → 254...
        } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
            formattedPhone = `254${formattedPhone}`           // 7... → 2547...
        }
        // validate length
        if (formattedPhone.length !== 12) {
            return NextResponse.json(
                { error: `Invalid phone number. Got: ${formattedPhone}` },
                { status: 400 }
            )
        }

        const accessToken = await getAccessToken()

        const timestamp = new Date()
            .toISOString()
            .replace(/[-T:.Z]/g, '')
            .slice(0, 14)

        const password = Buffer.from(
            `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
        ).toString('base64')

        const body = {
            BusinessShortCode: process.env.MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: process.env.MPESA_SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: process.env.MPESA_CALLBACK_URL,
            AccountReference: 'MkatoStudy',
            TransactionDesc: `Mkato.study subscription - ${userId}`,
        }

        const res = await fetch(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        )

        const data = await res.json()
        console.log('[Daraja STK response]', JSON.stringify(data, null, 2))

        if (data.ResponseCode === '0') {
            return NextResponse.json({
                success: true,
                checkoutRequestId: data.CheckoutRequestID,
                message: 'STK push sent. Check your phone.',
            })
        } else {
            const errMsg = data.errorMessage ?? data.ResultDesc ?? data.CustomerMessage ?? 'Payment initiation failed.'
            return NextResponse.json(
                { error: errMsg },
                { status: 400 }
            )
        }
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}