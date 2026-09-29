/** The two semantic hooks Ask Your Body uses to drive the atlas renderer. */
export interface FocusRequest {
  /** `parts` are atlas part ids; bump `id` to retrigger the camera move. */
  id: number;
  parts: string[];
}

export interface EmphasisRequest {
  /** Parts tinted as the subject of the scene. */
  id: number;
  strong: string[];
  /** Share of the surrounding anatomy left visible, 0.15 to 1. */
  context: number;
}
