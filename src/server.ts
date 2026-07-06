import app from "./app";
import envConfig from "./config/envConfig";
import { prisma } from "./lib/prisma";

const port = envConfig.port;

async function main() {
    try {
        await prisma.$connect();
        console.log(`Connected to Database...`)

        app.listen(port, () => {
            console.log(`Server is running on port ::: ${port}`);
        })
    }
    catch (error) {
        await prisma.$disconnect();
        console.log(`Error starting the server::: ${error}`)
        process.exit(1);
    }
}

main()