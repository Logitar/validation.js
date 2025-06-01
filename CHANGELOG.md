# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Nothing yet.

## [1.0.3] - 2025-06-01

### Fixed

- Allow `0` numerical values as validator arguments. This is technically a _breaking change_, but is not _change_ per say because it should have been done since the beginning.
- Empty strings are now valid in every rule validating strings, except `required`. This is technically a _breaking change_, but is not _change_ per say because it should have been done since the beginning.
- NPM upgrade.

## [1.0.2] - 2025-04-28

### Fixed

- `url` now accepts boolean arguments.

## [1.0.1] - 2025-04-28

### Fixed

- `email` and `url` now accept empty strings (but not white space).

## [1.0.0] - 2025-04-21

### Added

- Implemented Validator, message formatting and validation rules.

[unreleased]: https://github.com/Logitar/js/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/Logitar/js/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/Logitar/js/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Logitar/js/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Logitar/js/releases/tag/v1.0.0
