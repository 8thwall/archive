import React from 'react'
import {Helmet} from 'react-helmet-async'

const TwitterLoadEmbedScript = () => (
  /* eslint-disable max-len */
  // This code was taken from the Twitter documentation pages, and will be used to load embed
  // twitter posts inside our post page raw HTML content. We need to load this separately because
  // most modern browser will not load <script> tag injected by the DOM `innerHTML`.
  // Sources: developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
  /* eslint-enable max-len */
  <Helmet>
    <script>
      {`
        window.twttr = (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
          if (d.getElementById(id)) return t;
          js = d.createElement(s);
          js.id = id;
          js.src = "https://platform.twitter.com/widgets.js";
          fjs.parentNode.insertBefore(js, fjs);

          t._e = [];
          t.ready = function(f) { t._e.push(f); };
          return t;
        }(document, "script", "twitter-wjs"));
      `}
    </script>
  </Helmet>
)

export {
  TwitterLoadEmbedScript,
}
