# nuskin-svg - Batch update your SVG icons' colors easily
Batch recolor your svg icons easily with this simple command line tool (might code a web / desktop GUI later if i'm motivated enough).

## Install
`npm install -g nuskin`

## Commands
#### recolor
Recolors a single (or all .svg in containing folder if path arg is a dir) .svg file's fill, background or stroke attribute
```nuskin recolor --path <path> --attr [attribute to recolor] --color <color value>```

- `--path`, `-p`: Absolute or relative path to `.svg` file or directory containing `*.svg` files. **required**
- `--color`, `-c`: Valid CSS color value to apply to the svgs' attribute _e.g.: rgba(0,0,0,1), #fff, blue, etc._ **required**
- `--attr`, `-a`: The attribute to apply the new color to. Supports `fill`, `stroke` & `background`. _optional_, default value: `fill` 

>Example:
>`nuskin recolor --path C:/absolute/path/to/directory --color #beeeef --attr fill`
>`nuskin recolor -p ../relative/path/to/file.svg -c rgb(1,234,56) -a background`

#### reset
Removes colors of a single (or all .svg in containing folder if path arg is a dir) .svg file's fill, background, stroke or all attribute(s)
```nuskin reset --path <path> --attr [attribute]```

- `--path`, `-p`: Absolute or relative path to `.svg` file or directory containing `*.svg` files. **required**
- `--attr`, `-a`: The attribute to reset. Supports `fill`, `stroke`, `background`. If none is specified, all attributes will be reset. _optional_

>Example:
>`nuskin reset --path C:/absolute/path/to/directory --attr fill`
>`nuskin reset -p ../relative/path/to/file.svg`

## Request feature or contribute!
Have an idea, a suggestion or want to contribute to the project? Contact me via [email](mailto:hello@olivierlepage.dev), [open an issue](https://github.com/lowebdev/nuskin-svg/issues/new) or start your pull request today!