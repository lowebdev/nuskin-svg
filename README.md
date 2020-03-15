# nuskin-svg - Batch update your SVG icons' colors easily
Why is it so complicated to batch recolor your svg icons? Change your svg icon's fill &amp; stroke colors easily with this simple command line tool (might code a web / desktop GUI later if i'm motivated enough).


## Install
`npm install -g nuskin`


## Commands
#### recolor
```nuskin recolor <path> <color>```

- `<path>`: Relative or absolute path to directory containing `*.svg` files
- `<color>`: Valid CSS color _e.g.: rgba(0,0,0,1), #fff, blue, etc._

>Example:
>`nuskin recolor C:/path/to/directory #beeeef`


## Upcoming changes
### `recolor`
- Function will accept sinlge .svg file as path argument
- Break down required `<color>` argument into optional `[fill]` color, `[background]` for background color, `[stroke]` for stroke color, defaulting to `fill`.


## Request feature or contribute!
Have an idea, a suggestion or want to contribute to the project? Contact me via [email](mailto:hello@olivierlepage.dev), [open an issue](https://github.com/lowebdev/nuskin-svg/issues/new) or start your pull request today!