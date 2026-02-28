/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import PropTypes from 'prop-types'

const HTML = (props) => (
  <html {...props.htmlAttributes}>
    <head>
      <script dangerouslySetInnerHTML={{
        __html: `
            (function (w, d, s, l, i) {
                w[l] = w[l] || []; w[l].push({
                    'gtm.start':
                        new Date().getTime(), event: 'gtm.js'
                }); var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                        'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-WHW972G');
          `,
      }}
      />
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
      <link
        rel='stylesheet'
        href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css'
        integrity='sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4'
        crossOrigin='anonymous'
      />

      <link
        rel='stylesheet'
        href='https://use.fontawesome.com/releases/v5.0.13/css/all.css'
        integrity='sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp'
        crossOrigin='anonymous'
      />

      <script dangerouslySetInnerHTML={{
        __html: `
            (function(apiKey){
                (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
                v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){
                    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
                    y=e.createElement(n);y.async=!0;y.src='https://content.stats.8thwall.com/agent/static/'+apiKey+'/pendo.js';
                    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
            })('c7a95ba9-44d0-4b08-6096-e960629162a8');
          `,
      }}
      />

      <script dangerouslySetInnerHTML={{
        __html: `
            window.addEventListener("DOMContentLoaded", () => {
                const buttons = Array.from(document.getElementsByClassName("qrbutton"))

                buttons.forEach(element => {
                    const popover = element.getElementsByClassName("popover__box")[0]
                    element.addEventListener("click", () => toggle(popover))
                })

            })

            function toggle(popover) {

                if (popover.style.visibility == "visible") {
                    popover.style.visibility = "hidden"
                } else {
                    popover.style.visibility = "visible"
                }

                // console.log(popover.style.visibility)
            }
          `,
      }}
      />

      <script src='https://cdn.8thwall.com/web/share/embed8.js' />
      <script src='//cdn.8thwall.com/web/iframe/iframe.js' />
      {props.headComponents}
    </head>
    <body {...props.bodyAttributes}>
      {props.preBodyComponents}
      <div
        key='body'
        id='___gatsby'
        dangerouslySetInnerHTML={{__html: props.body}}
      />
      {props.postBodyComponents}

      <script src='https://unpkg.com/scrollreveal/dist/scrollreveal.min.js' />
      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.sr = ScrollReveal({ reset: false });
              sr.reveal('.slow', { duration: 1450, delay: 0 });
              sr.reveal('.fast', { duration: 800, delay: 0 });
              sr.reveal('.classy', { duration: 1450, delay: 200, scale: 1, distance: '6em' })
          `,
        }}
      />

      <script
        src='https://code.jquery.com/jquery-3.3.1.slim.min.js'
        integrity='sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo'
        crossOrigin='anonymous'
      />
      <script
        src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js'
        integrity='sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ'
        crossOrigin='anonymous'
      />
      <script
        src='https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js'
        integrity='sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm'
        crossOrigin='anonymous'
      />
    </body>
  </html>
)

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}

export default HTML
