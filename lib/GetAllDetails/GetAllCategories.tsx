"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchCategories } from "../store/categories/categoriesThunk";

export default function GetAllCategories({
  type = "admin",
}: {
  type?: string;
}) {
  const { hasCategoriesFetched } = useSelector(
    (state: RootState) => state.adminCategories,
  );

  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user && type == "admin") return;

    if (!hasCategoriesFetched) {
      dispatch(fetchCategories({}));
    }
  }, [user, hasCategoriesFetched]);

  return null;
}
