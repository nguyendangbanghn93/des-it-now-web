import React, { useEffect } from "react";

import _ from "lodash";
import { createWithEqualityFn } from "zustand/traditional";
import designTypeApi from "@/api/designType";
import { loading } from "@/components/commons/Loading";
import priceApi from "@/api/price";
import productTypeApi from "@/api/productType";
import { useQueries } from "@tanstack/react-query";

interface IObjectMapData {
  productType?: Record<string, IDesignType>;
  designType?: Record<string, IDesignType>;
  price?: Record<string, IPrice>;
}

interface IConfigState {
  listProductType: IProductType[];
  listDesignType: IDesignType[];
  listPrice: IPrice[];
  objMapData: IObjectMapData;
}

interface IConfigActions {
  setListProductType: (list: IProductType[]) => void;
  setListDesignType: (list: IDesignType[]) => void;
  setListPrice: (list: IPrice[]) => void;
  setObjectMapData: (objMapData: IObjectMapData) => void;
}

type IConfigStore = IConfigState & IConfigActions;

const initialState: IConfigState = {
  listProductType: [],
  listDesignType: [],
  listPrice: [],
  objMapData: {
    productType: {},
    designType: {},
    price: {},
  },
};

const useConfigStore = createWithEqualityFn<IConfigStore>()((set) => ({
  ...initialState,
  setObjectMapData: (obj) => set({ objMapData: obj }),
  setListProductType: (list) => set({ listProductType: list }),
  setListDesignType: (list) => set({ listDesignType: list }),
  setListPrice: (list) => set({ listPrice: list }),
}));

export default useConfigStore;

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [
    setListProductType,
    setListDesignType,
    setListPrice,
    setObjectMapData,
  ] = useConfigStore((s) => [
    s.setListProductType,
    s.setListDesignType,
    s.setListPrice,
    s.setObjectMapData,
  ]);
  const [
    { data: productTypeData, isLoading: isLoadingProduct },
    { data: designTypeData, isLoading: isLoadingDesign },
    { data: priceData, isLoading: isLoadingPrice },
  ] = useQueries({
    queries: [
      {
        queryKey: ["productTypeApi.findAllProductType"],
        queryFn: productTypeApi.findAllProductType,
      },
      {
        queryKey: ["designTypeApi.findAllDesignType"],
        queryFn: designTypeApi.findAllDesignType,
      },
      {
        queryKey: ["priceApi.findAllPrice"],
        queryFn: priceApi.findAllPrice,
      },
    ],
  });

  useEffect(() => {
    setObjectMapData({
      productType: _.chain(productTypeData?.data).keyBy("id").value(),
      designType: _.chain(designTypeData?.data).keyBy("id").value(),
      price: _.chain(priceData?.data).keyBy("id").value(),
    });
    _.chain(productTypeData?.data).keyBy("id").value();
    _.chain(designTypeData?.data).keyBy("id").value();
    _.chain(priceData?.data).keyBy("id").value();
    setListProductType(productTypeData?.data || []);
    setListDesignType(designTypeData?.data || []);
    setListPrice(priceData?.data || []);
  }, [
    designTypeData?.data,
    priceData?.data,
    productTypeData?.data,
    setListDesignType,
    setListPrice,
    setListProductType,
    setObjectMapData,
  ]);

  useEffect(() => {
    loading(isLoadingProduct || isLoadingDesign || isLoadingPrice);
  }, [isLoadingDesign, isLoadingPrice, isLoadingProduct]);

  return isLoadingProduct || isLoadingDesign || isLoadingPrice
    ? null
    : children;
};
