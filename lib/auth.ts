import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  
  if (!token) {
    // In development, allow bypass if no token is set to match dashboard layout behavior
    if (process.env.NODE_ENV === "development") {
      return { id: "dev-admin", email: "admin@dev.local", role: "admin" };
    }
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    // Also allow bypass on invalid token in development
    if (process.env.NODE_ENV === "development") {
      return { id: "dev-admin", email: "admin@dev.local", role: "admin" };
    }
    return null;
  }
}
