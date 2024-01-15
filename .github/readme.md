<h1 align="center">Lemmy UI<br />
<div align="center">
<img src="https://raw.githubusercontent.com/dockur/lemmy-ui/master/.github/logo.svg" title="Logo" style="max-width:100%;" width="128" />
</div>
<div align="center">
  
[![Build]][build_url]
[![Version]][tag_url]
[![Size]][tag_url]
[![Pulls]][hub_url]

</div></h1>

Multi-platform docker image of [Lemmy UI](https://github.com/LemmyNet/lemmy-ui), a link aggregator and forum for the fediverse.

## How to use

Via `docker-compose`

```yaml
version: "3"
services:
  lemmy-ui:
    container_name: lemmy-ui
    image: dockurr/lemmy-ui
    environment:
      - LEMMY_UI_HTTPS=true
      - LEMMY_UI_LEMMY_INTERNAL_HOST=lemmy:8536
      - LEMMY_UI_LEMMY_EXTERNAL_HOST=domain.tld
    ports:
      - 1234:1234
    restart: on-failure
    stop_grace_period: 1m
```

## Configuration

The following environment variables can be used to configure lemmy-ui:

| `ENV_VAR`                      | type     | default          | description                                                                         |
| ------------------------------ | -------- | ---------------- | ----------------------------------------------------------------------------------- |
| `LEMMY_UI_HOST`                | `string` | `0.0.0.0:1234`   | The IP / port that the lemmy-ui isomorphic node server is hosted at.                |
| `LEMMY_UI_LEMMY_INTERNAL_HOST` | `string` | `0.0.0.0:8536`   | The internal IP / port that lemmy is hosted at. Often `lemmy:8536` if using docker. |
| `LEMMY_UI_LEMMY_EXTERNAL_HOST` | `string` | `0.0.0.0:8536`   | The external IP / port that lemmy is hosted at. Often `DOMAIN.TLD`.                 |
| `LEMMY_UI_HTTPS`               | `bool`   | `false`          | Whether to use https.                                                               |
| `LEMMY_UI_EXTRA_THEMES_FOLDER` | `string` | `./extra_themes` | A location for additional lemmy css themes.                                         |
| `LEMMY_UI_DEBUG`               | `bool`   | `false`          | Loads the [Eruda](https://github.com/liriliri/eruda) debugging utility.             |
| `LEMMY_UI_DISABLE_CSP`         | `bool`   | `false`          | Disables CSP security headers                                                       |
| `LEMMY_UI_CUSTOM_HTML_HEADER`  | `string` |                  | Injects a custom script into `<head>`.                                              |

[build_url]: https://github.com/dockur/lemmy-ui/
[hub_url]: https://hub.docker.com/r/dockurr/lemmy-ui/
[tag_url]: https://hub.docker.com/r/dockurr/lemmy-ui/tags

[Build]: https://github.com/dockur/lemmy-ui/actions/workflows/build.yml/badge.svg
[Size]: https://img.shields.io/docker/image-size/dockurr/lemmy-ui/latest?color=066da5&label=size
[Pulls]: https://img.shields.io/docker/pulls/dockurr/lemmy-ui.svg?style=flat&label=pulls&logo=docker
[Version]: https://img.shields.io/docker/v/dockurr/lemmy-ui/latest?arch=amd64&sort=semver&color=066da5
