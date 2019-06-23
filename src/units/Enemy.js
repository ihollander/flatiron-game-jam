import Phaser from "phaser";

import { DNA_IMAGE } from "../consts/images";
import { EXPLODE_SOUND } from "../consts/sounds";

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, type) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.setData("type", type);
    this.setData("isDead", false);
    this.body.setCollideWorldBounds(true);
    this.angle = Math.random() * 360;

    this.health = 1;
    this.suffering = false;
  }

  damage(x) {
    if (this.suffering === false) {
      this.health -= x;

      if (this.health <= 0) {
        this.killMe();
      } else {
        this.suffer();
      }
    }
  }

  killMe() {
    // debugger;
    this.scene.sound.play(EXPLODE_SOUND, {
      seek: 0.35
    });
    const chance = Math.random();
    if (chance < 0.9) {
      this.scene.powerups
        .create(this.body.x, this.body.y, DNA_IMAGE)
        .setScale(0.2, 0.2)
        .refreshBody(); // must call after setScale to resize
    }
    this.destroy();
  }

  update() {
    const playerx = this.scene.player.x;
    const playery = this.scene.player.y;
    const thisx = this.body.x;
    const thisy = this.body.y;
  }

  setInitialVelocity(x) {
    this.body.velocity.x = Phaser.Math.Between(-x, x);
    this.body.velocity.y = Phaser.Math.Between(-x, x);
  }

  suffer() {
    this.suffering = true;
    this.setTintFill(0xffffff);
    setTimeout(() => {
      this.clearTint();
      this.suffering = false;
    }, 200);
  }
}
