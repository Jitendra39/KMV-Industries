import { NextApiRequest, NextApiResponse } from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  console.log("Request body:", body);

  res.status(200).json({ message: "Hello from the server!" });
}
