# XRHome i18n Migration Guide

# Background

We’d like to further expand the 8th Wall to other countries, which means localizing our content to the languages native to those countries. One of the first on the list is Japan.  XRHome is currently only available in an en-US locale, though we’d need to also support ja-JP (Japanese) to expand into Japan.

# Overview

Localizing pages in XRHome means we should integrate an internationalization(i18n) framework that would allow us to easily access translation strings without worrying about the underlying details like how the strings are loaded, and how a locale is chosen.

The i18n framework which we will be using for XRHome is [i18next](<https://www.i18next.com/>) with [react-i18next](<https://react.i18next.com/>). This is the same framework powering i18n for lightship.dev and the Payments API checkout pages.

## Translations File Structure

_i18next_ expects translations to be [_organized in JSON format_](<https://www.i18next.com/misc/json-format>). The keys in the JSON object are what _i18next_ uses to access specific translation strings. The values are the strings that _i18next_ will return.

i18next supports [_namespaces_](<https://www.i18next.com/principles/namespaces>), which allows us to logically split up our strings into multiple files. This allows us to load only the strings which are necessary for the page we’re trying to render.

As an example, we can create a _**checkout-pages**_ namespace that contains all the strings needed for the Checkout Pages, and an _**account-pages**_ namespace that contains all strings for the Account Pages.

All of the translations for xrhome will be found in the following directories, where the translations are split by both language and namespace.
```
reality/cloud/xrhome/src/client
 ├─ i18n/
 ├─ en-US/
 ├─ account-pages.json
 ├─ checkout-pages.json
 ├─ ja-JP/
 ├─ account-pages.json
 ├─ checkout-pages.json
```
```json
// i18n/en-US/accounts-pages.json
{
 "team_page.heading": "Team Members",
 "team_page.change_handle.modal.button.confirm": "Change Now",
 "team_page.change_handle.modal.button.cancel": "Cancel",
 ...
}
```

# Style Guide

## Namespace Rules

 1. The namespace should encapsulate **a related set of strings** for pages, views, components, etc. within XRHome.

 1. `account-pages`, `app-pages`, `sign-up-pages` etc.

 2. If the set of strings does not fit into any existing namespaces, these strings should be in their own namespace.

 3. If the set of strings crosses system boundaries, these strings should be in their own namespace.

 1. `geospatial-browser` is used in both XRHome and Lightship.dev

 4. If the set of strings would fit into multiple existing namespaces, these strings should be in their own namespace.

 1. `add-payment-method-modal` appears within `account-pages`, `app-pages`, `sign-up-pages`

 5. If the set of strings is related to **ALL OF XRHOME,** these can be placed in the `common` namespace.

 1. Header, Footer, and common CTA (`Cancel`, `Confirm`, `Save`) strings.

**NOTE:** Assume that anything in the `common` namespace is loaded for _**every**_ page.

## Translation Key Rules

 1. There should multiple levels of context per key. Each level is separated by a `.`

 1. Minimum of two levels of context.

 2. From left to right, the level of context should decrease in scope. In other words, the left-most should be the largest scope, and the right-most should **always describe the contents of the string.**

 3. The left-most context should be no larger in scope than a page. If it is more, consider creating a separate namespace.

 2. Each level of context should use **snake_case**.

| **Namespace** | **String** | **Key** | **Key Structure** |
|-----------------|---------------|-------------------------------------------------|------------------------------------------------------------------|
| `account-pages` | `Change Now` | `team_page.change_handle.modal.button.confirm` | `{page_name}.{component_name}.{ui_element}.{string_identifier}` |
| `common` | `Save` | `button.save` | `{ui_element}.{string_identifier}` |

# Migrating React Component Strings

When migrating strings over to `i18next`, there are four concepts that will be needed / useful:

 1. `useTranslation` hook with the `t` function

 2. `Trans` component

 3. `withTranslationsLoaded` higher-order-component

 4. `Foobar8` Debug Tool

## Using the `useTranslation` Hook with the `t` Function

To use the `t` function we need to import the `useTranslation` hook from `'react-i18next'` like so:
```js
import {useTranslation} from 'react-i18next'
```

Then we can invoke `useTranslation` passing the `namespace` you want to use.
```cpp
const {t} = useTranslation(['your-namespace'])
```

Below is a basic example of how to migrate a string to `i18n-react` using the `t` function.

**Before**
```cpp
// react-component.tsx

const SayHello = () => (
 <p>Hello World!</p>
)
```

Here is our json with our desired text `Hello World`! stored within the key `hello_world` `reality/cloud/xrhome/src/client/i18n/en-US`
```json
// my-namespace.json

{
 "hello_world": "Hello World!"
}
```

####
After
```cpp
// react-component.tsx

import {useTranslation} from 'react-i18next'

const SayHello = () => {
 const {t} = useTranslation(['my-namespace'])

 return (
 <p>{t('hello_world')}</p> // will return <p>Hello World!</p>
 )
}
```

### Interpolation (Example with injected values)
```cpp
// account-logo-image-field.tsx
import {useTranslation} from 'react-i18next'
import {ACCOUNT_MIN_ICON_WIDTH, ACCOUNT_MIN_ICON_HEIGHT} from '../../../shared/account-constants'

const AccountLogoImageField: React.FC = () => {
 const {t} = useTranslation(['account-pages'])
 ...

 return (
 <Form.Group>
 ...
 {t(
 'profile_page.logo_reqs',
 {min_icon_width: ACCOUNT_MIN_ICON_WIDTH, min_icon_height: ACCOUNT_MIN_ICON_HEIGHT}
 )}
 ...
 </Form.Group>
 )
}

export {
 AccountLogoImageField,
}
```
```
// account-pages.json

{
 ...
 "profile_page.logo_reqs": "PNG or JPEG (minimum {{min_icon_width}}x{{min_icon_height}}px)",
 ...
}
```

More on interpolation [here.](<https://www.i18next.com/translation-function/interpolation#basic>)

### Plurals
```cpp
// show-team-length.tsx
import {useTranslation} from 'react-i18next'

const showTeamLength: React.FC = ({teamLength}) => {
 const {t} = useTranslation(['accounts_page'])
 ...

 return (
 <h1>{t('team_page.header.team_length', {count: teamLength})}</h1>
 )
}

export {
 showTeamLength,
}
```
```json
// accounts-pages.json

{
 ...
 "team_page.header.team_length_zero": "You have no one on your team.",
 "team_page.header.team_length_one": "You have one person on your team.",
 "team_page.header.team_length_other": "You have {{count}} people on your team.",
 ...
}
```
```js
`t('team_page.header.team_length', {count: 0})` -> 'You have no one on your team.'
`t('team_page.header.team_length', {count: 1})` -> 'You have one person on your team.'
`t('team_page.header.team_length', {count: 5})` -> 'You have 5 people on your team.'
```

**NOTE:** Plurality for `i18next` is based off the [Intl.PluralRules API](<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules>). This plural example is based off the assumption your `locale` is `en-US` which only supports `_one` and `_other` with `_zero` being a feature the framework offers.

Not all locales have the same support for plurality rules and you could refer to this [tool](<https://jsfiddle.net/6bpxsgd4>) to determine a sufficient output.

### Multiple namespaces

There will be some instances where you will end up needing multiple namespaces in any particular React component. In these case you can simply append the additional namespace in the array parameter of `useTranslation` like so:
```cpp
const {t} = useTranslation(['account-pages', 'common'])
```

**NOTE:** When dealing with multiple namespaces, be aware that any particular translation using the `t()` function will default to the first namespace in the array. If the string you’re migrating uses a different namespace, you’ll have to pass that namespace name in the `ns` optional parameter, like so.
```js
t('button.save') // Will not work.
```
```js
t('button.save', {ns: 'common'}) // => Save
```

## Using the `Trans` Component

In some cases we will be translating string will inline html. Luckily `i18next` has a `Trans` component feature to use.
We can import the `Trans` component like so:
```js
import {Trans} from 'react-i18next'
```

Here’s an example element that you might encounter
```cpp
// account-profile-page.tsx
import {useTranslation, Trans} from 'react-i18next'

const AccountProfilePage: React.FC = React.memo(() => {
 const {t} = useTranslation(['account-pages'])

 return (
 <div>
 ...
 <p>
 Your Public Profile is your own page on
 <LinkOut url=''>
 <server>
 </LinkOut>
 {' '}where you can showcase your work.
 </p>
 ...
 </div>
 )
}

export {
 AccountProfilePage,
}
```
```json
// accounts-pages.json

{
 ...
 "profile_page.blurb": "Your Public Profile is your own page on <1 url=''>8thwall.com</1> where you can showcase your work.",
 ...
}
```

This is what it’ll look like post-migration. In our implementation using `i18next` we are **requiring** that you add the `ns` and `i18nKey` attribute, or the correct translation may not be found.
```tsx
<Trans
 ns='account-pages'
 i18nKey='profile_page.blurb'
 components={{
 1: <LinkOut url='' />
 }}
/>
```

You’ll notice in the json we’ve replaced the `LinkOut` elements with an integer `1` within the `json` file. This is because the `children` of the `Trans` component are indexed so our element is organized like so:
```js
Trans.children: [
 'Your Public Profile is your own page on', // 0
 {children: '<server>'}, // 1
 ' where you can showcase your work.', // 2
]
```

More on this here.
More on the Trans component [here.](<https://react.i18next.com/latest/trans-component>)

## withTranslationsLoaded Higher-Order-Component

The withTranslationsLoaded HOC is a custom-built component which will display an XRHome-styled loader as your translation strings are loaded.
```js
// my-component.tsx

...

export default withTranslationsLoaded(MyComponent)
```

This component should be used to wrap the **root component of a given namespace.** In other words, we should strive to only need to use this once per namespace.

For example, all of the strings in the `checkout-pages` namespace are used by the `payments-checkout-container`, and its descendant components. Therefore, wrapping the payments-checkout-container with this HOC covers all uses of strings from the `checkout-pages` namespace.

## Foobar8 Debug Tool

The Foobar8 debug tool was created to help identify which strings are managed by `i18next`, and which strings are still hardcoded within React components.

You can enable this tool by setting the I18N_MIGRATION_DEBUG_20230118 Buildif to `true`. When this tool is enabled, every string managed by `i18next` will render `Foobar8`.

# String Migration Example Merge Requests

 1. [ [xrhome][i18n] Migrate account profile page non error strings]()

 2. [[xrhome][i18n] Migrate most team page strings]()

 3. [[xrhome] set up incomplete apple signup for invited flow]() (Trans Component Example)

# Questions?

Contact Brandon Nguyen (Deactivated) or Alvin Portillo (Deactivated) for any additional help or questions!
