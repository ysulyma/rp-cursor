# rp-cursor

Cursor replaying/recording for [ractive-player](https://github.com/ysulyma/ractive-player)/[ractive-editor](https://github.com/ysulyma/ractive-editor/)

## Installation

    $ npm install --save rp-cursor

## Usage

To record:

```ts
import Editor from "ractive-editor";
import CursorRecorderPlugin from "rp-cursor/recorder";
Editor.addRecorder(CursorRecorderPlugin);
```

Component usage:
```ts
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

**Properties**

* start - when to start displaying the cursor. Can be either a string denoting the name of a marker, or a number.

* end - when to stop displaying the cursor.  Can be either a string denoting the name of a marker, or a number.

* src - path to a cursor image to use.

* replay - an array of durations and cursor coordinates produced by the recorder
