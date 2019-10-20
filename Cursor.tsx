import * as React from "react";

import {Player, Utils, ReplayData} from "ractive-player";
const {replay} = Utils.animation,
      {between} = Utils.misc;

interface Props {
  src: string;
  start: number | string;
  end: number | string;
  replay: ReplayData<[number, number]>;
}

export default function Cursor(props: Props) {
  const {playback, script} = React.useContext(Player.Context);
  const ref = React.useRef<HTMLImageElement>();

  const start = (typeof props.start === "number") ? props.start : script.markerByName(props.start)[1],
        end = (typeof props.end === "number") ? props.end : script.markerByName(props.end)[1];

  React.useEffect(() => {
    // measure image
    const {display} = ref.current.style;
    ref.current.style.display = "block";
    const {height, width} = ref.current.getBoundingClientRect();
    ref.current.style.display = display;

    const update = replay({
      data: props.replay,
      start,
      end,
      active: (([x, y]) => {
        Object.assign(ref.current.style, {
          opacity: 1,
          left: `calc(${x}% - ${width/2}px)`,
          top: `calc(${y}% - ${height/2}px)`
        });
      }),
      inactive: () => {
        ref.current.style.opacity = "0";
      },
      compressed: true
    });

    playback.hub.on("seek", update);
    playback.hub.on("timeupdate", update);

    update(playback.currentTime);

    return () => {
      playback.hub.off("seek", update);
      playback.hub.off("timeupdate", update);
    };
  }, [ref.current]);

  const style: React.CSSProperties = {pointerEvents: "none", position: "absolute"};

  if (between(start, playback.currentTime, end))
    style.opacity = 0;

  return (
    <img className="rp-cursor" ref={ref} src={props.src} style={style}/>
  );
}
