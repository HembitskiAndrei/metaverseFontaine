import { PBRCustomMaterial } from "@babylonjs/materials/custom/pbrCustomMaterial";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector2} from "@babylonjs/core/Maths/math.vector";
import {Texture} from "@babylonjs/core/Materials/Textures/texture";
import {Color3} from "@babylonjs/core/Maths/math.color";
import { IWaterMaterialConfig, SceneType } from "../utils/types";

class WaterMaterial extends PBRCustomMaterial {
  constructor(
    name: string,
    config: IWaterMaterialConfig,
    speedFragment: number,
    speedFoamFragment: number,
    scale: Vector2,
    color: Color3,
    scene: SceneType
  ) {
    super(name, scene);
    this.backFaceCulling = false;
    this.alphaMode = Engine.ALPHA_COMBINE;
    this.alpha = 0.99;
    this.needAlphaBlending();
    this.roughness = 1;
    this.metallic = 1;
    this.emissiveColor = new Color3(1, 1, 1);
    this.AddUniform("time", "float", null);
    this.AddUniform("speedFragment", "float", null);
    this.AddUniform("speedFoamFragment", "float", null);
    this.AddUniform("color", "vec3", null);
    this.AddUniform("scale", "vec2", null);
    this.AddUniform("upTexture", "sampler2D", null);
    this.AddUniform("backTexture", "sampler2D", null);
    this.AddUniform("foamTextureUp", "sampler2D", null);
    this.AddUniform("noiseTexture", "sampler2D", null);
    this.AddUniform("alphaTexture", "sampler2D", null);
    this.Vertex_Definitions(config.VertexDefinitions);
    this.Vertex_Before_PositionUpdated(config.VertexBeforePositionUpdated);
    this.Fragment_Definitions(config.FragmentDefinitions);
    this.Fragment_Before_FragColor(config.FragmentBeforeFragColor);
    let time = 0;
    this.onBindObservable.add(() => {
      time += this.getScene().getAnimationRatio() * 0.0015;
      this.getEffect().setFloat("time", time);
      this.getEffect().setFloat2("scale", scale.x, scale.y);
      this.getEffect().setFloat("speedFragment", speedFragment);
      this.getEffect().setFloat("speedFoamFragment", speedFoamFragment);
      this.getEffect().setColor3("color", color);
    });

  }

  setTexture(texture: Texture, sampleName: string): void {
      this.onBindObservable.add(() => {
        this.getEffect().setTexture(sampleName, texture);
      });
  }
}

export default WaterMaterial;
