import { createComponents } from "@/theme/dark/create-components";
import { createPalette } from "@/theme/dark/create-palette";
import { createShadows } from "@/theme/dark/create-shadows";

export const createOptions = (config: any) => {
  const { colorPreset, contrast } = config;
  const palette = createPalette({ colorPreset, contrast });
  const components = createComponents({ palette });
  const shadows = createShadows();

  return {
    components,
    palette,
    shadows,
  };
};
