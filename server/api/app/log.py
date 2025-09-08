import json
import os
import sys
import time
import uuid
from typing import Any, Dict, Optional

_LEVELS = {"DEBUG": 10, "INFO": 20, "WARN": 30, "ERROR": 40}

class Logger:
    """
    Usage:
      log = Logger()                               # level from LOG_LEVEL env (default INFO)
      log("hello", user="u1")                      # INFO
      log("debug", "details", a=1)                 # DEBUG
      log("warn", "something odd", ctx="x")        # WARN
      log.error("boom", exc=e)                     # ERROR (shorthand)
      with log.span("process_batch", files=n):     # timing/span helper
          ... work ...
    """
    def __init__(self, service: str = "photo-ml-backend",
                 level: Optional[str] = None,
                 stream = sys.stdout):
        self.service = service
        self.stream = stream
        lvl = (level or os.getenv("LOG_LEVEL", "INFO")).upper()
        self.min_level = _LEVELS.get(lvl, 20)

    def __call__(self, *args, **fields):
        if len(args) == 0:
            raise ValueError("Logger requires at least a message")
        if len(args) == 1:
            level, message = "INFO", args[0]
        else:
            level, message = args[0].upper(), args[1]
            if level not in _LEVELS:
                level, message = "INFO", args[0]

        self._emit(level, message, fields)

    def debug(self, message: str, **fields): self._emit("DEBUG", message, fields)
    def info(self,  message: str, **fields): self._emit("INFO",  message, fields)
    def warn(self,  message: str, **fields): self._emit("WARN",  message, fields)
    def error(self, message: str, **fields): self._emit("ERROR", message, fields)

    def _emit(self, level: str, message: str, fields: Dict[str, Any]):
        if _LEVELS[level] < self.min_level:
            return
        record = {
            "service": self.service,
            "level": level,
            "message": message,
            "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
        if fields:
            record.update(fields)
        try:
            self.stream.write(json.dumps(record, ensure_ascii=False) + "\n")
        except Exception:
            self.stream.write(f"[{record['ts']}] {self.service} {level}: {message} {fields}\n")
        self.stream.flush()

    def span(self, name: str, **fields):
        return _Span(self, name, fields)

class _Span:
    def __init__(self, log: Logger, name: str, fields: Dict[str, Any]):
        self.log = log
        self.name = name
        self.fields = fields or {}
        self.fields.setdefault("span_id", str(uuid.uuid4()))

    def __enter__(self):
        self.t0 = time.perf_counter()
        self.log("debug", f"{self.name}: start", **self.fields)
        return self

    def __exit__(self, exc_type, exc, tb):
        ms = (time.perf_counter() - self.t0) * 1000.0
        base = {**self.fields, "duration_ms": round(ms, 2)}
        if exc:
            self.log("error", f"{self.name}: error", **base, error=str(exc))
        else:
            self.log("debug", f"{self.name}: end", **base)
