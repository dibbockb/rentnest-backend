import { RentalRequestStatus } from "../../../generated/prisma/enums"
import envConfig from "../../config/envConfig"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"

const createCheckoutSession = async (rentalRequestId: string, userId: string) => {
    const rentalRequest = await prisma.rental_Requests.findUnique({
        where: { id: rentalRequestId },
        include: { property: true }
    })
    if (!rentalRequest) {
        throw new Error(`Rental request not found.`)
    }

    if (rentalRequest.requested_by !== userId) {
        throw new Error(`You did not make this rental request so you can not create checkout session for this.`)
    }
    if (rentalRequest.status !== RentalRequestStatus.APPROVED) {
        throw new Error(`Cannot pay for this request as landlord didn't approve this request yet.`)
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        success_url: `${envConfig.frontend_url}/session/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envConfig.frontend_url}/session/checkout?status=cancelled`,
        metadata: {
            rental_request_id: rentalRequest.id,
            property_id: rentalRequest.property.id,
            user_id: userId,
        },

        line_items: [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: rentalRequest.property.location
                },
                unit_amount: rentalRequest.property.price * 100,
            },
            quantity: 1
        }]
    })
    return session.url;
}



export const paymentServices = {
    createCheckoutSession
}