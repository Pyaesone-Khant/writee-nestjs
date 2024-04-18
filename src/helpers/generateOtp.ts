import * as crypto from 'crypto';

export const generateOtp = () => {
    const numberArr = new Uint32Array(10);
    const randomArrIndex = Math.floor(Math.random() * numberArr.length);
    const otp = crypto.getRandomValues(numberArr)[randomArrIndex].toString().slice(0, 6);
    const otp_expiration = (Date.now() + (3 * 60 * 1000)).toString();
    return { otp, otp_expiration }
}