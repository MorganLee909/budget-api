import {SendMailClient} from "zeptomail";

export default async (email, subject, html)=>{
    const url = "api.zeptomail.com/";
    const token = process.env.ZEPTO_TOKEN_BUDGET;

    const client = new SendMailClient({url, token});

    try{
        await client.sendMail({
            from: {
                address: "support@budget.leemorgan.dev",
                name: "Lee Morgan"
            },
            to: [{
                email_address: {
                    address: email,
                }
            }],
            subject: subject,
            htmlbody: html
        });
    }catch(e){
        console.error(e);
    }
}
