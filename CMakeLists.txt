cmake_minimum_required(VERSION 3.17)
project(JsUtil)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

if (CMAKE_CXX_COMPILER_ID STREQUAL "CLANG")
    target_compile_options(JsUtil PRIVATE -Werror -Wall -Wextra -pedantic)
elseif (CMAKE_CXX_COMPILER_ID STREQUAL "MSVC")
    target_compile_options(JsUtil PRIVATE /W4)
endif ()

add_subdirectory(cpp)
