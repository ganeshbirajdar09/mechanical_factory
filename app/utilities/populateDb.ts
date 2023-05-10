import authService from "../features-modules/auth/auth.service"
import { ADMIN_DATA } from "./constants"


export const populateDB = async () => {
    try {
        for (let admin of ADMIN_DATA) {
            await authService.register(admin)
        }
    } catch (error) {
        console.log('COULD NOT POPULATE DB: ', error)
    }

}

