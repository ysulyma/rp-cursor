import * as React from "react";
import {ReplayData} from "liqvid";

interface Props {
  src: string;
  start: number | string;
  end: number | string;
  replay: ReplayData<[number, number]>;
}

export default function Cursor(props: Props): JSX.Element;
