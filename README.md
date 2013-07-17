# atavist

Get a site going really, really fast with atavist. Build a template, then just write markdown – it's that simple. Very customisable and adaptable, it's build on the solid foundation of [express](http://expressjs.com) and Node.

## Install

```
npm install atavist
```

## Building a site demo

To get Atavist going you need a few things:

1. `app.js` – your main site file.
2. **Some content.** Just markdown files in a folder called `content`. Use whatever directory structure you want.
3. **A template**. This is simply HTML with some special placeholder variables.

My directory structure looks like this:

```
.
├── app.js
├── content
│   └── index.md
└── template
    └── index.html
```

Setup your `app.js` something like this:

```javascript
var atavist = require('atavist');

// Setup atavist, telling it where your content is
atavist.setup({
  content: __dirname + '/content',
  template: __dirname + '/template'
}, function (err, siteData) {
  if (err) return console.error(err);

  // Start the server!
  atavist.start(siteData, function () {
    console.log('Atavist up at %s.', "http://localhost:" + this.address().port);
  });
});
```

I have `content/index.md` as follows, to be served at the root of the site:

```markdown
# Atavist

It's great.
```

And my template (`index.html`) is a really simple HTML page with two variables: `title` and `html`. These are some of the data you can use in your templates to build a site.

```html
<!doctype html>
<meta charset=utf-8>
<title>{{{ title }}}</title>

<style type="text/css">
  body {
    margin: 5em;
    font: 15px/1.5 'Myriad Pro' sans-serif;
    color: #333;
  }
</style>

{{{ html }}}
```

To run atavist, run `node app.js` and hey presto... a site!

## Files and directory structure

Atavist figures out the URL structure for your site as follows:

File Path | Resulting URL
---|---
`content/index.md` | `/`
`content/my-article.md` | `/my-article`
`content/posts/index.md` | `/posts`
`content/posts/a-post.md` | `/posts/a-post`

If you have a file and a directory + index that would have the same URL, the file takes precedence.

All files are parsed as Markdown regardless of file extension.

## Frontmatter

Atavist supports JSON frontmatter in your markdown files, and there are a couple of special pieces of data, detailed below:

```markdown
{{{
  "layout": "post",
  "title": "My Great Post",
  "tags": ["some", "nice", "tags"],
  "category": "Musings"
}}}

# Great Post

Something good here...
```

Atavist supports the following special frontmatter:

Key | Use
---|---
`layout` | Changes the layout used for the file. Default is `index`.
`title` | Changes the title of the page. Default is the content of the first tag on the page.

## Config

Atavist is very configurable. The following data is supported when calling `atavist.setup`.

Key | Use
---|---
port | Port that the server starts on. Default is `8000`.
content | Content directory
template | Template directory
public | Public files directory (for CSS, Javascript, fonts etc)
engine | Template engine. Default is `hogan`.
extension | Template file extension. Default is `html`.
logger | Logger to use. Default is `dev`. See [Connect docs](http://www.senchalabs.org/connect/middleware-logger.html).
compress | Use gzip? Default is `true`.

Please note that all paths should be absolute!

## License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

