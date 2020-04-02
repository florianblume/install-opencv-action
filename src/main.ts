import * as process from "process";
import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run() {
  try {
    const dir = (core.getInput("dir") || process.env.RUNNER_WORKSPACE) + "/OpenCV";
    const version = core.getInput("version");

    // Qt installer assumes basic requirements that are not installed by
    // default on Ubuntu.
    if (core.getInput("install-deps") == "true") {
      await exec.exec("sudo add-apt-repository \"deb http://security.ubuntu.com/ubuntu xenial-security main\"");
      await exec.exec("sudo apt-get update");
      await exec.exec("sudo apt-get remove x264 libx264-dev -y");
      await exec.exec("sudo apt-get install build-essential checkinstall cmake pkg-config yasm -y");
      await exec.exec("sudo apt-get install git gfortran libjpeg8-dev libjasper1 libjasper-dev libpng-dev -y");
      await exec.exec("sudo apt-get install libavcodec-dev libavformat-dev libswscale-dev libdc1394-22-dev -y");
      await exec.exec("sudo apt-get install libxine2-dev libv4l-dev -y");
      await exec.exec("sudo apt-get install libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev -y");
      await exec.exec("sudo apt-get install qt5-default libgtk2.0-dev libtbb-dev -y");
      await exec.exec("sudo apt-get install libatlas-base-dev -y");
      await exec.exec("sudo apt-get install libfaac-dev libmp3lame-dev libtheora-dev -y");
      await exec.exec("sudo apt-get install libvorbis-dev libxvidcore-dev -y");
      await exec.exec("sudo apt-get install libopencore-amrnb-dev libopencore-amrwb-dev -y");
      await exec.exec("sudo apt-get install x264 v4l-utils -y");
    }

    if (core.getInput("cached") != "true") {
      await exec.exec("git clone https://github.com/opencv/opencv.git");
      await exec.exec("git clone https://github.com/opencv/opencv_contrib.git");
      await exec.exec("cmake -S opencv -B opencv/build -D CMAKE_BUILD_TYPE=RELEASE \
                        -D CMAKE_INSTALL_PREFIX=/usr/local \
                        -D INSTALL_C_EXAMPLES=ON \
                        -D INSTALL_PYTHON_EXAMPLES=ON \
                        -D WITH_TBB=ON \
                        -D WITH_V4L=ON \
                        -D WITH_QT=ON \
                        -D WITH_OPENGL=ON \
                        -D OPENCV_EXTRA_MODULES_PATH=./opencv_contrib/modules \
                        -D BUILD_EXAMPLES=ON ..");
      await exec.exec("make -j10 -C opencv/build");
    }
    // Installation is fast and can be done from the cached built binaries
    await exec.exec("sudo make -C opencv/build install");
    // Clean up
    await exec.exec("rm -rf opencv");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();