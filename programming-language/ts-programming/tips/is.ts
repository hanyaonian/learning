/**
 * @description is 的使用场景说明, 类型保护
 * @see {link https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates}
 */

// 以下是工作中遇到的case, 不同平台的播放器类型保护

interface EmbedPlayerType {
  platform: "youtube"; // ...
  player: any;
  muted: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  size?: { width: number; height: number };
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  // todo...more
}

type Player = HTMLVideoElement | EmbedPlayerType;

function isNativePlayer(player: Player): player is HTMLVideoElement {
  return player instanceof HTMLVideoElement;
}

function onCanPlay(player: Player) {
  // ERROR: Property 'platform' does not exist on type 'Player'.
  // console.log(`player - ${player.platform ?? "native"} is playable`);

  // CORRECT:
  console.log(
    `player - ${
      isNativePlayer(player) ? "native" : player.platform
    } is playable`
  );
}
