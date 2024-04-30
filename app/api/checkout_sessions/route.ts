import { NextRequest } from "next/server"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json()
  const priceId = body?.priceId
  const userId = body?.userId
  const credits = body?.credits

  const session = await stripe.checkout.sessions.create({
    metadata:{
      userId: userId,
      credits: credits
    },
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.HOST_URL}?success=true`,
    cancel_url: `${process.env.HOST_URL}?canceled=true`,
    automatic_tax: {enabled: true},
  });
if(session?.url){
  console.log(session?.url)

  return new Response(JSON.stringify(session?.url))
}
}


