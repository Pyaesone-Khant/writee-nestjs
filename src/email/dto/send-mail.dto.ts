
export class SendMailDto {
    subject: string;

    otp: string;

    template: string;

    user: {
        name: string;
        email: string;
    };
}