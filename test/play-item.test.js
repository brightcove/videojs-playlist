import QUnit from 'qunit';
import sinon from 'sinon';
import playItem from '../src/play-item';
import playerProxyMaker from './player-proxy-maker';

QUnit.module('play-item');

QUnit.test('will not try to play if paused', function(assert) {
  let player = playerProxyMaker();
  let tryPlay = false;

  player.paused = function() {
    return true;
  };

  player.play = function() {
    tryPlay = true;
  };

  playItem(player, null, {
    sources: [1, 2, 3],
    poster: 'http://example.com/poster.png'
  });

  assert.ok(!tryPlay, 'we did not reply on paused');
});

QUnit.test('will try to play if not paused', function(assert) {
  let player = playerProxyMaker();
  let tryPlay = false;

  player.paused = function() {
    return false;
  };

  player.play = function() {
    tryPlay = true;
  };

  playItem(player, null, {
    sources: [1, 2, 3],
    poster: 'http://example.com/poster.png'
  });

  assert.ok(tryPlay, 'we replayed on not-paused');
});

QUnit.test('will not try to play if paused and not ended', function(assert) {
  let player = playerProxyMaker();
  let tryPlay = false;

  player.paused = function() {
    return true;
  };

  player.ended = function() {
    return false;
  };

  player.play = function() {
    tryPlay = true;
  };

  playItem(player, null, {
    sources: [1, 2, 3],
    poster: 'http://example.com/poster.png'
  });

  assert.ok(!tryPlay, 'we did not replaye on paused and not ended');
});

QUnit.test('will try to play if paused and ended', function(assert) {
  let player = playerProxyMaker();
  let tryPlay = false;

  player.paused = function() {
    return true;
  };

  player.ended = function() {
    return true;
  };

  player.play = function() {
    tryPlay = true;
  };

  playItem(player, null, {
    sources: [1, 2, 3],
    poster: 'http://example.com/poster.png'
  });

  assert.ok(tryPlay, 'we replayed on not-paused');
});

QUnit.test('fires "beforeplaylistitem" and "playlistitem"', function(assert) {
  const player = playerProxyMaker();
  const beforeSpy = sinon.spy();
  const spy = sinon.spy();

  player.on('beforeplaylistitem', beforeSpy);
  player.on('playlistitem', spy);

  playItem(player, null, {
    sources: [1, 2, 3],
    poster: 'http://example.com/poster.png'
  });

  assert.strictEqual(beforeSpy.callCount, 1);
  assert.strictEqual(spy.callCount, 1);
});
