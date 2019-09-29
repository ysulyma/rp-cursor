import * as React from "react";

import {Recorder, RecorderPlugin, RecorderConfigureComponent} from "../recorder";

import {$, $$} from "../utils/dom";
import {on, off} from "../utils/events";

import {Player, Utils, ReplayData} from "ractive-player";
const {bind} = Utils.misc;

type Path = ReplayData<[number, number]>;

export class CursorRecorder implements Recorder {
  private captureData: Path;

  private captureStart: number;
  private pauseTime: number;
  private lastPauseTime: number;
  private paused: boolean;

  private recording: boolean;
  private cachedX: number;
  private cachedY: number;

  private canvas: HTMLDivElement;

  constructor(player: Player) {
    bind(this, ["captureMouse"]);

    this.canvas = player.canvas;
  }

  beginRecording(baseTime: number) {
    // begin new capturing
    this.captureData = [];
    this.captureStart = baseTime;
    this.pauseTime = 0;
    this.paused = false;
    this.recording = true;

    on(document.body, "mousemove", this.captureMouse);
  }

  pauseRecording(time: number) {
    this.paused = true;
    this.lastPauseTime = time;
  }

  resumeRecording(time: number) {
    this.pauseTime += time - this.lastPauseTime;
    this.paused = false;
  }

  endRecording() {
    this.recording = false;

    off(document.body, "mousemove", this.captureMouse);
  }

  finalizeRecording(startDelay: number) {
    for (const datum of this.captureData) {
      datum[0] -= startDelay;
    }
    this.captureData = this.captureData.filter(_ => _[0] >= 0);

    // convert to relative times (reduces filesize)
    for (let i = this.captureData.length - 1; i >= 1; --i) {
      this.captureData[i][0] -= this.captureData[i-1][0];
    }
    for (let i = 0; i < this.captureData.length; ++i) {
      this.captureData[i][0] = formatNum(this.captureData[i][0]);
    }
    return this.captureData;
  }

  captureMouse(e: MouseEvent) {
    const t = this.getTime();
    if (this.paused) return;

    const {left, top, height, width} = this.canvas.getBoundingClientRect();

    this.captureData.push([
      t,
      [
        (e.pageX - left) / width * 100,
        (e.pageY - top) / height * 100
      ].map(formatNum) as [number, number]
    ]);
  }

  getTime() {
    return performance.now() - this.captureStart - this.pauseTime;
  }
}

export class CursorConfigureComponent extends RecorderConfigureComponent {
  render() {
    const classNames = ["recorder-plugin-icon"];

    if (this.state.active)
      classNames.push("active");

    return (
      <div className="recorder-plugin" title="Record cursor">
        <div
          className="recorder-plugin-icon"
          style={{backgroundColor: this.state.active ? "red" : "#222", height: "36px", lineHeight: "36px", width: "36px"}}
        >
          <img
            height="28" width="28" src="/img/cursor-large.png"
            onClick={this.toggleActive}
            style={{verticalAlign: "middle"}}
          />
        </div>
        <span className="recorder-plugin-name">Cursor</span>
      </div>
    );
  }
}

export function CursorSaveComponent(props: {data: Path}) {
  return (
    <>
      <th key="head" scope="row">
        <img className="recorder-plugin-icon" height="28" width="28" src="/img/cursor-large.png"/>
      </th>
      <td key="cell">
        {props.data ?
          <textarea readOnly value={JSON.stringify(props.data)}></textarea> :
          "Cursor data not yet available."
        }
      </td>
    </>
  );
}

export const CursorRecorderPlugin = {
  name: "CursorRecorder",
  recorder: CursorRecorder,
  configureComponent: CursorConfigureComponent,
  saveComponent: CursorSaveComponent
};

// stupid helper function
function offsetParent(node: HTMLElement) {
  if (node.offsetLeft !== undefined && node.offsetTop !== undefined) return { left: node.offsetLeft, top: node.offsetTop };

  const rect = node.getBoundingClientRect();

  let parent = node;
  while (parent = (parent.parentNode as HTMLElement)) {
    if (parent.nodeName.toLowerCase() === "main") {
      console.log("MAIN");
    }
    if (!["absolute", "relative"].includes(getComputedStyle(parent).position)) continue;

    const prect = parent.getBoundingClientRect();

    return { left: rect.left - prect.left, top: rect.top - prect.top };
  }

  return { left: rect.left, top: rect.top };
}

function formatNum(x: number): number {
  return parseFloat(x.toFixed(2));
}
