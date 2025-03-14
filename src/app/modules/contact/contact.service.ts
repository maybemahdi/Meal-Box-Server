import config from "../../config";
import { sendEmail } from "../../utils/sendEmail";
import { IContact } from "./contact.interface";
import { Contact } from "./contact.model";

const postContactMessage = async (payload: IContact) => {
  const result = await Contact.create(payload);
  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #059669;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            border-radius: 5px 5px 0 0;
          }
          .content {
            margin-top: 15px;
            font-size: 16px;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">New Contact Message</div>
          <div class="content">
            <p><strong>Name:</strong> ${payload.name}</p>
            <p><strong>Email:</strong> ${payload.email}</p>
            <p><strong>Subject:</strong> ${payload.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${payload.message}</p>
          </div>
          <p class="footer">&copy; ${new Date().getFullYear()} MealBox. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
  sendEmail(payload?.subject, config.email as string, html);
  return result;
};

export const ContactService = {
  postContactMessage,
};
