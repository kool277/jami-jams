export interface ServerUiCustomization {
  /** if the title is undefined, we show the default title */
  title?: string;
  /** if the description is undefined, we show the default description */
  description?: string;
  areTipsEnabled: boolean;

  backgroundType: "color" | "image" | "default";
  /** only defined if backgroundType !== "default" */
  backgroundColorOrUrl?: string;
  /**
   * if this field is undefined, we show the default value
   * The color is in argb format
   */
  tipBoxAndIdColor?: string;

  /**
   * if this field is undefined, we show the default value
   * The color is in argb format
   */
  mainBoxColor?: string;

  logoUrl?: string;
  /** The logo size from 0 to 100. 100% if left undefined */
  logoSize?: number;
}
