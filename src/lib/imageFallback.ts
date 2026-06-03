import type { SyntheticEvent } from 'react';

export function hideBrokenImage(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.classList.add('img--broken');
}
