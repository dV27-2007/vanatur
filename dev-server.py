from __future__ import annotations

import os
import signal
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent
ENTRY_FILE = ROOT_DIR / "server.py"
WATCHED_FILES = [
    ENTRY_FILE,
    ROOT_DIR / "package.json",
    ROOT_DIR / "backend" / "requirements.txt",
    ROOT_DIR / ".env",
    ROOT_DIR / ".env.example",
]
WATCHED_DIRECTORIES = [ROOT_DIR / "backend", ROOT_DIR / "public", ROOT_DIR / "scripts"]
POLL_INTERVAL_SECONDS = 0.4
RESTART_DELAY_SECONDS = 0.2
SHUTDOWN_TIMEOUT_SECONDS = 5

child_process: subprocess.Popen | None = None
shutting_down = False
restart_pending = False
restart_reason = ""


def format_time() -> str:
    return datetime.now().strftime("%H:%M:%S")


def log(message: str) -> None:
    print(f"[dev {format_time()}] {message}")


def safe_relative(target_path: Path) -> str:
    try:
        relative_path = target_path.relative_to(ROOT_DIR)
        return str(relative_path) or target_path.name
    except ValueError:
        return str(target_path)


def iter_directory_files(root_dir: Path):
    if not root_dir.exists():
        return

    for current_root, dir_names, file_names in os.walk(root_dir):
        dir_names.sort()
        file_names.sort()
        current_path = Path(current_root)

        for file_name in file_names:
            yield current_path / file_name


def build_snapshot() -> dict[str, int]:
    snapshot: dict[str, int] = {}

    for file_path in WATCHED_FILES:
        if file_path.exists():
            snapshot[str(file_path)] = file_path.stat().st_mtime_ns

    for directory in WATCHED_DIRECTORIES:
        for file_path in iter_directory_files(directory):
            snapshot[str(file_path)] = file_path.stat().st_mtime_ns

    return snapshot


def describe_change(previous: dict[str, int], current: dict[str, int]) -> str:
    previous_keys = set(previous)
    current_keys = set(current)

    added = sorted(current_keys - previous_keys)
    if added:
        return f"novyy fail {safe_relative(Path(added[0]))}"

    removed = sorted(previous_keys - current_keys)
    if removed:
        return f"udalion fail {safe_relative(Path(removed[0]))}"

    for key in sorted(current_keys):
        if previous.get(key) != current.get(key):
            return f"izmenen fail {safe_relative(Path(key))}"

    return "obnovlenie failov"


def start_server() -> None:
    global child_process

    if shutting_down:
        return

    child_process = subprocess.Popen(
        [sys.executable, str(ENTRY_FILE)],
        cwd=ROOT_DIR,
        env=os.environ.copy(),
    )


def stop_server() -> None:
    global child_process

    if child_process is None:
        return

    if child_process.poll() is not None:
        child_process = None
        return

    child_process.terminate()

    try:
        child_process.wait(timeout=SHUTDOWN_TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        child_process.kill()
        child_process.wait(timeout=SHUTDOWN_TIMEOUT_SECONDS)
    finally:
        child_process = None


def restart_server(reason: str) -> None:
    global restart_pending, restart_reason

    if shutting_down:
        return

    log(f"Obnaruzheny izmeneniya: {reason}. Perezapusk servera...")
    restart_pending = False
    restart_reason = ""
    stop_server()
    start_server()


def handle_shutdown(_signum=None, _frame=None) -> None:
    global shutting_down

    if shutting_down:
        return

    shutting_down = True
    stop_server()
    sys.exit(0)


def main() -> None:
    global child_process, restart_pending, restart_reason

    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGTERM, handle_shutdown)

    log("Zapusk development watcher...")
    log("Sleduyu za backend/, public/, scripts/ i config-faylami")

    previous_snapshot = build_snapshot()
    start_server()
    pending_since = 0.0

    while not shutting_down:
        if child_process is not None:
            exit_code = child_process.poll()
            if exit_code is not None:
                child_process = None

                if restart_pending:
                    restart_server(restart_reason or "izmeneniya v faylah")
                    previous_snapshot = build_snapshot()
                    pending_since = 0.0
                    time.sleep(POLL_INTERVAL_SECONDS)
                    continue

                if exit_code != 0:
                    log(f"Server zavershilsya s kodom {exit_code}. Zhdu sleduyushchie izmeneniya...")

        current_snapshot = build_snapshot()
        if current_snapshot != previous_snapshot:
            restart_pending = True
            restart_reason = describe_change(previous_snapshot, current_snapshot)
            pending_since = time.monotonic()
            previous_snapshot = current_snapshot

        if restart_pending and time.monotonic() - pending_since >= RESTART_DELAY_SECONDS:
            restart_server(restart_reason)
            previous_snapshot = build_snapshot()
            pending_since = 0.0

        time.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    main()
