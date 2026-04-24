"use client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setCredentials } from "../store/auth/authSlice";

export default function GetUser({ user }: { user: any }) {
  const dispatch = useDispatch<AppDispatch>();
  if (user) {
    dispatch(setCredentials({ user, token: "" }));
  }

  return null;
}
