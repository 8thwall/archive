import React, {useState} from 'react'

import {combine} from '../styles/classname-utils'
import * as classes from './newsletter-input-section.module.scss'

const NewsletterInputSection = () => {
  const [email, setEmail] = useState('')
  const freeTrialSubmit = (e) => {
    e.preventDefault()
    sessionStorage.setItem(
      'free-trial.email',
      email
    )
    window.location.href = '/start-your-free-trial'
  }

  return (
    <section className={combine(classes.gradientBackground, 'small-content')}>
      <div className='row justify-content-center'>
        <div className='col-lg-6 col-md-10 d-flex flex-column align-items-center'>
          <h2 className='text-white text-center'>
            Start a 14-Day Free Trial of 8th Wall
          </h2>
          <form
            className={combine(classes.inputGroup, 'input-group')}
            onSubmit={freeTrialSubmit}
          >
            <input
              className={combine(classes.input, 'form-control')}
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='Enter your work email'
            />
            <button
              className={classes.button}
              type='submit'
              a8='click;click-free-trial-cta;bottom-page-cta'
            >
              Get started
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default NewsletterInputSection
