import { cache } from "react";

function serialize(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export const getAuthUser = cache(async (token: string) => {
  const res = await fetch(`http://localhost:8000/auth/me`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return serialize(data);
});
