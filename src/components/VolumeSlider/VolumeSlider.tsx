import React from "react";
import * as Slider from "@radix-ui/react-slider";

const VolumeSlider = ({
  onVolumeChange,
}: {
  onVolumeChange: (val: any) => void;
}) => (
  <form>
    <Slider.Root
      className="relative flex h-5 w-[200px] touch-none select-none items-center"
      defaultValue={[0.5]}
      max={1}
      step={0.1}
      onValueChange={(val) => onVolumeChange(val[0])}
    >
      <Slider.Track className="relative h-[3px] grow rounded-full bg-blackA7">
        <Slider.Range className="absolute h-full rounded-full bg-primary" />
      </Slider.Track>
      <Slider.Thumb
        className="block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_5px] focus:shadow-blackA5 focus:outline-none"
        aria-label="Volume"
      />
    </Slider.Root>
  </form>
);

export default VolumeSlider;
