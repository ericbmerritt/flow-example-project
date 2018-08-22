#! /usr/bin/env python

import datetime
import subprocess
import sys

def get_version():
   hash = subprocess.check_output(["git", "log", "--pretty=format:%h",
                                   "-n", "1"])

   commit_count = subprocess.check_output(["git",
                                           "rev-list",
                                           "HEAD",
                                           "--count"]).decode("UTF-8").strip()

   dirty = subprocess.Popen("git diff-index --quiet HEAD --", shell=True).wait()
   timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H.%M.%S")
   release = ".%s-%s" % (hash.decode("utf-8"), timestamp)

   if dirty:
      release = ".dirty-" + timestamp

   return commit_count + release

def main():
    sys.stdout.write(get_version())
    sys.stdout.flush()

if __name__ == "__main__":
    main()
