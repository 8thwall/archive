import type {CheckoutSuccessEvent} from './checkout-types'

const postCheckoutSuccessMessage = (event: CheckoutSuccessEvent) => {
  if (!window.opener) {
    // No parent window. This was not opened in a popup.
    // We don't need to notify anything of the checkout success.
    return
  }

  window.opener.postMessage({
    type: '8w::checkout::success',
    ...event,
  }, '*')
}

export {
  postCheckoutSuccessMessage,
}
