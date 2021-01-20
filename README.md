# rp-cursor

Cursor replaying/recording for [ractive-player](https://github.com/ysulyma/ractive-player)/[ractive-editor](https://github.com/ysulyma/ractive-editor/)

## Installation

    $ npm install --save rp-cursor

## Usage

To record:

```ts
import {Player} from "ractive-player";
import {RecordingControl} from "rp-recording";
import CursorRecorderPlugin from "rp-cursor/recorder";

const controls = (<>
  {Player.defaultControlsLeft}

  <div className="rp-controls-right">
    <RecordingControl plugins={[CursorRecorderPlugin]}/>

    {Player.defaultControlsRight}
  </div>
</>);

<Player controls={controls}>
```

Component usage:
```tsx
import Cursor from "rp-cursor";

// produced by the recorder
const cursorData = [[0,[18.43,23.49]],[18,[18.43,23.64]],/* ... */];
<Cursor
  src="/img/cursor.png"
  start="intro/"
  end="example/"
  replay={cursorData}
/>
```

Note that your recorded cursor movements will match up to the *center* of the cursor image.

**Properties**

* start - when to start displaying the cursor. Can be either a string denoting the name of a marker, or a number. If the name of a marker, interpreted as the *start time* of the marker.

* end - when to stop displaying the cursor.  Can be either a string denoting the name of a marker, or a number. If the name of a marker, interpreted as the *end time* of the marker.

* src - path to a cursor image to use.

* replay - an array of durations and cursor coordinates produced by the recorder
