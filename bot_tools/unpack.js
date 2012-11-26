// Copyright (c) 2012 Google, Inc
//
// Unpacks the custom tools needed to build and test DynamoRIO and Dr. Memory on
// the Chromium buildbots.
//
// Previously we had a batch script for this, but JScript provides more
// flexibility.

// Globals.
var FS = new ActiveXObject('Scripting.FileSystemObject');
var SH = new ActiveXObject('WScript.Shell');
var CWD = FS.GetFolder('.').path;

// Line printing shorthand.
function PrintLn(message) {
  WScript.StdOut.WriteLine(message);
}

function FatalError(message) {
  PrintLn(message);
  WScript.Quit(1);
}

// Runs a shell command without any windows or output.
function RunCmd(cmd) {
  return SH.Run(cmd,
                0,  // Hides the window.
                true);  // Waits until process exit.
}

function Unpack7zip() {
  PrintLn('Unpacking 7zip...');
  if (FS.FolderExists('7zip'))
    FS.DeleteFolder('7zip', true/*force*/);
  // CWD might have spaces, but quoting the paths doesn't work.
  var res = RunCmd('msiexec /quiet /a ' + CWD + '\\7zip.msi /passive ' +
                   'TARGETDIR=' + CWD + '\\7zip');
  if (res != 0) {
    FatalError('Error unpacking 7zip.');
  }
  PrintLn('Done unpacking 7zip.');
}

function UnpackCMake() {
  PrintLn('Unpacking CMake...');
  // Delete existing files.
  if (FS.FolderExists('cmake'))
    FS.DeleteFolder('cmake', true/*force*/);
  if (FS.FolderExists('cmake_unpacked'))
    FS.DeleteFolder('cmake_unpacked', true/*force*/);

  // Unzip into cmake_unpacked.  If we drop 7zip, we can use unzip.js from
  // depot_tools.
  RunCmd(CWD + '\\7zip\\Files\\7-zip\\7z.exe x -y ' + CWD + '\\cmake.zip ' +
         '-ocmake_unpacked');

  // Get the top-level directory and move it to ./cmake.
  var subdirs = new Enumerator(FS.GetFolder('cmake_unpacked').SubFolders);
  var subdir = subdirs.item();
  subdirs.moveNext();
  if (!subdirs.atEnd()) {
    FatalError('cmake.zip had more than one top level dir');
  }
  subdir.Move('cmake');
  FS.DeleteFolder('cmake_unpacked');

  // Run cmake --version to check that things work.
  var proc = SH.Exec(CWD + '\\cmake\\bin\\cmake.exe --version');
  WScript.StdOut.Write(proc.StdOut.ReadAll());
  if (proc.ExitCode != 0) {
    FatalError('Failed unpacking CMake.');
  }
  PrintLn('Done unpacking CMake.');
}

// Returns true if the target directory doesn't exist or is older than the
// archive.
function ShouldUnpack(archive, dir) {
  if (!FS.FolderExists(dir))
    return true;
  return (FS.GetFolder(dir).DateLastModified <
          FS.GetFile(archive).DateLastModified);
}

function Main() {
  PrintLn('Unpacking bot tools in ' + CWD);
  if (ShouldUnpack('7zip.msi', '7zip')) {
    Unpack7zip();
  }
  if (ShouldUnpack('cmake.zip', 'cmake')) {
    UnpackCMake();
  }
  PrintLn('Tools unpacked.');
  WScript.Quit(0);
}

Main();
