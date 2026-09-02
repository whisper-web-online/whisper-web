#!/usr/bin/env bash

set -euo pipefail

# 无论从哪个目录调用，都统一回到 Next.js 工程根目录启动开发服务。
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
CODE_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

cd "${CODE_DIR}"
exec pnpm exec next dev --webpack "$@"
