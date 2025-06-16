import Blits from "@lightningjs/blits";

export const Tile = Blits.Component('Tile', {
  template: `
      <Element :w="$w" :h="$h" :color="$color" :x="$x" :y="$y" key="$id">
        <Text
          :content="$title"
          size="16"
          font="Ubuntu"
          x="5"
          y="240"
          ref="text"
        />
      </Element>
  `,
  props: ['type', 'size', 'w', 'h', 'color', 'x', 'y', 'id', 'title'],
});

export default Tile;