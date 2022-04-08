//
// This is only a SKELETON file for the 'Circular Buffer' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

class CircularBuffer {

  tail = 0;
  buffer = [];
  bufferMaxLength;
  size = 0;
  head = 0;

  constructor(bufferLength) {
    this.bufferMaxLength = bufferLength;
    this.buffer = Array(bufferLength).fill(null);
  }

  write(item) {

    if (this.#isBufferFull()) {
      throw new BufferFullError();
    }
    this.size = this.size + 1;
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.bufferMaxLength;
  }

  read() {
    if (this.#isBufferEmpty()) {
      throw new BufferEmptyError();
    }

    var item = this.buffer[this.head];
    this.buffer[this.head] = null;
    this.head = (this.head + 1) % this.bufferMaxLength;
    this.size = this.size - 1;
    return item;
  }

  forceWrite(item) {
    if (!this.#isBufferFull()) {
      this.size = this.size + 1;
      this.buffer[this.tail] = item;
      this.tail = (this.tail + 1) % this.bufferMaxLength;

      return;
    }

    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.bufferMaxLength;
    this.tail = (this.tail + 1) % this.bufferMaxLength;
  }

  clear() {
    this.size = 0;
    this.buffer = this.buffer.map(item => item = null);
  }

  #isBufferEmpty() {
    return this.size == 0;
  }

  #isBufferFull() {
    return this.size >= this.bufferMaxLength;
  }
}

export default CircularBuffer;

export class BufferFullError extends Error {
  constructor() {
    super();
    this.name = "BufferFullError";
    this.message = "Invalid Operation, Buffer is Full. Please use forceWrite() if you still want to overwrite items";
  }
}

export class BufferEmptyError extends Error {
  constructor() {
    super();
    this.name = "BufferFullError";
    this.message = "Invalid Operation, Buffer is Empty. Please use write() to add some items.";
  }
}
