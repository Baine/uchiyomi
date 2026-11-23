// TRANSLATE_ENGINE_URL is preferred, but a server that does not answer must not stop translation: with
// TRANSLATE_FALLBACK (default on) the local model takes over, and only when one is installed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { engineUrl } from '../src/lib/translate/engine';

test('engineUrl: the configured server wins while it answers', () => {
  assert.equal(engineUrl('http://gpu:8080', 'large', true), 'http://gpu:8080');
});

test('engineUrl: a silent server falls back to the installed local model', () => {
  assert.equal(engineUrl('http://gpu:8080', 'large', false), '');
  assert.equal(engineUrl('http://gpu:8080', 'small', false), '');
});

test('engineUrl: no local model means the configured server stays', () => {
  assert.equal(engineUrl('http://gpu:8080', null, false), 'http://gpu:8080');
});

test('engineUrl: nothing configured stays local', () => {
  assert.equal(engineUrl('', 'large', false), '');
  assert.equal(engineUrl('', null, true), '');
});

test('engineUrl: TRANSLATE_FALLBACK=off never falls back', () => {
  process.env.TRANSLATE_FALLBACK = 'off';
  try {
    assert.equal(engineUrl('http://gpu:8080', 'large', false), 'http://gpu:8080');
  } finally { delete process.env.TRANSLATE_FALLBACK; }
});
