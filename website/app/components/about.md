# About Snek
Snek is a friendly but dumb alternative to hydra for hosting your own personal
package repositories.

![snek](/static/snek.png)

## Goals

### Ease of Setup
Nix is already hard to get into and has a lot of usability problems. This is in
no way helped by how finnicky it can be to deploy Hydra.

Snek's goal is to have you packaging and deploying personal package descriptions
with as little friction as possible.

### Ease of Use
As developer-facing tools, most of the nix environment is 

## Caveats
### Build Isolation
Snek does not provide the same environment-isolation guarantees as hydra.

Snek builds packages from in shared cache, and trusts nix to provide sanitary 
build environments. This can lead to issues with your host operating system's
environment leaking into your build environment.

### Scalability
Snek is not backed by a database. In order to be drop-in installable, it uses
log files stored on the filesystem.
