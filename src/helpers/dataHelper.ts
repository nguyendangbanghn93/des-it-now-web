import useConfigStore from "@/stores/configStore";

const dataHelper = {
  getDesign(id?: string | number) {
    return useConfigStore.getState().objMapData.designType?.[id as string];
  },
  getProduct(id?: string | number) {
    return useConfigStore.getState().objMapData.productType?.[id as string];
  },
  getPrice(id?: string | number) {
    return useConfigStore.getState().objMapData.price?.[id as string];
  },
};

export default dataHelper;
