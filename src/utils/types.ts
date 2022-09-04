import type {MainScene} from "../scenes/MainScene";

export type SceneType = MainScene;

export interface IWaterMaterialConfig {
  VertexDefinitions: string;
  VertexBeforePositionUpdated: string;
  FragmentDefinitions: string;
  FragmentBeforeFragColor: string;
}

export interface IDownWaterConfig {
  radius: number,
  height: number,
  radiusRange: number
}
