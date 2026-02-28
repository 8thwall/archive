interface VideoInfo {
  type: 'vimeo' | 'youtube'
  id: string
}

// eslint-disable-next-line max-len
const REGEX = /^(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/

const parseVideo = (url: string): VideoInfo => {
  // - Supported YouTube URL formats:
  //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
  //   - http://youtu.be/My2FRPA3Gf8
  //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
  // - Supported Vimeo URL formats:
  //   - http://vimeo.com/25451551
  //   - http://player.vimeo.com/video/25451551
  // - Also supports relative URLs:
  //   - //player.vimeo.com/video/25451551

  if (!url) {
    return null
  }
  const match = url.match(REGEX)
  if (!match) {
    return null
  }
  if (match[3].indexOf('youtu') > -1) {
    return {
      type: 'youtube',
      id: match[6],
    }
  } else if (match[3].indexOf('vimeo') > -1) {
    return {
      type: 'vimeo',
      id: match[6],
    }
  }
  return null
}

export {parseVideo}
