"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setCredentials } from "../store/auth/authSlice";
import { setLoading } from "../store/pages/pagesSlice";

export default function GetUser({ user }: { user: any }) {
  const dispatch = useDispatch<AppDispatch>();
  if (user) {
    dispatch(setCredentials({ user, token: "" }));
  }

  // useEffect(() => {
  //   if (user) {
  //     dispatch(setCredentials({ user, token: "" }));
  //   }
  // }, [user]);

  return null;
}
