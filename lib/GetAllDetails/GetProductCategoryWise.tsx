"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { AppDispatch } from "../store/store";
import { fetchProductsByCategory } from "../store/products/productsThunk";
import { useParams, useSearchParams } from "next/navigation";

export default function GetAllProducts() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  const { allProducts } = useSelector(
    (state: RootState) => state.adminProducts,
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;

    dispatch(fetchProductsByCategory({ category: id, filters }));
  }, [id, filters]);

  return null;
}
