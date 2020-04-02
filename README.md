# install-opencv-action

Action that installs (i.e. builds but can also cache) OpenCV. It only compiles and installes the latest version of OpenCV from its GitHub repository and only works on linux. But I am open to pull requests that make this action run also on Windows and Mac and with a desired version number.

---
Inspired by [this repository](https://github.com/jurplel/install-qt-action) - thanks to [jurplel](https://github.com/jurplel) I was able to create this action.


## Options

`dir`

This is the directory prefix that OpenCV will be installed to.

`install-deps`

When set to true, installs all minimum dependencies listed on the OpenCV page before building OpenCV.

`chached`

If set to true, OpenCV won't be built but only its dependencies installed when the `install-deps` option is set to true. Example usage:

~~~~
- name: Cache OpenCV
id: cache-open-cv
uses: actions/cache@v1
with:
    path: ../OpenCV
    key: ${{ runner.os }}-OpenCVCache

- name: Install OpenCV
    uses: florianblume/install-opencv-action@v1
    with:
    cached: ${{ steps.cache-open-cv.outputs.cache-hit }}
~~~~
