import CircularBuffer, {
  BufferFullError,
  BufferEmptyError,
} from './circular-buffer';

describe('CircularBuffer', () => {
  test('reading empty buffer should fail', () => {
    // Arrange
    const buffer = new CircularBuffer(10);

    // Act & Assert
    expect(() => buffer.read()).toThrow(BufferEmptyError);
  });

  test('can read an item just written', () => {
    // Arrange
    const buffer = new CircularBuffer(1);

    // Act
    buffer.write('1');

    // Assert
    expect(buffer.read()).toBe('1');
  });

  test('adds items to buffer until buffer is full', () => {
    // Arrange
    const length = 10;
    const buffer = new CircularBuffer(length);
    const inputArray = Array.from({ length: length }, (_, i) => (i + 1).toString());

    // Act
    inputArray.map(i => buffer.write(i));

    // Assert
    expect(buffer.buffer).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

    inputArray.forEach(item => {
      expect(buffer.read()).toBe(item);
    })
  });

  test('write adds items to head only', () => {
    // Arrange
    const buffer = new CircularBuffer(7);
    ['1', '1', '1'].map((item) => buffer.write(item));
    buffer.clear();
    ['1', '2', '3'].map((item) => buffer.write(item));

    // Act & Assert
    expect(buffer.buffer).toEqual([null, null, null, '1', '2', '3', null]);
  });

  test('write adds items to fully circular head', () => {
    // Arrange
    const buffer = new CircularBuffer(7);
    ['1', '1', '1'].map((item) => buffer.write(item));
    buffer.clear();
    ['4', '5', '6', '7', '8', '9'].map((item) => buffer.write(item));

    // Act & Assert
    expect(buffer.buffer).toEqual(['8', '9', null, '4', '5', '6', '7']);
  });

  test('writing to full buffer should fail', () => {
    // Arrange
    const buffer = new CircularBuffer(3);
    buffer.write(1);
    buffer.write(2);
    buffer.write(3);

    // Act & Assert
    expect(() => buffer.write()).toThrow(BufferFullError);
  });

  test('reading and writing to the buffer should be a fully circular', () => {
    // Arrange
    const buffer = new CircularBuffer(3);

    // Act & Assert
    buffer.write('A');
    buffer.write('B');
    buffer.write('C');

    expect(buffer.read()).toBe('A');
    expect(buffer.read()).toBe('B');

    buffer.write('D');
    buffer.write('E');

    expect(buffer.buffer).toEqual(['D', 'E', 'C']);
  });

  test('forcewriting to the buffer should write to tail if space is available', () => {
    // Arrange
    const buffer = new CircularBuffer(7);

    // Act
    ['7', '8', '9', 'A', 'B'].map((item) => buffer.write(item));

    // Assert
    buffer.forceWrite('C');
    buffer.forceWrite('D');

    expect(buffer.buffer).toEqual(['7', '8', '9', 'A', 'B', 'C', 'D']);
  });
  
  test('forcewriting to the buffer should write to oldest item only if space is unavailable', () => {
    // Arrange
    const buffer = new CircularBuffer(7);

    // Prepare Array to be in corners
    ['1', '1', '1', '1', '3', '4', '5'].map((item) => buffer.write(item));
    Array(4).fill(0).map(() => buffer.read());
    ['6', '7', '8', '9'].map((item) => buffer.write(item));

    // Act & Assert
    expect(buffer.buffer).toEqual(['6', '7', '8', '9', '3', '4', '5']);

    buffer.forceWrite('A');
    buffer.forceWrite('B');

    expect(buffer.buffer).toEqual(['6', '7', '8', '9', 'A', 'B', '5']);

    buffer.read();
    buffer.read();

    expect(buffer.buffer).toEqual([null, '7', '8', '9', 'A', 'B', null]);

    buffer.forceWrite('C');
    buffer.forceWrite('D');

    expect(buffer.buffer).toEqual(['D', '7', '8', '9', 'A', 'B', 'C']);
  });
});
