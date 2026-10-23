# WhatsApp service

This directory contains the runnable white-label WhatsMeow service used by the
platform. It exposes health, pairing, session, message, media, and capability
endpoints on port `3001`.

Build it from the repository root with:

```bash
docker build -f services/whatsmeow-ingestor/Dockerfile .
```

Required runtime configuration is `DATABASE_URL` and `OPSIVIO_INTERNAL_TOKEN`.
Use `OPSIVIO_API_URL`, `OPSIVIO_WEBHOOK_URL`, and `OPSIVIO_INSTANCE_NAME` to
connect it to a client's API and brand. The service stores WhatsApp device and
Signal session data in PostgreSQL; it should not be run without persistent DB
storage.

The remaining sections document the upstream WhatsMeow library that powers the
service.
[![Go Reference](https://pkg.go.dev/badge/go.mau.fi/whatsmeow.svg)](https://pkg.go.dev/go.mau.fi/whatsmeow)

whatsmeow is a Go library for the WhatsApp web multidevice API.

## Discussion
Matrix room: [#whatsmeow:maunium.net](https://matrix.to/#/#whatsmeow:maunium.net)

For questions about the WhatsApp protocol (like how to send a specific type of
message), you can also use the [WhatsApp protocol Q&A] section on GitHub
discussions.

[WhatsApp protocol Q&A]: https://github.com/tulir/whatsmeow/discussions/categories/whatsapp-protocol-q-a

## Usage
The [godoc](https://pkg.go.dev/go.mau.fi/whatsmeow) includes docs for all methods and event types.
There's also a [simple example](https://pkg.go.dev/go.mau.fi/whatsmeow#example-package) at the top.

## Features
Most core features are already present:

* Sending messages to private chats and groups (both text and media)
* Receiving all messages
* Managing groups and receiving group change events
* Joining via invite messages, using and creating invite links
* Sending and receiving typing notifications
* Sending and receiving delivery and read receipts
* Reading and writing app state (contact list, chat pin/mute status, etc)
* Sending and handling retry receipts if message decryption fails
* Sending status messages (experimental, may not work for large contact lists)

Things that are not yet implemented:

* Sending broadcast list messages (this is not supported on WhatsApp web either)
* Calls
