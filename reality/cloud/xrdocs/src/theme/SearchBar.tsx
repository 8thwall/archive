import React from 'react'
import SearchBar from '@theme-original/SearchBar'

// There is a known edge case in Docusaurus where algolia recent search result will not redirect
// people to the right URL in current context (language and version) as documented here:
// https://github.com/facebook/docusaurus/issues/5880#issuecomment-1016674530
//
// This is a temporary fix by disable the algolia recent search feature.
// TODO (tri) remove this when the above issue is fixed
export default function SearchBarWrapper(props: {}) {
  return (
    <SearchBar disableUserPersonalization {...props} />
  )
}
