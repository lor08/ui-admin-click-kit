import { afterEach, vi } from 'vitest';
import { configureUiKit } from '../src/ui/kit';

// No network in unit tests: a component that fetches must be given its
// answer by the spec (vi.stubGlobal('fetch', ...)); anything else fails
// at once instead of knocking on a port that is not there.
vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('fetch is not available in unit tests'))));

// A spec that gives the kit adapters leaves none behind for the next one.
afterEach(() => configureUiKit({}));
