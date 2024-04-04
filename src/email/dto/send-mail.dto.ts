
export class SendMailDto {
    subject: string;

    otp: string;

    user: {
        name: string;
        email: string;
    };
}