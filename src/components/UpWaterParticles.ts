import {ParticleSystem} from "@babylonjs/core/Particles/particleSystem";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Scene } from "@babylonjs/core/scene";

export class UpWaterParticles extends ParticleSystem {

  constructor(name: string, capacity: number, scene: Scene) {
    super(name, capacity, scene)

    this.renderingGroupId = 2;

    this.createConeEmitter(0.15, Math.PI / 3);

    this.billboardMode = ParticleSystem.BILLBOARDMODE_STRETCHED;
    // Colors of all particles
    this.color1 = new Color4(1.0, 1.0, 1.0, 0.5);
    this.color2 = new Color4(0.75, 0.75, 0.75, 0.35);
    this.colorDead = new Color4(1, 1, 1, 0.5);

    this.minScaleY = 0.25;
    this.maxScaleY = 2;
    this.minScaleX = 0.25;
    this.maxScaleX = 1;
    // Size of each particle (random between...
    this.minSize = 0.5;
    this.maxSize = 1.0;

    // Life time of each particle (random between...
    this.minLifeTime = 1.85;
    this.maxLifeTime = 1.85;

    // Emission rate
    this.emitRate = 2000;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    this.blendMode = ParticleSystem.BLENDMODE_STANDARD;

    // Set the gravity of all particles
    this.gravity = new Vector3(0, -9.81, 0);

    // Direction of each particle after it has been emitted
    this.direction1 = new Vector3(-2.5, 8, 2.5);
    this.direction2 = new Vector3(2.5, 8, -2.5);

    // Speed
    this.minEmitPower = 6;
    this.maxEmitPower = 7;
    this.updateSpeed = 0.025;
  }

  setupAnimationSheet(parameters: {
    width: number;
    height: number;
    numSpritesWidth: number;
    numSpritesHeight: number;
    animationSpeed: number;
    isRandom: boolean;
  }) {
    this.isAnimationSheetEnabled = true;
    this.spriteCellWidth =
      parameters.width / parameters.numSpritesWidth;
    this.spriteCellHeight =
      parameters.height / parameters.numSpritesHeight;
    const numberCells = parameters.numSpritesWidth * parameters.numSpritesHeight;
    this.startSpriteCellID = 0;
    this.endSpriteCellID = numberCells - 1;
    this.spriteCellChangeSpeed = parameters.animationSpeed;
    this.spriteRandomStartCell = parameters.isRandom;
    this.updateSpeed = 1 / 60;
  };
}
