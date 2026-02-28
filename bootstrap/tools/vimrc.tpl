" Mac OS X default vimrc stuff
""""""""""""""""""""""""""""""

" Configuration file for vim
set modelines=0        " CVE-2007-2438

" Normally we use vim-extensions. If you want true vi-compatibility
" remove change the following statements
set nocompatible    " Use Vim defaults instead of 100% vi compatibility
set backspace=2        " more powerful backspacing

" Don't write backup file if vim is being called by "crontab -e"
au BufWrite /private/tmp/crontab.* set nowritebackup nobackup
" Don't write backup file if vim is being called by "chpass"
au BufWrite /private/etc/pw.* set nowritebackup nobackup

" Expand runtimepath for 8th Wall extensions
""""""""""""""""""""""""""""""""""""""""""""
exe 'set rtp+=' . expand('{SHARE}/vim-ft-bzl')
exe 'set rtp+=' . expand('{SHARE}/vim-operator-user')
exe 'set rtp+=' . expand('{SHARE}/vim-vspec-matchers')
exe 'set rtp+=' . expand('{SHARE}/vim-clang-format')
exe 'set rtp+=' . expand('{SHARE}/vim-capnp')

" 8th Wall customization
"""""""""""""""""""""""""
set expandtab
set shiftwidth=2
set softtabstop=2
filetype plugin indent on
syntax on
set number

" Use system clipboard for actions like 'y' and 'p'
set clipboard=unnamed

" Remap vim 'gq' format operator to use clang-format when applicable.
autocmd FileType c,cpp,objc,java,javascript,typescript map <buffer>gq <Plug>(operator-clang-format)

" Inliner rules
command! Inl exec '%!inliner -i' shellescape(expand('%')) '2> /dev/null'
command! Inliner exec '%!inliner -i' shellescape(expand('%')) '2> /dev/null'

" 8th Wall C++ style
let g:clang_format#style_options = {
      \ "BasedOnStyle" : "google",
      \ "AlignAfterOpenBracket" : "AlwaysBreak",
      \ "ContinuationIndentWidth" : 2,
      \ "BinPackParameters" : "false",
      \ "BinPackArguments" : "false",
      \ "KeepEmptyLinesAtTheStartOfBlocks" : "true"}

" Source codegen8.vim to fill templates when opening new source files.
so {SHARE}/codegen8/codegen8.vim
