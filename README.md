![Preview](https://github.com/goulinkh/link-previews/raw/main/resources/project-dark.jpg#gh-dark-mode-only)
![Preview](https://github.com/goulinkh/link-previews/raw/main/resources/project-light.jpg#gh-light-mode-only)

# 👁️‍🗨️ Link previews

---

This is a little experimentation as an attempt to bring Wikipedia page previews to any web page.

Link to the blog post: https://goulin.fr/blog/wikipedia-like-link-previews

## Start the demo locally

```bash
yarn install
yarn start:demo
```

## Start the server

1. Remove the mockup data script from `src/client/index.html`:

```diff
- <script src="/mock-data.js"></script>
```

2. Start the client and server:

```bash
# Listens at :3000
yarn start:demo
# Listens at :3001
yarn start:server
```
