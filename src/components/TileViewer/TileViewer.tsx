import React, { useEffect, useRef, useState } from 'react';
import { RGB } from '../../utils';
import { ScrollableCanvas } from '../atoms';
import { setRGB, setTileImage, writeBorder } from './helper';

type Props = {
  rgb: RGB[];
  w: number;
  h: number;
  grid?: boolean;
  scale?: number;
  className?: string;
  onScroll?: (xTile: number, yTile: number) => void;
};

export const TileViewer: React.VFC<Props> = React.memo(
  ({ rgb, w, h, grid = false, scale = 1, onScroll, className }) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    const canvasWidth = w * scale;
    const [start, setStart] = useState<[number, number]>([0, 0]); // tile x, y on canvas visible left top
    const canvasHeight = (rgb.length * scale) / w;
    const visibleHeight = h;
    const gridSize = 8 * scale;
    const dim = [w / 8, Math.ceil(visibleHeight / gridSize)]; // how many tiles are visible

    useEffect(() => {
      const refreshCanvas = () => {
        if (!canvas || !canvas.current) return;
        const ctx = canvas.current.getContext('2d', { alpha: false })!;
        const [w, h] = [canvas.current.width, canvas.current.height];
        ctx.clearRect(0, 0, w, visibleHeight);
        ctx.fillRect(0, 0, canvasWidth, visibleHeight);
        const c: RGB = [0x4f, 0x4f, 0x4f];
        for (let y = 0; y < dim[1]; y++) {
          for (let x = 0; x < dim[0]; x++) {
            const [tileX, tileY] = [start[0] + x, start[1] + y];
            const tile = ctx.createImageData(gridSize, gridSize);
            const tileIdx = tileY * dim[0] + tileX;
            const ofs = tileIdx * 64;
            const data = rgb.slice(ofs, ofs + 64); // 8x8
            setTileImage(tile, data, scale);
            if (grid) writeBorder(tile, c);
            ctx.putImageData(tile, x * gridSize, y * gridSize);
          }
        }
        if (grid) {
          const c: RGB = [0x0f, 0x0f, 0x0f];
          const img = ctx.getImageData(0, 0, w, h);
          writeBorder(img, c);
          for (let y = 0; y < h; y++) {
            setRGB(img, w, w - 1, y, c);
          }
          ctx.putImageData(img, 0, 0);
        }
      };
      refreshCanvas();
    }, [rgb, w, h, scale, start[0], start[1]]); // eslint-disable-line

    const _onScroll = (x: number, y: number) => {
      if (start[1] * gridSize > y) {
        // up
        const [tileX, tileY] = [Math.floor(x / gridSize), Math.floor(y / gridSize)];
        if (tileX != start[0] || tileY != start[1]) {
          setStart([tileX, tileY]);
          onScroll && onScroll(tileX, tileY);
        }

        return [tileX * gridSize, tileY * gridSize];
      }

      // down
      const [tileX, tileY] = [Math.ceil(x / gridSize), Math.ceil(y / gridSize)];
      if (tileX != start[0] || tileY != start[1]) {
        setStart([tileX, tileY]);
        onScroll && onScroll(tileX, tileY);
      }
    };

    return (
      <ScrollableCanvas
        width={canvasWidth}
        height={visibleHeight}
        largeWidth={canvasWidth}
        largeHeight={canvasHeight}
        onScroll={_onScroll}
        ref={canvas}
        className={className}
      />
    );
  },
);
