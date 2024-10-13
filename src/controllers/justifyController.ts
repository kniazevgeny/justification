import { Context } from "koa";
import { processJustification } from "../helpers/justify";

export const justifyHandler = async (ctx: Context) => {
  // Extract the plain text from the request body
  const text: string = ctx.request.body as string;
  debugger;

  const processedText = processJustification(text);

  ctx.set("Content-Type", "text/plain");
  ctx.body = processedText;
};
