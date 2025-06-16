import Blits from "@lightningjs/blits";

export const Tile = Blits.Component('Tile', {
  template: `
      <Element :w="$w" :h="$h" :color="$color" :x="$x" :y="$y" key="$id">
        <Text
          :content="$text"
          :color="$textColor"
          alpha="0.8"
          :size="$fontSize || 26"
          font="Ubuntu"
          x="5"
          y="2"
          ref="text"
        />
      </Element>
  `,
  props: ['type', 'size', 'w', 'h', 'color', 'x', 'y', 'id', 'text', 'textColor', 'fontSize'],
});

export default Tile;