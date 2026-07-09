import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path: path.join(process.cwd(), ".env")
})

export default {
    app_url: process.env.APP_URL,
    frontend_url: process.env.FRONTEND_URL,
    port: process.env.PORT || 5001,
    db_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_access_expiry: process.env.JWT_ACCESS_EXPIRY!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_refresh_expiry: process.env.JWT_REFRESH_EXPIRY!,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
}
