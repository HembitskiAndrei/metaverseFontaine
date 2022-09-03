import {Texture} from "@babylonjs/core/Materials/Textures/texture";

export const setTextureWrap = (texture: Texture, wrapMode: number) => {
  texture.wrapU = wrapMode;
  texture.wrapR = wrapMode;
  texture.wrapV = wrapMode;
}

export default setTextureWrap;

