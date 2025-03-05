import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ContactService } from "./contact.service";
import httpStatus from "http-status";

const postContactMessage = catchAsync(async (req, res) => {
  const result = await ContactService.postContactMessage(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Message sent successfully",
    data: result,
  });
});

export const ContactController = {
  postContactMessage,
};
