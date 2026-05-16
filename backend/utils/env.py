from __future__ import annotations

import os
from pathlib import Path


def load_env_file(file_path: Path, override: bool = False) -> bool:
    if not file_path.exists():
        return False

    for raw_line in file_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()

        if not line or line.startswith("#"):
            continue

        if line.startswith("export "):
            line = line[7:].strip()

        if "=" not in line:
            continue

        key, value = line.split("=", 1)
        env_key = key.strip()
        env_value = value.strip()

        if not env_key:
            continue

        if env_value and env_value[0] == env_value[-1] and env_value[0] in {'"', "'"}:
            env_value = env_value[1:-1]

        if override or env_key not in os.environ:
            os.environ[env_key] = env_value

    return True
