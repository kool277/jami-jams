import hashlib
import json
import sys
from pathlib import Path


def read_versions(versions_file: Path) -> dict:
    if not versions_file.exists():
        return {}

    with open(versions_file) as f:
        return json.load(f)



def main() -> None:
    here = Path(__file__).parent
    versions_file = here / "versions.json"

    class_name = sys.argv[1]
    version = sys.argv[2]
    filename = sys.argv[3]

    versions = read_versions(versions_file)

    md5_hash = hashlib.md5()

    with open(here / "jams" / filename, "rb") as jar:
        md5_hash.update(jar.read())

    versions[class_name] = {
        "version": version,
        "filename": filename,
        "md5": md5_hash.hexdigest(),
    }

    with open(versions_file, "w") as f:
        json.dump(versions, f, indent=4)


if __name__ == "__main__":
    main()
