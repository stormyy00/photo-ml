"use server";

import { getToken } from "@/utils/auth";

export const verifyUser = async () => {
  const { token } = await getToken();
  try {
    const data = await fetch(`${process.env.BACKEND_URL}/api/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
    return data;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};
