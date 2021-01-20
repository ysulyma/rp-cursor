import * as React from "react";

import {Utils} from "ractive-player";
const {bind} = Utils.misc;
import type {ReplayData} from "ractive-player";

import {ReplayDataRecorder} from "rp-recording";
import type {RecorderPlugin} from "rp-recording";

class CursorRecorder extends ReplayDataRecorder<[number, number]> {
  constructor() {
    super();
    bind(this, ["captureMouse"]);
  }

  beginRecording() {
    // DO NOT FORGET TO CALL super
    super.beginRecording();
    document.body.addEventListener("mousemove", this.captureMouse);
  }

  endRecording() {
    document.body.removeEventListener("mousemove", this.captureMouse);
  }

  captureMouse(e: MouseEvent) {
    const t = this.manager.getTime();

    if (this.manager.paused)
      return;

    const {left, top, height, width} = this.player.canvas.getBoundingClientRect();

    this.capture(t, 
      [
        formatNum((e.pageX - left) / width * 100),
        formatNum((e.pageY - top) / height * 100)
      ] as [number, number]
    );
  }
}

function CursorSaveComponent(props: {data: ReplayData<[number, number]>}) {
  return (
    <>
      {props.data ?
        <textarea readOnly value={JSON.stringify(props.data)}></textarea> :
        "Cursor data not yet available."
      }
    </>
  );
}

const icon = (
  <g>
    <line x1="0" x2="100" y1="50" y2="50" stroke="#FFF"/>
    <line x1="50" x2="50" y1="0" y2="100" stroke="#FFF"/>
  </g>
);

export default {
  icon,
  key: "rp-cursor",
  name: "Cursor",
  recorder: new CursorRecorder,
  saveComponent: CursorSaveComponent,
  title: "Record cursor",
} as RecorderPlugin;

function formatNum(x: number): number {
  return parseFloat(x.toFixed(3));
}
