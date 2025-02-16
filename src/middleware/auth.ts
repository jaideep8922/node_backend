import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface DecodedToken {
  user: {
    id: string
  }
}

export const auth = (req: any & { user?: DecodedToken["user"] }, res: any, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken
    req.user = decoded.user
    next()
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" })
  }
}
