import mmap
from struct import pack, unpack


"""
ORIGINAL CODE:
write_data_to_binary_file accepts a list of integers and a file name.
It writes each integer to the file
in little endian byte order and a C type of 'int'.

MODIFY CODE:
write_data_to_binary_file should accept a list of integers and a file name.
It should write each integer and its squared value
to the file in little endian byte order
using only a single call to the pack function.
The C type of the passed integer should be 'int'
and the C type of its squared value should be 'long long' (not 'unsigned long long').
You should modify the format string ('<i' originally)
and the argument(s) passed to the pack function to do this.
"""
def write_data_to_binary_file(item_list, file_name):
    with open(file_name, "wb") as file_object:
        for item in item_list:
            file_object.write(
                pack("<iq", item, item*item))  # ~~~ MODIFY THIS LINE (i) ~~~




"""
ORIGINAL CODE:
get_memory_map_from_binary_file accepts a file name
and returns a memory map object after parsing the binary file.
The memory map constructor requires an integer as the length argument
that specifies the number of bytes to be read.
Since the original code writes 64 integers to the binary file in 'int' format,
the number of bytes to be read is 64 * 4 = 256 (the standard size of 'int' C type packing is 4).

MODIFY CODE:
get_memory_map_from_binary_file should be able to read the provided file
upto 21 pairs of integers,
the first value in the pair is stored in 'int' C type and the second in 'long long' C type.
Modify the value of the num_bytes variable appropriately in order to accomplish this.
"""
def get_memory_map_from_binary_file(file_name):
    num_bytes = 21 * 12  # ~~~ MODIFY THIS LINE (ii) ~~~

    with open(file_name, "r") as file_object:
        file_map = mmap.mmap(
            file_object.fileno(),
            length=num_bytes,
            access=mmap.ACCESS_READ)

    return num_bytes, file_map




"""
ORIGINAL CODE:
parse_memory_map parses a memory map object passed to it
and returns a list of 64 tuples (since unpack function always returns a tuple),
each of which tuple contains a single integer value from the range [0, 63].
In order to read the values, the function runs 64 times,
and in each iteration,
it unpacks consecutive 4 bytes from the memory map,
which is the standard size of 'int' C type packing.

MODIFY CODE:
parse_memory_map should parse the memory map passed to it,
and unpack 21 tuples from the memory map.
Every time a tuple is unpacked,
it should read in 2 values from the memory map
in a single unpack call.
The first value should be read in as 'int' C type
and the second value as 'long long' C type
in little endian byte order.
Calculate the number of consecutive bytes required
to read in the specified format
and update the unpack call appropriately.
You will have to modify the format string ('<i' originally)
and the number of consecutive bytes being accessed from the memory map.
The function should finally return a list of 21 tuples,
each of which tuple contains 2 integers.
"""
def parse_memory_map(file_map):
    parsed_values = []

    for i in range(21):  # ~~~ MODIFY THIS LINE (iii) ~~~
        parsed_values.append(
            unpack("<iq", file_map[i * 12 : i * 12 + 12]))  # ~~~ MODIFY THIS LINE (iv) ~~~

    return parsed_values




"""
ORIGINAL CODE:
warmup function writes the integers from 0 to 63 to a binary file
by calling write_data_to_binary_file.
It then reads back the file in the form of a memory map,
parses the memory map and prints back the values that were written,
to verify the correctness of implementation.
Note that the printed values are tuples of integers
that were written to the binary file

MODIFY CODE:
Instead of writing the numbers in the range [0, 63],
the warmup function should call write_data_to_binary_file
with a list of all odd integers between 1 and 42, 1 inclusive.
If everything is correctly set up in the functions above,
the warmup function should print:
(1, 1)
(3, 9)
(5, 25)
...
(41, 1681)
"""
def warmup():
    item_list = range(1, 42, 2)  # ~~~ MODIFY THIS LINE (v) ~~~

    write_data_to_binary_file(item_list=item_list, file_name="out_warmup.bin")

    num_bytes, file_map = get_memory_map_from_binary_file("out_warmup.bin")

    with open("out_warmup_bytes.txt", "w") as file_object:
        file_object.write(str(num_bytes))

    parsed_values = parse_memory_map(file_map)

    for item in parsed_values:
        print item


if __name__ == "__main__":
    warmup()
