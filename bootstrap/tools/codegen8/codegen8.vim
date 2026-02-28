augroup Codegen8
  autocmd!
  au BufNewFile *.{cc,cpp,h,c++} :exec '%!codegen8' shellescape(expand('%'))
augroup END
