Bot tools directory
===================

This directory contains archives of the tools we need to auto-install on our
bots.  The full list of build dependencies for DynamoRIO and Dr. Memory is here:

http://code.google.com/p/dynamorio/wiki/HowToBuild
http://code.google.com/p/drmemory/wiki/HowToBuild

The tools installed here are just the subset from that list that the Chromium
buildbot base image is missing.  For example, we don't need to install MSVS.

Windows Tools
-------------

* 7-zip: An archiver we use to produce self-extracting executables.

  7-zip is copyright Igor Pavlov
  License is LGPL+unRAR: http://www.7-zip.org/license.txt
  Current version is 9.20

  Downloaded the most recent stable non-x64 msi from:
  http://sourceforge.net/projects/sevenzip/files/7-Zip/

* CMake: The build file generator used by DynamoRIO and Dr. Memory.

  CMake is copyright 2000-2009 Kitware, Inc., Insight Software Consortium
  License is BSD-alike: http://www.cmake.org/cmake/project/license.html
  Current version is 2.8.9.20121023-g2362b

  This was built from source so that we have the option of using the ninja
  generator on Windows, for which we need at least CMake version 2.8.9.20120822.
  Rough steps to rebuild starting with an existing cmake installation:

  $ git clone git://cmake.org/cmake.git
  $ cd cmake ; mkdir build ; cd build
  $ CC=cl CXX=cl cmake .. -DCPACK_BINARY_ZIP=ON -DCPACK_BINARY_NSIS=OFF
  $ cmake --build . --target package

* WDK/DDK: We're planning to cut this dependence:
  http://code.google.com/p/dynamorio/issues/detail?id=938

Linux Tools
-----------

We don't autobootstrap Linux yet because using the distro package manager is
easy enough and doing a user-local install is trickier.
