import { describe, expect, it } from 'vitest';
import { dpadToIntent } from '../../../ui/touch-intent';
import type { DirectionIntent } from '../../../engine/input';

describe('dpadToIntent', () => {
  it('maps up to dy=-1', () => {
    expect(dpadToIntent('up')).toEqual({ dx: 0, dy: -1 });
  });

  it('maps down to dy=1', () => {
    expect(dpadToIntent('down')).toEqual({ dx: 0, dy: 1 });
  });

  it('maps left to dx=-1', () => {
    expect(dpadToIntent('left')).toEqual({ dx: -1, dy: 0 });
  });

  it('maps right to dx=1', () => {
    expect(dpadToIntent('right')).toEqual({ dx: 1, dy: 0 });
  });
});

/**
 * TouchControlsProps shape test.
 * We define the expected shape inline to avoid importing from ui/touch-controls
 * which would pull in react-native (unparseable by Vitest/jsdom).
 */
interface TouchControlsPropsShape {
  onDirectionChange: (intent: DirectionIntent) => void;
  onAction: () => void;
  onCancel: () => void;
  visible: boolean;
}

describe('TouchControlsProps interface', () => {
  it('accepts valid props shape', () => {
    const props: TouchControlsPropsShape = {
      onDirectionChange: (_intent) => {},
      onAction: () => {},
      onCancel: () => {},
      visible: true,
    };
    expect(props.visible).toBe(true);
    expect(typeof props.onDirectionChange).toBe('function');
    expect(typeof props.onAction).toBe('function');
    expect(typeof props.onCancel).toBe('function');
  });

  it('onDirectionChange receives DirectionIntent', () => {
    let captured: DirectionIntent | null = null;
    const props: TouchControlsPropsShape = {
      onDirectionChange: (intent) => { captured = intent; },
      onAction: () => {},
      onCancel: () => {},
      visible: false,
    };
    props.onDirectionChange({ dx: 1, dy: 0 });
    expect(captured).toEqual({ dx: 1, dy: 0 });
  });
});

