import Stripe from "stripe"
import envConfig from "../config/envConfig"

export const stripe = new Stripe(envConfig.stripe_secret_key)