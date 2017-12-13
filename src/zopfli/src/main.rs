extern crate zopfli;

use std::mem;
use std::os::raw::c_void;

use zopfli::{Format, Options, compress};
use zopfli::Format::{Deflate, Gzip, Zlib};

// This is just so the file compiles

fn main() {}

// Memory management utility for `kaffeerost` to hook into

#[no_mangle]
pub extern "C" fn alloc(size: usize) -> *mut c_void {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf); // This is JS' responsibility now
    return ptr as *mut c_void;
}

// Actual module code

fn zopfli(format: &Format, data: &[u8]) -> Vec<u8> {
    let mut out = vec![];

    compress(
        &Options::default(),
        &format,
        &data,
        &mut out,
    ).unwrap();

    out
}

#[no_mangle]
pub extern "C" fn deflate(data: &[u8]) -> Vec<u8> {
    zopfli(&Deflate, &data)
}

#[no_mangle]
pub extern "C" fn gzip(data: &[u8]) -> Vec<u8> {
    zopfli(&Gzip, &data)
}

#[no_mangle]
pub extern "C" fn zlib(data: &[u8]) -> Vec<u8> {
    zopfli(&Zlib, &data)
}
