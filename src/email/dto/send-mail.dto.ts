
export class SendMailDto {
    subject: string;

    message: string;

    user: {
        name: string;
        email: string;
    };
}