import app from "./app";
import envConfig from "./config/envConfig";

const port = envConfig.port;

async function main() {
    try {
        app.listen(port, () => {
            console.log(`Server is running on port ::: ${port}`);
        })
    }
    catch (error) {
        console.log(`Error starting the server::: ${error}`)
        process.exit(1);
    }
}

main()