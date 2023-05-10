import path from 'path'
import fs from "fs";

export const publicKeyGenerator = () => {
    try {
        const publicKey = fs.readFileSync(path.resolve(__dirname, "keys", "public.pem"), { encoding: "utf8" });
        return publicKey
    } catch (error) {
        throw { msg: "problem with public.pem ", error: error }
        
    }
}

export const privateKeyGenerator = () => {
    try {
        const privateKey = fs.readFileSync(path.resolve(__dirname, "keys", "private.pem"), { encoding: "utf8" });
        return privateKey
    } catch (error) {
        throw { msg: "problem with private.pem ", error: error }
    }
}

