import React from 'react'
import {css} from '@emotion/react'

const HeaderText = ({text}) => (
  <section
    css={css`background-image: linear-gradient(to bottom right, #D9D0E3, #D5D7E4)`}
  >
    <div className='row justify-content-center'>
      <div className='col-lg-10'>
        <h1 css={css`"padding-top: 0.25em;`}>{text}</h1>
      </div>
    </div>
  </section>
)

export default HeaderText
