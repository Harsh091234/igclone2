export function toArrayBuffer(
  input: ArrayBuffer | ArrayBufferView,
): ArrayBuffer {
  if (input instanceof ArrayBuffer) {
    return input.slice(0); // copy
  }

  const view = input;
  return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
}
