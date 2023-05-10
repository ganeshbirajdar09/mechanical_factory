import { connect } from "mongoose";


export const connectToMongo = async () => {
    try {
        const { MONGO_CONNECTION } = process.env;
        await connect(MONGO_CONNECTION || '');
        return true;
    } catch(e) {
        throw { 
            message: 'COULD NOT CONNECT TO MONGO DB', 
            error: e 
        };
    }
}
