import designTypeApi from "@/api/designType";
import priceApi from "@/api/price";
import productTypeApi from "@/api/productType";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useRef, ReactNode, useEffect } from "react";
import { useStore, StoreApi } from "zustand";
import { createWithEqualityFn } from "zustand/traditional";

type TConfigState = {
  listProductType: IProductType[];
  listDesignType: IDesignType[];
  listPrice: IPrice[];
};

type TConfigAction = {
  setListProductType: (list: IProductType[]) => void;
  setListDesignType: (list: IDesignType[]) => void;
  setListPrice: (list: IPrice[]) => void;
};

type TConfigStore = TConfigState & TConfigAction;

type ConfigProviderProps = {
  children: ReactNode;
};

const initialState: TConfigState = {
  listProductType: [],
  listDesignType: [],
  listPrice: [],
};

const ConfigContext = createContext<StoreApi<TConfigStore> | null>(null);

const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const storeRef = useRef<StoreApi<TConfigStore>>();

  if (!storeRef.current) {
    storeRef.current = createWithEqualityFn<TConfigStore>((set) => ({
      ...initialState,
      setListProductType: (list) => set({ listProductType: list }),
      setListDesignType: (list) => set({ listDesignType: list }),
      setListPrice: (list) => set({ listPrice: list }),
    }));
  }

  const store = storeRef.current;

  const { data: productTypeData } = useQuery({
    queryFn: productTypeApi.findAllProductType,
    queryKey: ["findAllProductType"],
  });
  const { data: designTypeData } = useQuery({
    queryFn: designTypeApi.findAllDesignType,
    queryKey: ["findAllDesignType"],
  });
  const { data: priceData } = useQuery({
    queryFn: priceApi.findAllPrice,
    queryKey: ["findAllPrice"],
  });

  useEffect(() => {
    store.getState().setListProductType(productTypeData?.data || []);
    store.getState().setListDesignType(designTypeData?.data || []);
    store.getState().setListPrice(priceData?.data || []);
  }, [designTypeData?.data, priceData, productTypeData?.data, store]);

  return (
    <ConfigContext.Provider value={storeRef.current}>
      {children}
    </ConfigContext.Provider>
  );
};

const useConfigStore = <T,>(selector: (state: TConfigStore) => T): T => {
  const store = useContext(ConfigContext);
  if (!store) {
    throw new Error("Missing ConfigProvider");
  }
  return useStore(store, selector);
};

export { ConfigProvider, useConfigStore };
