# Run a LLM model on your laptop

In this article, I will show you the steps to run a LLaMA in your Mac.

Thanks to the great work by Meta, ggerganov, and the communities ^ ^.

## Prerequisite

- A Mac with (I dont know the requirement of Windows) silicon chip.
- [homebrew](https://brew.sh/)

My laptop: Macbook Air M1 - 16g - 512g.

## 1. prepare dependencies & source code

- installing git, wget, python, cmake(llama.cpp is written in C)

```sh
brew install cmake python@3.10 git wget
```

- clone the source code

```sh
git clone https://github.com/ggerganov/llama.cpp
```

- build llama.cpp source code

```sh
cd llama.cpp

make

# or using cmake
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

- installing python dependencies

```sh
# create a virtual env
python3 -m venv venv

# activate venv
source venv/bin/activate

./venv/bin/pip install torch numpy sentencepiece
```

## 2. prepare weights and convert

- download data (multiple options), and put the weights in the folder `models` in `llama.cpp`
  0. [official way](https://forms.gle/jk851eBVbX1m5TAv5)
  1. from [pyllama](https://github.com/juncongmoo/pyllama)
  2. Bittorrent, such as [this](https://github.com/shawwn/llama-dl) (it may be removed)

- [guide](https://github.com/ggerganov/llama.cpp#prepare-data--run)

```sh
# in llama.cpp folder

# install Python dependencies
python -m pip install -r requirements.txt

# convert the 7B model to ggml FP16 format
python convert.py models/7B/

# quantize the model to 4-bits (using q4_0 method)
./quantize ./models/7B/ggml-model-f16.bin ./models/7B/ggml-model-q4_0.bin q4_0
# ./quantize ./models/7B/ggml-model-f16.bin ./models/7B/ggml-model-q4_0.bin 2

# run the inference
./main -m ./models/7B/ggml-model-q4_0.bin -n 128
```

## 3. start chatting with your local bot

```sh
# default arguments using a 7B model
./examples/chat.sh
```

the `chat` script is like below, that means you can change the prompts by changing the txt file.

```sh
#!/bin/bash
cd `dirname $0`
cd ..

# Important:
#
#   "--keep 48" is based on the contents of prompts/chat-with-bob.txt
#
./main -m ./models/7B/ggml-model-q4_0.bin -c 512 -b 1024 -n 256 --keep 48 \
    --repeat_penalty 1.0 --color -i \
    -r "User:" -f prompts/chat-with-bob.txt
```

Have fun!

## To Be Continue

`ggerganov` also made `whisper` avalible, how about connect whisper & llama? I will try to connect them asap.
